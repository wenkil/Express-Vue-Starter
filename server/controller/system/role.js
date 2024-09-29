const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const roleMoudle = require("../../moudle/system/role");

module.exports = {

    getRoleList: async (req, res) => {
        try {
            let info = req.query;
            let count = await roleMoudle.getRolesCount(info);
            let data = await roleMoudle.getRoleList(info);
            let resData = { list: data.rows, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.ROLELIST);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取权限列表异常:" + e.message));
        }
    },

    addRole: async (req, res) => {
        try {
            let info = req.body;
            let sakeInfo = await roleMoudle.queryNameSake(info.name);
            if (sakeInfo.rows && sakeInfo.rows.length > 0) return res.send(util.ErrorResponse("该权限名称已存在"));
            let data = await roleMoudle.addRole(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.ROLEADD + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("新增角色接口异常:" + e.message));
        }
    },

    updateRole: async (req, res) => {
        try {
            let info = req.body;
            let sakeInfo = await roleMoudle.queryIdSake(info.role_id);
            if (sakeInfo.rows && sakeInfo.rows.length > 0) {
                await roleMoudle.updateRole(info);
                logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.ROLEUPDATE + " ID:" + info.role_id);
                res.send(util.SuccessResponse({}));
            }
            else {
                res.send(util.ErrorResponse("该权限组不存在"));
            }
        } catch (e) {
            res.send(util.ErrorResponse("更新角色接口异常:" + e.message));
        }
    }

};
