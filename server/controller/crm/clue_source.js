const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const clueSourceMoudle = require("../../moudle/crm/clue_source");

module.exports = {

    getClueSource: async (req, res) => {
        try {
            let info = req.query;
            let count = await clueSourceMoudle.count(info);
            let data = await clueSourceMoudle.list(info);
            let resData = { list: data.rows, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.CLUESOURCE);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取线索数据异常:" + e.message));
        }
    },

    addClueSource: async (req, res) => {
        try {
            let info = req.body;
            let data = await clueSourceMoudle.add(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.CLUESOURCE + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("新增线索来源异常:" + e.message));
        }
    },

    updateClueSource: async (req, res) => {
        try {
            let info = req.body;
            let updateData = await clueSourceMoudle.update(info);
            if (updateData.rows.changedRows == 1) {
                logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.CLUESOURCE + " ID:" + info.id);
                res.send(util.SuccessResponse({}));
            }
            else {
                //id不存在
                res.send(util.ErrorResponse("更新失败：该数据不存在"));
            }
        } catch (e) {
            res.send(util.ErrorResponse("更新线索来源接口异常:" + e.message));
        }
    }
};

