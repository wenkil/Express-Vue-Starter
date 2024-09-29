var sqlPool = require("../DB/sqlPool");
var sqlConfig = require("../DB/sqlConfig");
var moment = require("moment");
var UA = require("ua-parser-js");

module.exports = {
    /**
     * 记录接口请求操作日志
     * @param req 请求数据
     * @param type 操作类型
     * @param content 操作内容
     * @returns {Promise<void>}
     */
    setUserOperationLog: async (req, res, type, content, loginInfo) => {
        try{
            let ip = req.headers["x-real-ip"] || req.headers["x-forwarded-for"];
            if(ip != '127.0.0.1' && ip != undefined && ip != 'undefined'){
                let ua = UA(req.headers["user-agent"]);
                // console.log('ua',ua)
                // console.log('loginInfo',loginInfo)
                let browser = ua.browser.name + " " + ua.browser.major; //浏览器信息
                let os = ua.os.name + " " + ua.os.version;  //操作系统
                let device = (ua.device.type && ua.device.vendor) ? ua.device.type + " " + ua.device.vendor : "PC"; //设备信息
                let token = req.url == "/api/login" ? loginInfo.rows[0].token : (req.headers["authorization"] || req.headers["Authorization"]);
                let creatTime = moment().format("x");
                let sql = `insert into ${sqlConfig.configureName.OPERATION_LOG} (operat_type,token,ip,creat_time,content,browser,os,device) values  `;
                sql += `('${type}', '${token}', '${ip}', '${creatTime}', '${content}', '${browser}','${os}','${device}')`;
                let operaInfo = await sqlPool.queryData(sql, []);
                console.log(`记录${req.url}接口操作记录的返回`, operaInfo);
            }
        }
        catch (e) {
            res.send(util.ErrorResponse("操作日志异常:" + e.message));
        }
    }
};
