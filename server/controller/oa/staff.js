const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const staffMoudle = require("../../moudle/oa/staff");

module.exports = {
    getStaffList: async (req, res) => {
        try {
            let info = req.query;
            let count = await staffMoudle.count(info);
            let data = await staffMoudle.list(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.STAFFLIST);
            res.send(util.SuccessResponse({
                list: data.rows,
                count: count.rows[0].count,
                onJobCnt: count.rows[0].onJobCnt,
                dismissionCnt: count.rows[0].dismissionCnt,
                probationCnt: count.rows[0].probationCnt
            }));
        } catch (e) {
            return res.send(util.ErrorResponse("获取员工数据异常:" + e.message));
        }
    },

    addStaff: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            let data = await staffMoudle.add(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.STAFFLIST + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse());
        } catch (e) {
            res.send(util.ErrorResponse("新增员工操作异常:" + e.message));
        }
    },

    editStaff: async (req, res) => {
        try {
            let info = req.body;
            if (!info.id) return res.send(util.ErrorResponse("id is must be require!!!"));
            info.admin_id = res.locals.admin_id;
            await staffMoudle.update(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.STAFFLIST + " ID:" + info.id);
            res.send(util.SuccessResponse());
        } catch (e) {
            res.send(util.ErrorResponse("编辑员工操作异常:" + e.message));
        }
    },

    dismissStaff: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            await staffMoudle.dismiss(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.STAFFLIST + " ID:" + info.id);
            res.send(util.SuccessResponse());
        } catch (e) {
            res.send(util.ErrorResponse("员工离职操作异常:" + e.message));
        }
    }
};
