var sqlPool = require('../DB/sqlPool')
var sqlConfig = require('../DB/sqlConfig')
const utils = require('../utils/utils')
var md5 = require('md5')

let login =  {
    login: async (name)=> {
        let sql = `SELECT * FROM ${sqlConfig.configureName.ADMINUSER} WHERE name= '${name}'`
        return sqlPool.queryData(sql,[])
    },

    updateUserToken: async (name)=>{
        let token = md5(info.name + utils.MD5_KEYS)
        let updateTokenSql = `update ${sqlConfig.configureName.ADMINUSER} set token = ? where name = ?`
        return sqlPool.queryData(updateTokenSql,[token, name])
    },

    //验证token
    getAuthorization: async (token) => {
        let sql = `SELECT * FROM ${sqlConfig.configureName.ADMINUSER} WHERE token=?`
        return sqlPool.queryData(sql,[token])
    },

}

module.exports = login
