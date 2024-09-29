var sqlPool = require("../DB/sqlPool");
var service = require("../moudle/login");
var md5 = require("md5");
const hashUtil = require("../utils/setHash");
const util = require("../utils/utils");
var moment = require("moment");
var logMoudle = require("../api/operateLog");
var operationType = require("../utils/operationType");

module.exports = {

    login: async (req, res) => {
        try {
            let info = req.body;
            let loginInfo = await service.login(info.name);
            if (loginInfo.rows.length == 0) {
                res.send(util.ErrorResponse("用户不存在"));
            }
            else {
                const hash = hashUtil.checkPassword(info.password, loginInfo.rows[0].salt);
                if (loginInfo.rows[0].user_status === 1) {
                    if (hash && hash == loginInfo.rows[0].password) {
                        res.send(util.SuccessResponse({ token: loginInfo.rows[0].token }));
                        logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.LOGIN, operationType.LOGIN, loginInfo);
                    }
                    else {
                        res.send(util.ErrorResponse("登录密码错误"));
                    }
                }
                else {
                    res.send(util.ErrorResponse("当前登录账号已被禁用,请联系管理员"));
                }
            }
        } catch (err) {
            res.send(util.ErrorResponse("登录异常: " + err.message));
        }
    }

};
