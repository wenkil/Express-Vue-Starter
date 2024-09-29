var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");
let GOODS_CLASS = sqlConfig.configureName.GOODS_CLASS;
let GOODS_BRANCH = sqlConfig.configureName.GOODS_BRANCH;
let GOODS_TYPE = sqlConfig.configureName.GOODS_TYPE;
let GOODS_TYPE_NAME = sqlConfig.configureName.GOODS_TYPE_NAME;

function goodsType(type) {
    switch (type) {
        case 1:
            return GOODS_CLASS;
        case 2:
            return GOODS_BRANCH;
        case 3:
            return GOODS_TYPE;
        case 4:
            return GOODS_TYPE_NAME;
    }
}

module.exports = {

    //只查找状态为1的列表
    list: async (info) => {
        let tableName = goodsType(Number(info.type));
        let param = `${tableName}.id,${tableName}.name,${tableName}.creat_time,${tableName}.update_time,${tableName}.admin_id,a.name as admin_name`;
        let sql = `SELECT ${param} FROM ${tableName}`;
        sql += ` LEFT JOIN ${sqlConfig.configureName.ADMINUSER} as a ON a.user_id=${tableName}.admin_id`;
        sql += ` WHERE ${tableName}.goods_status=1 `;
        let data = [];
        if (Number(info.type) > 1) {
            sql += ` AND pid=?`;
            data.push(info.pid);
        }
        return sqlPool.queryData(sql, data);
    },

    levelList: async () => {
        let sql = `SELECT c.id as class_id,c.name as class_name,b.id as branch_id,b.name as branch_name,t.id as type_id,t.name as type_name,tn.id as type_name_id,tn.name as type_name_name FROM ${GOODS_CLASS} c`;
        sql += ` LEFT JOIN ${GOODS_BRANCH} b ON b.pid = c.id AND b.goods_status = 1`;
        sql += ` LEFT JOIN ${GOODS_TYPE} t ON t.pid = b.id AND t.goods_status = 1`;
        sql += ` LEFT JOIN ${GOODS_TYPE_NAME} tn ON tn.pid = t.id  AND tn.goods_status = 1`;
        sql += ` WHERE c.goods_status = 1`;
        return sqlPool.queryData(sql);
    },

    //根据type判断：1是四级id，2是四级名称模搜索
    levelListById: async ({ type, id, name }) => {
        let sql = `SELECT c.id as class_id,c.name as class_name,b.id as branch_id,b.name as branch_name,t.id as type_id,t.name as type_name,tn.id as type_name_id,tn.name as type_name_name FROM goods_type_name tn `;
        sql += `LEFT JOIN goods_type t ON t.id = tn.pid `;
        sql += `LEFT JOIN goods_branch b ON b.id = t.pid `;
        sql += `LEFT JOIN  goods_class c ON c.id = b.pid `;
        let data = [];
        if (Number(type) === 1) {
            sql += `WHERE tn.id = ?`;
            data.push(id);
        }
        else {
            sql += `WHERE  tn.name LIKE ${`'%` + name + `%'`}`;
        }
        return sqlPool.queryData(sql, data);
    },

    add: async (info) => {
        let tableName = goodsType(Number(info.type));
        let creatTime = moment().format("x");
        let param = `name,goods_status,creat_time,admin_id`;
        let values = `'${info.name}', 1,${creatTime},${info.admin_id}`;
        if (Number(info.type) > 1) {
            param += ",pid";
            values += `,${info.pid}`;
        }
        let sql = `insert into ${tableName} (${param}) values (${values})`;
        return sqlPool.queryData(sql);
    },

    update: async (info) => {
        let tableName = goodsType(Number(info.type));
        let updateTime = moment().format("x");
        let param = `name='${info.name}',update_time=${updateTime},admin_id=${info.admin_id}`;
        let sql = `UPDATE ${tableName} SET ${param} where id=${info.id}`;
        return sqlPool.queryData(sql, []);
    },

    //修改状态为 2:禁用
    delete: async (info) => {
        let tableName = goodsType(Number(info.type));
        let updateTime = moment().format("x");
        let param = `goods_status=2,update_time=${updateTime},admin_id=${info.admin_id}`;
        let sql = `UPDATE ${tableName} SET ${param} where id=${info.id}`;
        return sqlPool.queryData(sql, []);
    },

    //检查同名
    checkSameGoodsName: async (info) => {
        let tableName = goodsType(Number(info.type));
        let sql = `SELECT * FROM ${tableName} WHERE ${tableName}.name = ?`;
        return sqlPool.queryData(sql, [info.name]);
    },

    //查找id
    checkGoodsByid: (info) => {
        let tableName = goodsType(Number(info.type));
        let sql = `SELECT * FROM ${tableName} WHERE id=?`;
        return sqlPool.queryData(sql, [info.id]);
    },

    //根据父级id查找
    checkGoodsByPid: (info) => {
        let tableName = goodsType(Number(info.type));
        let sql = `SELECT * FROM ${tableName} WHERE pid=? AND goods_status=1`;
        return sqlPool.queryData(sql, [info.pid]);
    },

    //检查当前删除的第四级是否关联了产品,关联了产品的不可删除
    checkGoodsTypeRelevance: (info) => {
        console.log('info--->',info);
        let sql = `SELECT COUNT(gt.goods_id) as ids FROM goods_type_name ge LEFT JOIN goods_list gt ON ge.id = gt.goods_type_id WHERE ge.id=${info.id}`
        return sqlPool.queryData(sql);
    }

};
