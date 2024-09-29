var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {
    list: async (info) => {
        let sql = `SELECT cm.crm_user_name,`;
        sql += `ct.*,`,
            sql += `ad.name as admin_name,`,
            sql += `ad2.name as creat_admin_name,`,
            sql += `au.name as charge_user_name `,
            sql += `FROM ${sqlConfig.configureName.CRM_CONTACT} ct `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} ad ON ct.admin_id = ad.user_id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} ad2 ON ct.creat_admin_id = ad2.user_id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.CRM_USER_LIST} cm ON ct.crm_user_id = cm.id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} au ON ct.charge_user_id = au.user_id `;
        let param = utils.getParamsForSql(info, ["contact_name", "contact_phone"], "ct");
        sql += param.sql;
        if (info.crm_user_id) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += `ct.crm_user_id = ${info.crm_user_id}`;
        }
        if (info.next_contact_time_start && info.next_contact_time_end) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` ct.next_contact_time >= ${info.next_contact_time_start} AND ct.next_contact_time <= ${info.next_contact_time_end} `;
        }
        if (info.hierarchy) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` (ct.charge_user_id IN(${info.hierarchy}) OR ct.creat_admin_id IN (${info.hierarchy}))`;
        }
        sql += ` ORDER BY ct.next_contact_time ASC LIMIT ? OFFSET ? `;
        let data = param.data;
        let { limit, offset } = utils.getLimitAndOffset(info.limit, info.page);
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },

    count: async (info) => {
        let sql = `SELECT COUNT(*) as count FROM ${sqlConfig.configureName.CRM_CONTACT} `;
        let param = utils.getParamsForSql(info, ["contact_name", "contact_phone"]);
        sql += param.sql;
        let data = param.data;
        if (info.crm_user_id) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += `crm_user_id = ${info.crm_user_id}`;
        }
        if (info.next_contact_time_start && info.next_contact_time_end) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` next_contact_time >= ${info.next_contact_time_start} AND next_contact_time <= ${info.next_contact_time_end} `;
        }
        if (info.hierarchy) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` (charge_user_id IN(${info.hierarchy}) OR creat_admin_id IN (${info.hierarchy}))`;
        }
        return sqlPool.queryData(sql, data);
    },

    add: async (info) => {
        let creatTime = moment().format("x");
        let sql = `insert into ${sqlConfig.configureName.CRM_CONTACT} (crm_user_id,contact_name,contact_gender,contact_phone,contact_mail,decision_type,charge_user_id,contact_address,next_contact_time,remark,creat_time,admin_id,creat_admin_id) values  `;
        sql += `(${info.crm_user_id},`;
        sql += `'${info.contact_name}',`;
        sql += `${info.contact_gender},`;
        sql += `'${info.contact_phone}',`;
        sql += `'${info.contact_mail}',`;
        sql += `${info.decision_type},`;
        sql += `${info.charge_user_id},`;
        sql += `'${info.contact_address}',`;
        sql += `${info.next_contact_time},`;
        sql += `'${info.remark}',`;
        sql += `${creatTime},`;
        sql += `${info.admin_id},`;
        sql += `${info.creat_admin_id}`;
        sql += `)`;
        return sqlPool.queryData(sql, []);
    },

    update: async (info) => {
        let updateTime = moment().format("x");
        let sql = ` UPDATE ${sqlConfig.configureName.CRM_CONTACT} SET `;
        sql += ` contact_name='${info.contact_name}',`;
        sql += ` contact_gender=${info.contact_gender},`;
        sql += ` contact_phone=${info.contact_phone},`;
        sql += ` contact_mail='${info.contact_mail}',`;
        sql += ` decision_type=${info.decision_type},`;
        sql += ` contact_address='${info.contact_address}',`;
        sql += ` next_contact_time=${info.next_contact_time},`;
        sql += ` remark='${info.remark}',`;
        sql += ` update_time=${updateTime},`;
        sql += ` admin_id=${info.admin_id}`;
        sql += ` where contact_id=${info.contact_id}`;
        return sqlPool.queryData(sql, []);
    },

    updateNextTime: async (info) => {
        let updateTime = moment().format("x");
        let sql = ` UPDATE ${sqlConfig.configureName.CRM_CONTACT} SET `;
        sql += ` next_contact_time=${info.next_contact_time}`;
        sql += ` where contact_id=${info.contact_id}`;
        return sqlPool.queryData(sql, []);
    }
};
