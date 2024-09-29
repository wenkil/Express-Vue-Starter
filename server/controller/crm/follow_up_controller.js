const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const FollowMoudle = require("../../moudle/crm/follow_up_model");
const ContactMoudle = require("../../moudle/crm/contact");
const CrmUserMoudle = require("../../moudle/crm/crm_user_list");
const systemMoudle = require("../../moudle/system/user");

module.exports = {
    getFollowRecord: async (req, res) => {
        try {
            let info = req.query;
            if (res.locals.role_id !== 1) { //找出当前请求用户所有下级
                let allSubordinateData = await systemMoudle.getAllSubordinateByUser(res.locals.admin_id);
                let allData = allSubordinateData.rows.map(item => item.user_id).join(",");
                info.hierarchy = res.locals.admin_id + (allData ? "," + allData : "");
            }
            let count = await FollowMoudle.count(info);
            let data = await FollowMoudle.list(info);
            let resData = { list: data.rows, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.FOLLOWRECORD);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取跟进记录数据异常:" + e.message));
        }
    },

    /**
     * 新增跟进记录:先修改联系人的下次联系时间,再新增记录
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    addFollowRecord: async (req, res) => {
        try {
            let info = req.body;
            // info.admin_id = res.locals.admin_id
            info.creat_admin_id = res.locals.admin_id;


            //更新联系人下次联系时间
            await ContactMoudle.updateNextTime({
                next_contact_time: info.next_contact_time,
                contact_id: info.crm_contact_id
            });

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.CRMCONTACT + " ID:" + info.crm_contact_id);

            //新增跟进记录
            let data = await FollowMoudle.add(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.FOLLOWRECORD + " ID:" + data.rows.insertId);

            res.send(util.SuccessResponse());
        } catch (e) {
            res.send(util.ErrorResponse("新增跟进记录操作异常:" + e.message));
        }
    }
};
