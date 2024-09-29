const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const systemMoudle = require("../../moudle/system/user");
const departmentMoudle = require("../../moudle/oa/department");
var loginMoudle = require("../../moudle/login");
const hashUtil = require("../../utils/setHash");

module.exports = {

    /**
     * 获取用户信息：用户名,token,用户权限等..
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    getUserInfo: async (req, res) => {
        try {
            let token = req.headers["authorization"] || req.headers["Authorization"];
            let data = await systemMoudle.getUserInfo(token);
            res.send(util.SuccessResponse({ info: data.rows[0] }));
        } catch (e) {
            return res.send(util.ErrorResponse("获取用户信息异常:" + e.message));
        }
    },

    /**
     * 获取用户列表
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    getUserList: async (req, res) => {
        try {
            let info = req.query;
            let resData = {};
            if (!info.listType) { //传值就是只有绑定部门的列表，不传就是正常列表
                let count = await systemMoudle.getListCount(info);
                let data = await systemMoudle.getUserList(info);
                resData = { list: data.rows, count: count.rows[0].count };
            }
            else {
                let data = await systemMoudle.getUserListByDepart(info);
                resData = { list: data.rows };
            }
            res.send(util.SuccessResponse(resData));
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.SYSTEMUSERLIST);
        } catch (e) {
            return res.send(util.ErrorResponse("获取用户列表异常:" + e.message));
        }
    },

    /**
     * 更换用户密码
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    changePassword: async (req, res) => {
        try {
            if (res.locals.role_id === 1) {
                return res.send(util.ErrorResponse("此账号演示所用,不可修改密码"));
            }
            let info = req.body;
            let token = req.headers["authorization"] || req.headers["Authorization"];
            let userInfo = await loginMoudle.getAuthorization(token);
            //使用用户传来的密码进行判断是否一致：不一致返回旧密码错误，一致的话直接更新
            const old_hash = hashUtil.checkPassword(info.old_password, userInfo.rows[0].salt);
            if (userInfo.rows[0].password === old_hash) {
                let newPassword = hashUtil.checkPassword(info.new_password, userInfo.rows[0].salt);
                await systemMoudle.changePassword({
                    password: newPassword,
                    user_id: userInfo.rows[0].user_id
                });
                res.send(util.SuccessResponse([]));
                logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.PASSWORD, operationType.SYSTEMUSERCHANGEPASSWORD);
            }
            else {
                res.send(util.ErrorResponse("旧密码输入错误"));
            }
        } catch (e) {
            return res.send(util.ErrorResponse("修改密码接口异常:" + e.message));
        }
    },

    /**
     * 新增系统用户
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    addUser: async (req, res) => {
        try {
            let info = req.body;
            let sakeInfo = await systemMoudle.queryNameSake(info.name); //检查同名用户
            if (sakeInfo.rows && sakeInfo.rows.length > 0) return res.send(util.ErrorResponse("用户名已存在"));
            //新增用户直接绑定直属上级,编辑需要判断
            let addInfo = await systemMoudle.addSystemUser(info);
            res.send(util.SuccessResponse({}));
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.ADDSYSTEMUSER + " ID:" + addInfo.rows.insertId);
        } catch (err) {
            res.send(util.ErrorResponse("新增用户接口异常:" + err.message));
        }
    },
    /**
     * 更新用户：先检查用户是否存在再进行更新; 需要判断当前用户要绑定的上级在不在自己下属里,不在下属里才可以绑定
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    updateUser: async (req, res) => {
        try {
            let info = req.body;
            if (Number(info.user_id) === 1) return res.send(util.ErrorResponse("此账号演示所用,不可修改"));
            let sakeInfo = await systemMoudle.queryIdSake(info.user_id); //检查用户是否存在
            if (sakeInfo.rows.length == 0) res.send(util.ErrorResponse("用户不存在"));

            let data = {
                name: info.name,
                role_id: info.role_id,
                user_id: info.user_id,
                superior: null
            };
            if (info.superior && info.superior != "") {
                data.superior = info.superior;
                let superiorInfo = await systemMoudle.queryIdSake(info.superior); //检查上级用户是否存在
                if (superiorInfo.rows.length == 0) res.send(util.ErrorResponse("直属上级用户不存在"));
                let allSubordinateData = await systemMoudle.getAllSubordinateByUser(Number(info.user_id)); //找出当前用户所有下级
                //判断所有下级里是否包含要绑定的直属上级
                let allData = allSubordinateData.rows;
                let filterData = allData.filter(item => item.user_id === Number(info.superior));
                if (filterData.length) {
                    return res.send(util.ErrorResponse(`${sakeInfo.rows[0].name}的职级大于${superiorInfo.rows[0].name}的职级,不可设为直属上级`));
                }
            }
            await systemMoudle.updateSystemUser(data, ["name"]);
            res.send(util.SuccessResponse({}));
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.UPDATESYSTEMUSER + " ID:" + info.user_id);
        } catch (e) {
            res.send(util.ErrorResponse("更新用户接口异常:" + e.message));
        }
    },

    /**
     * 禁用用户：先检查用户是否存在,并且没有绑定下级的用户才可以禁用
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    deleteUser: async (req, res) => {
        try {
            let info = req.body;
            let sakeInfo = await systemMoudle.queryIdSake(info.user_id); //检查用户是否存在
            if (sakeInfo.rows.length > 0) {
                if (sakeInfo.rows[0].role_id === 1) return res.send(util.ErrorResponse("非法操作"));//超管身份不可禁用
                if (sakeInfo.rows[0].user_status == info.type) return res.send(util.ErrorResponse("用户状态无需修改"));
                if (info.type == 2) { //禁用时先检测是否有下级关系存在 并检查该用户是否还有待审批订单需要处理
                    let allSubordinateData = await systemMoudle.getAllSubordinateByUser(Number(info.user_id)); //找出当前用户所有下级
                    if (allSubordinateData.rows.length) return res.send(util.ErrorResponse("该用户还有下级绑定,不可禁用"));

                    let userOrderData = await systemMoudle.getUserByApproveOrder(info)
                    if(userOrderData.rows.length) {
                        return res.send(util.ErrorResponse(`该用户还有订单ID为【${userOrderData.rows.map(v=> v.id).join(',')}】的订单需要审批,请先将该用户移出审批流程,再进行操作`));
                    }
                }
                let delete_res = await systemMoudle.deleteSystemUser(info.user_id, info.type);
                res.send(util.SuccessResponse({}));
                logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.DELETE, operationType.DELETESYSTEMUSER + " ID:" + info.user_id);
            }
            else {
                res.send(util.ErrorResponse("用户不存在"));
            }
        } catch (e) {
            res.send(util.ErrorResponse("删除用户接口异常:" + e.message));
        }
    }

};
