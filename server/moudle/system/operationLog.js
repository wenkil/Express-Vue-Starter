var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {

    getSystemUserLogsList: async (info) => {
        let sql = `SELECT log.id,admin.name,log.operat_type,log.ip,log.content,log.browser,log.os,log.device,log.creat_time FROM (${sqlConfig.configureName.OPERATION_LOG} as log  LEFT JOIN ${sqlConfig.configureName.ADMINUSER} as admin ON admin.token = log.token )  WHERE 1=1 `;
        let limit = Number(info.limit);
        let offset = (Number(info.page) - 1) * limit;
        let data = [];
        if (info.type) {
            sql += ` AND log.operat_type = ? `;
            data.push(Number(info.type));
        }
        if (info.start_time && info.end_time) {
            sql += ` AND log.creat_time >=  ?  and log.creat_time <= ? `;
            data.push(Number(info.start_time));
            data.push(Number(info.end_time));
        }
        sql += `  ORDER BY log.creat_time DESC LIMIT ? OFFSET ?  `;
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },

    getLogsCount: async (info) => {
        let sql = `SELECT COUNT(*) as count FROM (${sqlConfig.configureName.OPERATION_LOG} as log  LEFT JOIN ${sqlConfig.configureName.ADMINUSER} as admin ON admin.token = log.token ) WHERE 1=1 `;
        let data = [];
        if (info.type) {
            sql += ` AND log.operat_type = ? `;
            data.push(Number(info.type));
        }
        if (info.start_time && info.end_time) {
            sql += ` AND log.creat_time >=  ?  and log.creat_time <= ? `;
            data.push(Number(info.start_time));
            data.push(Number(info.end_time));
        }
        return sqlPool.queryData(sql, data);
    }
};
