var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
const sqlConfig = require("../../DB/sqlConfig");
const backMoney_table = sqlConfig.configureName.BACKMONEYLIST;
const BACKMONEY_APPROVE = sqlConfig.configureName.BACKMONEY_APPROVE;
const list_sql = `b.id,b.approve_status,b.collect_cycle,b.crm_user_id,b.order_id,b.collect_date,b.collect_type,b.collect_amount,b.approve_user,b.remark,b.reject_reason,b.admin_id,b.create_time,b.update_time`;

module.exports = {

    list: async (info) => {
        let sql = `SELECT ${list_sql},a.name as admin_name,c.crm_user_name,o.order_name FROM back_money_list b `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ORDERLIST} o ON b.order_id = o.id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.CRM_USER_LIST} c ON b.crm_user_id = c.id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} a ON b.admin_id = a.user_id `;
        let params = utils.getParamsForSql(info, ["id", "order_id", "crm_user_id"], "b");
        sql += params.sql;
        let data = params.data;

        if (info.related == 1) {
            sql += params.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` b.id NOT IN( SELECT bp.back_money_id FROM ${BACKMONEY_APPROVE} bp  LEFT JOIN ${backMoney_table} bt ON bt.id = bp.back_money_id WHERE bp.approve_user =${info.admin_id})  AND b.admin_id != ${info.admin_id} AND FIND_IN_SET(${info.admin_id},b.approve_user) AND b.approve_status = 1 `;
        }
        else if (info.related == 2) {
            sql += params.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` b.admin_id = ? `;
            data.push(info.admin_id);
        }
        if (info.collect_cycle) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += `b.collect_cycle=${info.collect_cycle} `;
        }
        sql += ` LIMIT ? OFFSET ? `;
        let { limit, offset } = utils.getLimitAndOffset(info.limit, info.page);
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },
    count: async (info) => {
        let sql = `SELECT COUNT(*) as count FROM ${backMoney_table} `;
        let params = utils.getParamsForSql(info, ["id", "order_id", "crm_user_id"]);
        sql += params.sql;
        let data = params.data;

        if (info.related == 1) {
            sql += params.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` id NOT IN( SELECT bp.back_money_id FROM ${BACKMONEY_APPROVE} bp  LEFT JOIN ${backMoney_table} bt ON bt.id = bp.back_money_id WHERE bp.approve_user =${info.admin_id})  AND admin_id != ${info.admin_id} AND FIND_IN_SET(${info.admin_id},approve_user)  AND approve_status = 1`;
        }
        else if (info.related == 2) {
            sql += params.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` admin_id = ? `;
            data.push(info.admin_id);
        }
        sql += ((sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ") + ` collect_cycle=1`);
        return sqlPool.queryData(sql, data);
    },

    //根据id查询回款详情
    getById: async (info) => {
        let sql = `SELECT*FROM ${backMoney_table} WHERE id=?`;
        return sqlPool.queryData(sql, [info.id]);
    },

    add: async (info) => {
        let creatTime = moment().format("x");
        let sql = `insert into ${backMoney_table} (collect_cycle,approve_status,crm_user_id,order_id,collect_date,collect_amount,collect_type,approve_user,remark,create_time,admin_id) values  `;
        sql += `(1,1,${info.crm_user_id},${info.order_id},${info.collect_date},${info.collect_amount},${info.collect_type},'${info.approve_user}','${info.remark}',${creatTime},${info.admin_id})`;
        return sqlPool.queryData(sql);
    },

    update: async (info) => {
        let updateTime = moment().format("x");
        let data = {
            // crm_user_id: info.crm_user_id,
            // order_id: info.order_id,
            collect_date: info.collect_date,
            collect_amount: info.collect_amount,
            collect_type: info.collect_type,
            approve_user: info.approve_user,
            remark: info.remark,
            update_time: updateTime
        };
        if (info.approve_status) {
            data.approve_status = info.approve_status;
        }
        let param = utils.getParamByUpdate(data, ["approve_user", "remark"]);
        let sql = `UPDATE ${backMoney_table} SET ${param} WHERE id=${info.id}`;
        return sqlPool.queryData(sql);
    },

    //查验审批人是否可以审批
    getAdminByApprove: async (info) => {
        let sql = `SELECT b.id,b.approve_user,a.approve_user as a_id FROM ${backMoney_table} b `;
        sql += `LEFT JOIN ${BACKMONEY_APPROVE} a ON b.id = a.back_money_id `;
        sql += `WHERE FIND_IN_SET(?,b.approve_user) AND b.id=?`;// AND a.approve_user = ?
        return sqlPool.queryData(sql, [info.admin_id, info.id]);//, info.admin_id
    },

    //获取订单审核记录 根据订单审批人连表审批表查询出对应数据
    getApproveOrderList: async (info) => {
        let sql = ` SELECT a.user_id,a.name as user_name,p.back_money_id,p.create_time FROM ${sqlConfig.configureName.ADMINUSER} as a  `;
        sql += ` LEFT JOIN (SELECT * FROM ${BACKMONEY_APPROVE} v WHERE v.back_money_id = ${info.id}) as p  ON a.user_id = p.approve_user `;
        sql += `WHERE a.user_id IN(${info.users})`;
        return sqlPool.queryData(sql);
    },

    //2驳回 3通过
    approveOrder: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${backMoney_table} SET approve_status=? WHERE id=${info.id}`;
        let status = info.type == 1 ? 2 : 3;
        if (info.type == 1) {
            sql = `UPDATE ${backMoney_table} SET approve_status=?,reject_reason='${info.reject_reason}' WHERE id=${info.id}`;
        }
        return sqlPool.queryData(sql, [status]);
    },

    //回款状态改为取消
    del: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${backMoney_table} SET collect_cycle=2,update_time=${updateTime} WHERE id=${info.id}`;
        return sqlPool.queryData(sql);
    }

};
