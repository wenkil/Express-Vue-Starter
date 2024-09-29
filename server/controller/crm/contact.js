const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const ContactMoudle = require("../../moudle/crm/contact");
const CrmUserMoudle = require("../../moudle/crm/crm_user_list");
const systemMoudle = require("../../moudle/system/user");

module.exports = {
    getList: async (req, res) => {
        try {
            let info = req.query;
            if (res.locals.role_id !== 1) { //找出当前请求用户所有下级
                let allSubordinateData = await systemMoudle.getAllSubordinateByUser(res.locals.admin_id);
                let allData = allSubordinateData.rows.map(item => item.user_id).join(",");
                info.hierarchy = res.locals.admin_id + (allData ? "," + allData : "");
            }
            let count = await ContactMoudle.count(info);
            let data = await ContactMoudle.list(info);
            let resData = { list: data.rows, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.CRMCONTACT);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取联系人数据异常:" + e.message));
        }
    },

    addContact: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            info.creat_admin_id = res.locals.admin_id;
            let crm_userData = await CrmUserMoudle.list({ id: info.crm_user_id });//找出客户负责人,自动设置为此联系人的负责人
            info.charge_user_id = crm_userData.rows[0].charge_user_id;
            let data = await ContactMoudle.add(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.CRMCONTACT + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse());
        } catch (e) {
            res.send(util.ErrorResponse("新增联系人操作异常:" + e.message));
        }
    },
    updateContact: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            await ContactMoudle.update(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.CRMCONTACT + " ID:" + info.contact_id);
            res.send(util.SuccessResponse());
        } catch (e) {
            res.send(util.ErrorResponse("更新联系人数据异常:" + e.message));
        }
    }
};
