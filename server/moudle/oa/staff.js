var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {
    list: async (info) => {
        let sql = `SELECT sf.*, `;
        sql += `ad.name as admin_name `,
            sql += `FROM ${sqlConfig.configureName.STAFF} sf `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} ad ON sf.admin_id = ad.user_id `;

        let data = [];
        if (info.name && info.name != "") {
            sql += ` WHERE sf.name LIKE '%${info.name}%' `;
        }
        if (info.entry_date_start && info.entry_date_end) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` sf.entry_date >= ${info.entry_date_start} AND sf.entry_date <= ${info.entry_date_end} `;
        }
        sql += ` ORDER BY status ASC LIMIT ? OFFSET ? `;

        let { limit, offset } = utils.getLimitAndOffset(info.limit, info.page);
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },

    count: async (info) => {
        let today = moment(moment().format("YYYY-MM-DD")).valueOf();
        let sql = `SELECT COUNT(*) as count,`;
        sql += `(SELECT COUNT(*) FROM ${sqlConfig.configureName.STAFF} a WHERE a.status =1) AS onJobCnt,`;
        sql += `(SELECT COUNT(*) FROM ${sqlConfig.configureName.STAFF} b WHERE b.status =2) as dismissionCnt,`;
        sql += `(SELECT COUNT(*) FROM ${sqlConfig.configureName.STAFF} c WHERE c.status =1 AND c.probation_end_date>=${today}) as probationCnt`;
        sql += ` FROM ${sqlConfig.configureName.STAFF} `;
        let data = [];
        if (info.name && info.name != "") {
            sql += ` WHERE name LIKE '%${info.name}%' `;
        }

        if (info.entry_date_start && info.entry_date_end) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` entry_date >= ${info.entry_date_start} AND entry_date <= ${info.entry_date_end} `;
        }
        return sqlPool.queryData(sql, data);
    },

    add: async (info) => {
        let creatTime = moment().format("x");
        let param = [];
        for (let item in info) {
            param.push(item);
        }
        let values = param.map(item => {
            return `'${info[item]}'`;
        });
        param.push("create_time");
        values.push(creatTime);
        let sql = `insert into ${sqlConfig.configureName.STAFF} (${param.join(",")}) values  (${values.join(",")})`;
        return sqlPool.queryData(sql);
    },

    update: async (info) => {
        let updateTime = moment().format("x");
        info.update_time = updateTime;
        let update = utils.getParamByUpdate(info, ["name", "depart_id", "phone", "mail", "contact_way", "paper_data",
            "politics_status", "native_place", "native_location", "education", "current_address", "emergency_contact",
            "emergency_contact_phone", "remark"]);
        let sql = `UPDATE ${sqlConfig.configureName.STAFF} SET ${update} WHERE id=${info.id}`;
        return sqlPool.queryData(sql);
    },

    dismiss: async (info) => {
        let updateTime = moment().format("x");
        let update = utils.getParamByUpdate({
            status: 2,
            dimission_date: info.dimiss_date,
            dimission_cause: info.reason,
            update_time:updateTime
        }, ["dimission_cause"]);
        let sql = `UPDATE ${sqlConfig.configureName.STAFF} SET ${update} WHERE id=${info.id}`;
        return sqlPool.queryData(sql);
    }

};
