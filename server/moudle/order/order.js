var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
const sqlConfig = require("../../DB/sqlConfig");
const orderTable = sqlConfig.configureName.ORDERLIST;
const ORDER_APPROVE = sqlConfig.configureName.ORDER_APPROVE;
const ORDER_FLOW_LIST = sqlConfig.configureName.ORDE_FLOW_RECORD;
const backMoney_table = sqlConfig.configureName.BACKMONEYLIST;
var searchParam = `o.id,o.order_type,o.order_cycle,o.approve_status,o.effect_status,o.order_name,o.order_number,o.crm_user_id,cul.crm_user_name,o.contract_date,o.crm_contact_id,ctl.contact_name,o.goods_id,g.goods_name,g.goods_price,o.goods_cnt,o.discount,o.actual_amount,o.remark,o.reject_reason,o.approve_user,o.admin_id,a.name as admin_name,o.create_time,o.update_time`;

module.exports = {
    list: async (info) => {
        let sql = `SELECT ${searchParam},(SELECT COUNT(*) FROM ${backMoney_table} WHERE order_id = o.id)  as real_back_cnt,(SELECT SUM(collect_amount) FROM ${backMoney_table} WHERE order_id = o.id AND approve_status=3)  as real_back_amount  FROM ${orderTable} o `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} as a ON a.user_id=o.admin_id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.GOODS_LIST} as g ON g.goods_id = o.goods_id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.CRM_USER_LIST} as cul ON cul.id = o.crm_user_id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.CRM_CONTACT} as ctl ON ctl.contact_id = o.crm_contact_id `;
        let params = utils.getParamsForSql(info, ["id", "approve_status", "crm_user_id", "effect_status"], "o");
        sql += params.sql;
        let data = params.data;

        //related 值为1时查找待我审批的订单,值为2时查找所有我创建的
        if (Number(info.related) === 1) {
            sql += params.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            // sql += ` AND o.approve_status=1 AND FIND_IN_SET(${info.admin_id},o.approve_user)`;//此条sql会找出当前用户已审批的待审批数据,暂时弃用
            sql += `o.approve_status=1 AND o.order_cycle=1 AND o.id NOT IN( SELECT ot.id FROM order_approve op  LEFT JOIN orderlist ot ON ot.id = op.order_id WHERE op.approve_user = ${info.admin_id})  AND o.admin_id != ${info.admin_id} AND FIND_IN_SET(${info.admin_id},o.approve_user)`;
        }
        else if (Number(info.related) === 2) {
            sql += params.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += `o.admin_id=${info.admin_id}`;
        }

        if (info.order_cycle && Number(info.order_cycle) > 0) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += `o.order_cycle=${Number(info.order_cycle)}`;
        }

        sql += ` LIMIT ? OFFSET ? `;
        let { limit, offset } = utils.getLimitAndOffset(info.limit, info.page);
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },

    count: async (info) => {
        let sql = `SELECT COUNT(*) as count FROM ${orderTable} `;
        let params = utils.getParamsForSql(info, ["id", "approve_status", "crm_user_id", "effect_status"]);
        sql += params.sql;
        //related 值为1时查找待我审批的订单,值为2时查找所有我创建的
        if (Number(info.related) === 1) {
            sql += params.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            // sql += ` AND approve_status=1 AND FIND_IN_SET(${info.admin_id},approve_user)`;
            sql += ` approve_status=1 AND order_cycle=1 AND id NOT IN( SELECT ot.id FROM order_approve op  LEFT JOIN orderlist ot ON ot.id = op.order_id WHERE op.approve_user = ${info.admin_id}) AND admin_id != ${info.admin_id} AND FIND_IN_SET(${info.admin_id},approve_user)`;
        }
        else if (Number(info.related) === 2) {
            sql += params.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` admin_id=${info.admin_id}`;
        }

        if (info.order_cycle && Number(info.order_cycle) > 0) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += `order_cycle=${Number(info.order_cycle)}`;
        }
        let data = params.data;
        return sqlPool.queryData(sql, data);
    },

    //查询列表之后根据列表的返回数据进行统一查验
    // getApproveByOrderList: async (info) => {
    //     let sql = `SELECT o.id FROM ${orderTable} o WHERE FIND_IN_SET(${info.admin_id},o.approve_user) `; //AND id IN(${info.ids}) GROUP BY o.id
    //     return sqlPool.queryData(sql);
    // },

    //根据订单id查询订单详情
    getOrderById: async (info) => {
        let sql = `SELECT*FROM ${orderTable} WHERE id=?`;
        return sqlPool.queryData(sql, [info.id]);
    },

    //检查订单编号是否重复
    getOrderByOrderNumber: async (info) => {
        let sql = `SELECT*FROM ${orderTable} WHERE order_number=?`;
        return sqlPool.queryData(sql, [info.order_number]);
    },

    //根据登录人id和订单id判断当前用户是否已经审批过了
    getAdminByApprove: async (info) => {
        let sql = `SELECT o.id,o.approve_user,a.approve_user as a_id FROM ${orderTable} o `;
        sql += `LEFT JOIN ${ORDER_APPROVE} a ON o.id = a.order_id `;
        sql += `WHERE FIND_IN_SET(?,o.approve_user) AND o.id=?`;// AND a.approve_user = ?
        return sqlPool.queryData(sql, [info.admin_id, info.id]);//, info.admin_id
    },

    add: async (info) => {
        let creatTime = moment().format("x");
        let sql = `insert into ${orderTable} (order_cycle,approve_status,effect_status,order_name,order_type,order_number,crm_user_id,crm_contact_id,contract_date,goods_id,goods_cnt,discount,actual_amount,approve_user,remark,reject_reason,create_time,admin_id) values  `;
        sql += `(1,1,2,'${info.order_name}',${info.order_type},'${info.order_number}',${info.crm_user_id},${info.crm_contact_id},${info.contract_date},`;
        sql += `${info.goods_id},${info.goods_cnt},${info.discount},${info.actual_amount},'${info.approve_user}','${info.remark}','${info.reject_reason}',${creatTime},${info.admin_id})`;
        return sqlPool.queryData(sql);
    },

    update: async (info) => {
        let updateTime = moment().format("x");
        let data = {
            order_name: info.order_name,
            order_number: info.order_number,
            order_type: info.order_type,
            crm_user_id: info.crm_user_id,
            crm_contact_id: info.crm_contact_id,
            contract_date: info.contract_date,
            goods_id: info.goods_id,
            goods_cnt: info.goods_cnt,
            discount: info.discount,
            actual_amount: info.actual_amount,
            approve_user: info.approve_user,
            reject_reason: info.reject_reason,
            remark: info.remark,
            update_time: updateTime
        };
        if (info.approve_status) {
            data.approve_status = info.approve_status;
        }
        let param = utils.getParamByUpdate(data, ["order_name", "order_number", "approve_user", "reject_reason", "remark"]);
        let sql = `UPDATE ${orderTable} SET ${param} WHERE id=${info.id}`;
        return sqlPool.queryData(sql);
    },

    //2驳回 3通过
    approveOrder: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${orderTable} SET approve_status=? WHERE id=${info.id}`;
        let status = info.type == 1 ? 2 : 3;
        if (info.type == 1) {
            sql = `UPDATE ${orderTable} SET approve_status=?,reject_reason='${info.reject_reason}' WHERE id=${info.id}`;
        }
        return sqlPool.queryData(sql, [status]);
    },

    //获取订单审核记录 根据订单审批人连表审批表查询出对应数据
    getApproveOrderList: async (info) => {
        let sql = ` SELECT a.user_id,a.name as user_name,p.order_id,p.create_time FROM ${sqlConfig.configureName.ADMINUSER} as a  `;
        sql += ` LEFT JOIN (SELECT * FROM ${ORDER_APPROVE} v WHERE v.order_id = ${info.id}) as p  ON a.user_id = p.approve_user `;
        sql += `WHERE a.user_id IN(${info.users})`;
        return sqlPool.queryData(sql);
    },

    //订单流程状态改为取消
    cancelOrder: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${orderTable} SET order_cycle=2,update_time=${updateTime} WHERE id=${info.id}`;
        return sqlPool.queryData(sql);
    },

    //设置订单生效
    effectOrder: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${orderTable} SET effect_status=1,update_time=${updateTime} WHERE id=${info.id}`;
        return sqlPool.queryData(sql);
    }

};
