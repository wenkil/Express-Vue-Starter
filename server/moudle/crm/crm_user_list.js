var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");
const ADMINUSER = sqlConfig.configureName.ADMINUSER;
const CRM_USER_LIST = sqlConfig.configureName.CRM_USER_LIST;

module.exports = {
    list: async (info) => {
        let sql = `SELECT cu.*,au.name as charge_user_name,ad.name as admin_name,ad2.name as creat_admin_name,`;
        sql += `(SELECT COUNT(*) FROM ${sqlConfig.configureName.CRM_CONTACT} WHERE contact_list.crm_user_id = cu.id) as contact_cnt,`;//联系人数量
        sql += `(SELECT COUNT(*) FROM ${sqlConfig.configureName.CRM_FOLLOW_UP} WHERE follow_up_list.crm_user_id = cu.id) as record_cnt,`;//跟进记录数量
        sql += `(SELECT COUNT(*) FROM ${sqlConfig.configureName.ORDERLIST} WHERE crm_user_id = cu.id) as order_cnt `;//获取客户订单数量
        sql += `FROM ${CRM_USER_LIST} as cu`;
        sql += ` LEFT JOIN ${ADMINUSER} au ON cu.charge_user_id = au.user_id`;
        sql += ` LEFT JOIN ${ADMINUSER} ad ON ad.user_id = cu.admin_id`;
        sql += ` LEFT JOIN ${ADMINUSER} ad2 ON ad2.user_id = cu.creat_admin_id`;
        let param = utils.getParamsForSql(info, ["crm_user_name", "crm_user_phone", "source_id", "crm_user_level"], "cu");
        sql += param.sql;
        let data = param.data;
        let { limit, offset } = utils.getLimitAndOffset(info.limit, info.page);
        if (info.id) {
            sql += param.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` cu.id =? `;
            data.push(Number(info.id));
        }
        if (info.hierarchy) {
            sql += param.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` (cu.charge_user_id IN(${info.hierarchy}) OR cu.creat_admin_id IN (${info.hierarchy}))`;
        }
        sql += ` LIMIT ? OFFSET ? `;
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },
    count: async (info) => {
        let sql = `SELECT COUNT(*) as count FROM ${CRM_USER_LIST}  as crm_user LEFT JOIN (SELECT crm.id,user.name as charge_user_name FROM (${CRM_USER_LIST} as crm LEFT JOIN ${ADMINUSER} as user ON crm.charge_user_id = user.user_id)) as temp ON temp.id = crm_user.id `;
        let param = utils.getParamsForSql(info, ["crm_user_name", "crm_user_phone", "source_id", "crm_user_level"]);
        sql += param.sql;
        let data = param.data;
        if (info.hierarchy) {
            sql += param.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` (charge_user_id IN(${info.hierarchy}) OR creat_admin_id IN (${info.hierarchy}))`;
        }
        return sqlPool.queryData(sql, data);
    },

    //批量新增：线索转入客户
    addDivertCLue: async (list) => {
        let sql = `insert into ${CRM_USER_LIST} (crm_user_name,source_id,crm_user_mail,crm_user_phone,crm_user_address,crm_user_trade,crm_user_level,charge_user_id,remark,creat_time,admin_id) values ?  `;
        return sqlPool.queryData(sql, [list]);
    },

    add: async (info) => {
        let creatTime = moment().format("x");
        let sql = `insert into ${CRM_USER_LIST} (crm_user_name,source_id,crm_user_mail,crm_user_phone,crm_user_address,crm_user_trade,crm_user_level,remark,creat_time,admin_id,creat_admin_id) values  `;
        sql += `('${info.crm_user_name}',`;
        sql += `${info.source_id},`;
        sql += `'${info.crm_user_mail}',`;
        sql += `${info.crm_user_phone},`;
        sql += `'${info.crm_user_address}',`;
        sql += `'${info.crm_user_trade}',`;
        sql += `${info.crm_user_level},`;
        sql += `'${info.remark}',`;
        sql += `'${creatTime}',`;
        sql += `${info.admin_id},`;
        sql += `${info.creat_admin_id}`;
        sql += `)`;
        return sqlPool.queryData(sql, []);
    },
    update: async (info) => {
        let updateTime = moment().format("x");
        let sql = ` UPDATE ${CRM_USER_LIST} SET `;
        sql += ` crm_user_name='${info.crm_user_name}',`;
        sql += ` source_id=${info.source_id},`;
        sql += ` crm_user_mail='${info.crm_user_mail}',`;
        sql += ` crm_user_phone=${info.crm_user_phone},`;
        sql += ` crm_user_address='${info.crm_user_address}',`;
        sql += ` crm_user_trade=${info.crm_user_trade},`;
        sql += ` crm_user_level=${info.crm_user_level},`;
        sql += ` remark='${info.remark}',`;
        sql += ` update_time='${updateTime}',`;
        sql += ` admin_id=${info.admin_id}`;
        sql += ` where id=${info.id}`;
        return sqlPool.queryData(sql, []);
    },

    allotCrmUserInfo: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${CRM_USER_LIST} SET charge_user_id = ${info.user_id},update_time=${updateTime},admin_id=${info.admin_id}  WHERE id = ${info.id}`;
        return sqlPool.queryData(sql, []);
    },

    //来源分析
    sourceAnalyse: async (info) => {
        let sql = `SELECT cs.source_name,(SELECT COUNT(*) FROM ${CRM_USER_LIST} cu WHERE cs.id = cu.source_id AND cu.creat_time >= ${info.start_time} AND cu.creat_time <= ${info.end_time}) as user_cnt FROM ${sqlConfig.configureName.CRM_CLUESOURCE} cs`;
        return sqlPool.queryData(sql, []);
    },

    //等级分析
    levelAnalyse: async (info) => {
        let sql = `SELECT crm_user_level as id, COUNT(*) as count FROM ${CRM_USER_LIST} WHERE creat_time >= ${info.start_time}  AND creat_time <= ${info.end_time} GROUP BY crm_user_level `;
        return sqlPool.queryData(sql, []);
    },

    //行业分析
    tradeAnalyse: async (info) => {
        let sql = `SELECT crm_user_trade as id, COUNT(*) as count FROM ${CRM_USER_LIST} WHERE creat_time >= ${info.start_time}  AND creat_time <= ${info.end_time} GROUP BY crm_user_trade `;
        return sqlPool.queryData(sql, []);
    }

};
