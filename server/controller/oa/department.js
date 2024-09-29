const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const departmentMoudle = require("../../moudle/oa/department");
const userMoudle = require("../../moudle/system/user");

module.exports = {
    getDepList: async (req, res) => {
        try {
            let info = req.query;
            let data = await departmentMoudle.list(info);
            //将部门数据转化格式
            let test = util.getTree(data.rows);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.DEPLIST);
            res.send(util.SuccessResponse({ list: test }));
        } catch (e) {
            return res.send(util.ErrorResponse("获取部门数据异常:" + e.message));
        }
    },

    addDep: async (req, res) => {
        try {
            let info = req.body;
            let checkRepeat = await departmentMoudle.checkRepeat(info);
            if (checkRepeat.err) return res.send(util.ErrorResponse(checkRepeat.err.sqlMessage));
            if (checkRepeat.rows.length > 0 && checkRepeat.rows[0].name == info.name) return res.send(util.ErrorResponse("部门名称重复,请重新输入"));
            let data;
            if (info.type == 1) { //一级部门
                data = await departmentMoudle.addFirst({ name: info.name });
            }
            else { //二级部门
                //先检测是否有关联员工
                let checkBystaff = await departmentMoudle.checkDepByStaff(info.pid);
                if (checkBystaff.err) return res.send(util.ErrorResponse(checkBystaff.err.sqlMessage));
                if (checkBystaff.rows.length && checkBystaff.rows.filter(v => v.staff_id && v.depart_id).length) {
                    return res.send(util.ErrorResponse("该部门下关联了员工,新增子级需要清空当前部门员工"));
                }

                if (!info.pid) return res.send(util.ErrorResponse("请选择上级部门"));
                data = await departmentMoudle.addSecend({ name: info.name, pid: info.pid });
            }
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.ADDDEP + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("新增部门操作异常:" + e.message));
        }
    },

    updateDep: async (req, res) => {
        try {
            let info = req.body;
            await departmentMoudle.update(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.UPDATEDEP + " ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("更新部门数据异常:" + e.message));
        }
    },
    deleteDep: async (req, res) => {
        try {
            let info = req.body;
            let checkData = await departmentMoudle.deleteCheck(info);
            if (checkData.err) return res.send(util.ErrorResponse(checkRepeat.err.sqlMessage));
            if (checkData.rows.length > 0) return res.send(util.ErrorResponse("该部门还有下级部门,不可删除"));

            //先检测是否有关联员工
            let checkBystaff = await departmentMoudle.checkDepByStaff(info.id);
            if (checkBystaff.err) return res.send(util.ErrorResponse(checkBystaff.err.sqlMessage));
            if (checkBystaff.rows.length && checkBystaff.rows.filter(v => v.staff_id && v.depart_id).length) {
                return res.send(util.ErrorResponse("该部门下关联了员工,删除部门需要清空当前部门员工"));
            }

            await departmentMoudle.delete(info);

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.DELETE, operationType.DELETEDEP + " ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("删除部门数据异常:" + e.message));
        }
    }
};
