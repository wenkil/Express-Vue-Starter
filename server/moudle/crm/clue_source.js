var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {

    list: async (info) => {
        let sql = `SELECT * FROM ${sqlConfig.configureName.CRM_CLUESOURCE} `;
        let limit = Number(info.limit);
        let offset = (Number(info.page) - 1) * limit;
        let data = [];
        sql += `  LIMIT ? OFFSET ?  `;
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },

    count: async () => {
        let sql = `SELECT COUNT(*) as count FROM ${sqlConfig.configureName.CRM_CLUESOURCE} `;
        return sqlPool.queryData(sql, []);
    },

    add: async (info) => {
        let creatTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let sql = `insert into ${sqlConfig.configureName.CRM_CLUESOURCE} (source_name,creat_time) values  `;
        sql += `('${info.source_name}', '${creatTime}')`;
        return sqlPool.queryData(sql, []);
    },

    update: async (info) => {
        let sql = `UPDATE ${sqlConfig.configureName.CRM_CLUESOURCE} SET source_name='${info.source_name}' where id=${info.id}`;
        return sqlPool.queryData(sql, []);
    }

};
