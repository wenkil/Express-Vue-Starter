var sqlPool = require("../../DB/sqlPool");
const hashUtil = require("../../utils/setHash");
const utils = require("../../utils/utils");
const md5 = require("md5");
var moment = require("moment");
var sqlConfig = require("../../DB/sqlConfig");

module.exports = {

    changePassword: async ({ password, user_id }) => {
        let updateTokenSql = `update ${sqlConfig.configureName.ADMINUSER} set password = ? where user_id = ?`;
        return sqlPool.queryData(updateTokenSql, [password, user_id]);
    },
    getUserInfo: (token) => {
        let sql = `SELECT role.role_id,user.name,role.menulist,user.user_id as admin_id FROM (admin_user as user INNER  JOIN admin_role as role ON user.role_id = role.role_id )  `;
        sql += ` WHERE user.token = '${token}'`;
        return sqlPool.queryData(sql, []);
    },

    /**
     * 根据用户状态进行排序返回
     * @param info
     * @returns {Promise | Promise<unknown>}
     */
    getUserList: (info) => {
        let sql = `SELECT user.user_id,user.user_status,user.name,ad.user_id as superior_id,ad.name as superior_name,user.creat_time,user.update_time,user.role_id,role.role_name FROM (${sqlConfig.configureName.ADMINUSER} as user)  LEFT JOIN (${sqlConfig.configureName.ROLE} as role) ON user.role_id = role.role_id LEFT JOIN ${sqlConfig.configureName.ADMINUSER} AS ad ON user.superior = ad.user_id WHERE user.role_id != 1 `;
        if (info.name && info.name != "") {
            sql += ` AND user.name LIKE '%${info.name}%' `;
        }
        if (info.type && info.type != "") {
            sql += ` AND user.user_status =${info.type} `;
        }
        sql += ` ORDER BY user.user_status ASC LIMIT ? OFFSET ?`;
        let limit = Number(info.limit);
        let offset = (Number(info.page) - 1) * limit;
        let data = [limit, offset];
        return sqlPool.queryData(sql, data);
    },

    getListCount: (info) => {
        let allSql = `SELECT COUNT(*) as count FROM ${sqlConfig.configureName.ADMINUSER}  WHERE role_id != 1`;
        if (info.name && info.name != "") {
            allSql += ` AND name LIKE '%${info.name}%' `;
        }
        if (info.type && info.type != "") {
            allSql += ` AND user_status =${info.type} `;
        }
        return sqlPool.queryData(allSql, []);
    },

    //depart_id IS NOT NULL AND  之前逻辑是直属上级必须绑定部门,现改为直属上级必须为启用用户,不需要绑定部门
    getUserListByDepart: (info) => {
        let sql = `SELECT user_id,name FROM ${sqlConfig.configureName.ADMINUSER} WHERE user_status = 1 AND role_id != 1 `;
        return sqlPool.queryData(sql);
    },

    queryNameSake: (name) => {
        let querySql = `SELECT * FROM ${sqlConfig.configureName.ADMINUSER} WHERE name= ?`;
        return sqlPool.queryData(querySql, [name]);
    },

    queryIdSake: (id) => {
        let querySql = `SELECT * FROM ${sqlConfig.configureName.ADMINUSER} WHERE user_id= ?`;
        return sqlPool.queryData(querySql, [id]);
    },

    addSystemUser: (info) => {
        let saltObj = hashUtil.saltHashPassword(info.password);
        let token = md5(info.name + utils.MD5_KEYS);
        let creatTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let param = `name,user_status,salt,password,token,role_id,superior,creat_time`;
        let sql = `insert into ${sqlConfig.configureName.ADMINUSER} (${param}) values  `;
        sql += `('${info.name}',1, '${saltObj.salt}', '${saltObj.passwordHash}', '${token}', '${info.role}',${info.superior ? info.superior : null}, '${creatTime}')`;
        return sqlPool.queryData(sql, []);
    },

    updateSystemUser: (info, keys = []) => {
        let temp = JSON.parse(JSON.stringify(info));
        delete info.user_id;
        let updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        info.update_time = updateTime;
        keys.push("update_time");
        let update = utils.getParamByUpdate(info, keys);
        let sql = `UPDATE ${sqlConfig.configureName.ADMINUSER} SET ${update} WHERE user_id=${temp.user_id}`;
        return sqlPool.queryData(sql, []);
    },

    /**
     * 不做删除,只做状态修改
     * @param id
     * @param type
     * @returns {Promise | Promise<unknown>}
     */
    deleteSystemUser: function (id, type) {
        let sql = `UPDATE ${sqlConfig.configureName.ADMINUSER} SET user_status=${type}  WHERE user_id = ${id} LIMIT 1`;
        return sqlPool.queryData(sql, []);
    },

    /**
     * 获取某个用户的所有下级,使用find_in_set进行查找
     */
    getAllSubordinateByUser: function (user_id) {
        let sql = `select * from (select t1.*,if(find_in_set(superior, @pids) > 0, @pids := concat(@pids, ',', user_id), 0) as ischild from ( select * from ${sqlConfig.configureName.ADMINUSER} t order by superior, user_id) t1,(select @pids := ?) t2) t3 where ischild != 0`;
        return sqlPool.queryData(sql, [user_id]);
    },

    getUserByApproveOrder:async (info)=>{
        let sql = `SELECT id,approve_user FROM ${sqlConfig.configureName.ORDERLIST}  WHERE order_cycle =  1 AND approve_status = 1 AND FIND_IN_SET(${info.user_id},approve_user)`
        return sqlPool.queryData(sql);
    }

};
