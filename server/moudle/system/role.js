var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {
    getRoleList: async (info) => {
        let sql = `SELECT * FROM ${sqlConfig.configureName.ROLE} WHERE role_id != 1 `;
        let limit = Number(info.limit);
        let offset = (Number(info.page) - 1) * limit;
        let data = [];
        if (info.id) {
            sql += ` AND role_id = ? `;
            data.push(Number(info.id));
        }
        sql += `  LIMIT ? OFFSET ?  `;
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },
    queryNameSake: (name) => {
        let querySql = `SELECT * FROM ${sqlConfig.configureName.ROLE} WHERE role_name= ?`;
        return sqlPool.queryData(querySql, [name]);
    },
    queryIdSake: (id) => {
        let querySql = `SELECT * FROM ${sqlConfig.configureName.ROLE} WHERE role_id= ?`;
        return sqlPool.queryData(querySql, [id]);
    },
    getRolesCount: async (info) => {
        let sql = `SELECT COUNT(*) as count FROM ${sqlConfig.configureName.ROLE}  WHERE role_id != 1 `;
        sql += info.id ? ` AND role_id = ${info.id} ` : "";
        return sqlPool.queryData(sql, []);
    },

    addRole: async (info) => {
        let creatTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let sql = `insert into ${sqlConfig.configureName.ROLE} (role_name,menulist,creat_time,update_time) values  `;
        sql += `('${info.name}', '${info.menulist}', '${creatTime}', '${updateTime}')`;
        return sqlPool.queryData(sql, []);
    },

    updateRole: async (info) => {
        let updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let sql = `UPDATE ${sqlConfig.configureName.ROLE} SET role_name='${info.name}',menulist='${info.menulist}',update_time='${updateTime}' WHERE role_id=${info.role_id}`;
        return sqlPool.queryData(sql, []);
    }
};
