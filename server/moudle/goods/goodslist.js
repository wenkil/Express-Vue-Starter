var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");
const goodlist = sqlConfig.configureName.GOODS_LIST

module.exports = {
    //检查同名
    checkSameGoodsName: async (info) => {
        let sql = `SELECT * FROM ${goodlist} WHERE goods_name = ?`;
        return sqlPool.queryData(sql, [info.goods_name]);
    },

    list: async (info) => {
        let sql = `SELECT gl.*,a.name as admin_name FROM ${goodlist} gl`;
        sql += ` LEFT JOIN ${sqlConfig.configureName.ADMINUSER} a ON a.user_id = gl.admin_id`;
        let param = utils.getParamsForSql(info, ["goods_name", "goods_type_id",'goods_status'], "gl");
        sql += param.sql;
        let data = param.data;
        sql += ` LIMIT ? OFFSET ? `;
        let { limit, offset } = utils.getLimitAndOffset(info.limit, info.page);
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },
    count: async (info) => {
        let sql = `SELECT COUNT(*) as count FROM ${goodlist} `;
        let param = utils.getParamsForSql(info, ["goods_name", "goods_type_id",'goods_status']);
        sql += param.sql;
        return sqlPool.queryData(sql, param.data);
    },

    add: async (info) => {
        let creatTime = moment().format("x");
        let param = `goods_name,goods_type_id,goods_price,goods_status,goods_intro,remark,creat_time,admin_id`;
        let values = `'${info.goods_name}',${info.goods_type_id},${info.goods_price},1,'${info.goods_intro}','${info.remark}',${creatTime},${info.admin_id}`;
        if (Number(info.type) > 1) {
            param += ",pid";
            values += `,${info.pid}`;
        }
        let sql = `insert into ${goodlist} (${param}) values (${values})`;
        return sqlPool.queryData(sql);
    },

    //更新时type为1更新相关字段,type为2更新状态,状态字段必填
    update: async (info) => {
        let updateTime = moment().format("x");
        if(info.type == 1){
            let param = utils.getParamByUpdate({
                goods_intro: info.goods_intro,
                remark: info.remark,
                admin_id: info.admin_id,
                update_time: updateTime
            }, ["goods_intro", "remark"]);
            let sql = `UPDATE ${goodlist} SET ${param} WHERE goods_id=${info.goods_id}`;
            return sqlPool.queryData(sql);
        }
        else{
            let sql = `UPDATE ${goodlist} SET goods_status=${info.goods_status} WHERE goods_id=${info.goods_id}`;
            return sqlPool.queryData(sql);
        }
    }
};
