const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const systemMoudle = require("../../moudle/system/operationLog");

module.exports = {

    /**
     * 获取系统用户操作日志
     * @param
     * @returns {Promise<unknown>}
     */
    getSystemUserLogsList: async (req, res) => {
        try {
            let info = req.query;
            let count = await systemMoudle.getLogsCount(info);
            let data = await systemMoudle.getSystemUserLogsList(info);
            let resData = { list: data.rows, count: count.rows[0].count };
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取操作日志异常:" + e.message));
        }
    }
};
