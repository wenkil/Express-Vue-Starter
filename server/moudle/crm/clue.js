var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {
    /**
     * 查找线索时根据负责人id查找用户表里对应的名字,同时需要判断其他搜索条件
     * @param info
     * @returns {Promise<unknown>}
     */
    list: async (info) => {
        let sql = ` SELECT cl.*,au.name as charge_user_name,ad.name as admin_name,ad2.name as creat_admin_name FROM ${sqlConfig.configureName.CRM_CLUE} as cl `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} au ON cl.charge_user_id = au.user_id  `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} ad ON ad.user_id = cl.admin_id `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} ad2 ON ad2.user_id = cl.creat_admin_id `;
        // `SELECT * FROM ${sqlConfig.configureName.CRM_CLUE} `
        let param = utils.getParamsForSql(info, ["clue_name", "clue_phone", "source_id", "cus_level", "cl"]);
        sql += param.sql;
        let data = param.data;
        let limit = Number(info.limit);
        let offset = (Number(info.page) - 1) * limit;
        if (info.next_contact_time_start && info.next_contact_time_end) {
            sql += param.sql ? " AND " : " WHERE ";
            sql += ` cl.next_contact_time >= ${info.next_contact_time_start} AND cl.next_contact_time <= ${info.next_contact_time_end} `;
        }
        sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
        sql += ` cl.clue_type = 1 `;
        if (info.isCharge) {
            sql += (sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ");
            sql += Number(info.isCharge) == 1 ? ` cl.charge_user_id IS NULL ` : ` cl.charge_user_id IS NOT NULL `;  //1未分配 2已分配
        }
        if (info.hierarchy) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += info.isCharge ? `cl.creat_admin_id IN (${info.hierarchy})` : ` (cl.charge_user_id IN(${info.hierarchy}) OR cl.creat_admin_id IN (${info.hierarchy}))`;
        }
        sql += ` ORDER BY cl.next_contact_time ASC LIMIT ? OFFSET ? `;
        data.push(limit, offset);
        return sqlPool.queryData(sql, data);
    },
    count: async (info) => {
        // let sql = `SELECT COUNT(*) as count FROM ${sqlConfig.configureName.CRM_CLUE} `
        let sql = ` SELECT COUNT(*) as count FROM ${sqlConfig.configureName.CRM_CLUE} as clue LEFT JOIN (SELECT clue.clue_id,user.name as charge_user_name FROM (${sqlConfig.configureName.CRM_CLUE} as clue LEFT JOIN ${sqlConfig.configureName.ADMINUSER} as user ON clue.charge_user_id = user.user_id)) as temp ON temp.clue_id = clue.clue_id `;
        let param = utils.getParamsForSql(info, ["clue_name", "clue_phone", "source_id", "cus_level"]);
        sql += param.sql;
        let data = param.data;
        sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
        sql += ` clue_type = 1 `;
        if (info.next_contact_time) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += ` clue.next_contact_time >= ${info.next_contact_time_start} AND clue.next_contact_time <= ${info.next_contact_time_end} `;
        }
        if (info.isCharge) {
            sql += (sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ");
            sql += Number(info.isCharge) == 1 ? ` clue.charge_user_id IS NULL ` : ` clue.charge_user_id IS NOT NULL `;  //1未分配 2已分配
        }
        if (info.hierarchy) {
            sql += sql.indexOf("WHERE") != -1 ? " AND " : " WHERE ";
            sql += info.isCharge ? `clue.creat_admin_id IN (${info.hierarchy})` : ` (clue.charge_user_id IN(${info.hierarchy}) OR clue.creat_admin_id IN (${info.hierarchy}))`;
        }
        return sqlPool.queryData(sql, data);
    },
    add: async (info) => {
        let creatTime = moment().format("x");
        let sql = `insert into ${sqlConfig.configureName.CRM_CLUE} (clue_name,source_id,clue_mail,clue_phone,clue_address,cus_trade,cus_level,charge_user_id,next_contact_time,clue_type,remark,creat_time,admin_id,creat_admin_id) values  `;
        sql += `('${info.clue_name}',
         ${info.source_id},
        '${info.clue_mail}',
        '${info.clue_phone}',
        '${info.clue_address}',
        '${info.cus_trade}',
         ${info.cus_level},
         ${info.charge_user_id},
         ${info.next_contact_time},
         ${1},
        '${info.remark}',
        '${creatTime}',
         ${info.admin_id},
         ${info.creat_admin_id}
        )`;
        return sqlPool.queryData(sql, []);
    },
    update: async (info) => {
        let updateTime = moment().format("x");
        let sql = ` UPDATE ${sqlConfig.configureName.CRM_CLUE} SET `;
        sql += ` clue_name='${info.clue_name}',`;
        sql += ` source_id=${info.source_id},`;
        sql += ` clue_mail='${info.clue_mail}',`;
        sql += ` clue_phone=${info.clue_phone},`;
        sql += ` clue_address='${info.clue_address}',`;
        sql += ` cus_trade=${info.cus_trade},`;
        sql += ` cus_level=${info.cus_level},`;
        sql += ` next_contact_time=${info.next_contact_time},`;
        sql += ` remark='${info.remark}',`;
        sql += ` update_time='${updateTime}',`;
        sql += ` admin_id=${info.admin_id}`;
        sql += ` where clue_id=${info.id}`;
        return sqlPool.queryData(sql, []);
    },

    allotClueInfo: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${sqlConfig.configureName.CRM_CLUE} SET charge_user_id = ${info.user_id},update_time=${updateTime},admin_id=${info.admin_id}  WHERE clue_id IN (${info.clue_list})`;
        return sqlPool.queryData(sql, []);
    },

    allotClueInfoSingle: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${sqlConfig.configureName.CRM_CLUE} SET charge_user_id = ${info.user_id},update_time=${updateTime},admin_id=${info.admin_id}  WHERE clue_id = ${info.id}`;
        return sqlPool.queryData(sql, []);
    },

    //批量修改线索状态为已转为客户,最后更新时间就是转化时间,后续使用更新时间做转化率报表
    updateClueType: async (info) => {
        let updateTime = moment().format("x");
        let sql = `UPDATE ${sqlConfig.configureName.CRM_CLUE} SET clue_type = 2,update_time=${updateTime},admin_id=${info.admin_id}  WHERE clue_id IN (${info.clue_list})`;
        return sqlPool.queryData(sql, []);
    },

    //找出所有要转客户的数据
    selectListByDivert: async (info) => {
        let sql = `SELECT * FROM ${sqlConfig.configureName.CRM_CLUE} WHERE clue_id IN (${info.clue_list})`;
        return sqlPool.queryData(sql, []);
    }

};
