var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {
    checkRepeat: async (info) => {
        let sql = `SELECT * FROM ${sqlConfig.configureName.DEPARTMENT} WHERE name = ?`;
        return sqlPool.queryData(sql, [info.name]);
    },
    //查询下级上面的所有上级(必须保证数据没有循环设置上下级)
    getAllParent: async (info) => {
        let sql = `SELECT id,parent_id FROM (SELECT @r AS _id,(SELECT @r := pid FROM ${sqlConfig.configureName.DEPARTMENT} WHERE id = _id) AS parent_id FROM (SELECT @r := ?, @l := 0) vars, ${sqlConfig.configureName.DEPARTMENT} h WHERE @r <> 0) T1 JOIN ${sqlConfig.configureName.DEPARTMENT} T2 ON T1._id = T2.id`;
        return sqlPool.queryData(sql, [info.id]);
    },
    //查询当前id是否关联了员工,绑定了不可删除和新增,需要把员工转出才可新增和删除
    checkDepByStaff: async (id) => {
        let sql = `SELECT d.id,d.name,s.id as staff_id,s.depart_id,s.name as staff_name FROM ${sqlConfig.configureName.DEPARTMENT} d `;
        sql += `LEFT JOIN ${sqlConfig.configureName.STAFF} s ON 1=1 WHERE d.id = ? AND FIND_IN_SET(d.id,s.depart_id)`;
        return sqlPool.queryData(sql, [id]);
    },

    list: async (info) => {
        let sql = `SELECT * FROM ${sqlConfig.configureName.DEPARTMENT}  ORDER BY id ASC`;
        return sqlPool.queryData(sql);
    },
    addFirst: async (info) => {
        let creatTime = moment().format("x");
        let sql = `insert into ${sqlConfig.configureName.DEPARTMENT} (name,creat_time) values  `;
        sql += `('${info.name}',
        '${creatTime}'
        )`;
        return sqlPool.queryData(sql, []);
    },
    addSecend: async (info) => {
        let creatTime = moment().format("x");
        let sql = `insert into ${sqlConfig.configureName.DEPARTMENT} (name,pid,creat_time) values  `;
        sql += `('${info.name}',
        '${info.pid}',
        '${creatTime}'
        )`;
        return sqlPool.queryData(sql, []);
    },
    update: async (info) => {
        let updateTime = moment().format("x");
        let sql = ` UPDATE ${sqlConfig.configureName.DEPARTMENT} SET `;
        sql += ` name='${info.name}',`;
        sql += ` update_time='${updateTime}'`;
        sql += ` where id=${info.id}`;
        return sqlPool.queryData(sql, []);
    },
    deleteCheck: async (info) => {
        let sql = `SELECT * FROM department WHERE pid = ?`;
        return sqlPool.queryData(sql, [info.id]);
    },
    delete: async (info) => {
        let sql = `DELETE FROM department WHERE id = ?`;
        return sqlPool.queryData(sql, [info.id]);
    }
};
