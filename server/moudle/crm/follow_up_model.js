var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {
    list: async (info) => {
        let sql = `SELECT fp.*,`;
        sql += `ad.name as creat_admin_name,`,
            sql += `cu.crm_user_name,`,
            sql += `ct.contact_name `,
            sql += `FROM ${sqlConfig.configureName.CRM_FOLLOW_UP} fp `,
            sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} ad ON fp.creat_admin_id = ad.user_id `,
            sql += `LEFT JOIN ${sqlConfig.configureName.CRM_USER_LIST} cu ON fp.crm_user_id = cu.id `,
            sql += `LEFT JOIN ${sqlConfig.configureName.CRM_CONTACT} ct ON fp.crm_contact_id = ct.contact_id `;
        let param = utils.getParamsForSql(info, []);
        sql += param.sql;
        if (info.crm_user_id) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += `fp.crm_user_id = ${info.crm_user_id}`;
        }
        if (info.next_contact_time_start && info.next_contact_time_end) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` fp.next_contact_time >= ${info.next_contact_time_start} AND fp.next_contact_time <= ${info.next_contact_time_end} `;
        }
        if (info.hierarchy && info.type == 1) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` fp.creat_admin_id IN(${info.hierarchy})`;
        }
        sql += ` ORDER BY fp.next_contact_time ASC LIMIT ? OFFSET ? `;
        let data = param.data;
        let { limit, offset } = utils.getLimitAndOffset(info.limit, info.page);
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },

    count: async (info) => {
        let sql = `SELECT COUNT(*) as count FROM ${sqlConfig.configureName.CRM_FOLLOW_UP} `;
        let param = utils.getParamsForSql(info, []);
        sql += param.sql;
        if (info.next_contact_time_start && info.next_contact_time_end) {
            sql += param.sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` next_contact_time >= ${info.next_contact_time_start} AND next_contact_time <= ${info.next_contact_time_end} `;
        }
        if (info.hierarchy) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` creat_admin_id IN(${info.hierarchy})`;
        }
        let data = param.data;
        return sqlPool.queryData(sql, data);
    },

    add: async (info) => {
        let creatTime = moment().format("x");
        let sql = `insert into ${sqlConfig.configureName.CRM_FOLLOW_UP} (follow_time,follow_type,crm_user_id,crm_contact_id,follow_record,remark,next_contact_time,creat_time,creat_admin_id) values  `;
        sql += `(${info.follow_time},`;
        sql += `${info.follow_type},`;
        sql += `${info.crm_user_id},`;
        sql += `${info.crm_contact_id},`;
        sql += `'${info.follow_record}',`;
        sql += `'${info.remark}',`;
        sql += `${info.next_contact_time},`;
        sql += `${creatTime},`;
        sql += `${info.creat_admin_id}`;
        sql += `)`;
        return sqlPool.queryData(sql, []);
    }
};
