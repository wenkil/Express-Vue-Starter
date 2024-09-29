var moment = require("moment");
const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const clueMoudle = require("../../moudle/crm/clue");
const crmUserMoudle = require("../../moudle/crm/crm_user_list");
const systemMoudle = require("../../moudle/system/user");

module.exports = {
    getClueList: async (req, res) => {
        try {
            let info = req.query;
            if (res.locals.role_id !== 1) { //找出当前请求用户所有下级
                let allSubordinateData = await systemMoudle.getAllSubordinateByUser(res.locals.admin_id);
                let allData = allSubordinateData.rows.map(item => item.user_id).join(",");
                info.hierarchy = res.locals.admin_id + (allData ? "," + allData : "");
            }
            let count = await clueMoudle.count(info);
            let data = await clueMoudle.list(info);
            let resData = { list: data.rows, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.CLUEDATA);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取线索数据异常:" + e.message));
        }
    },

    addClue: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            info.creat_admin_id = res.locals.admin_id;
            info.charge_user_id = res.locals.admin_id;
            let data = await clueMoudle.add(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.CLUEDATA + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("新增线索数据异常:" + e.message));
        }
    },

    updateClue: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            let updateData = await clueMoudle.update(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.CLUEDATA + " ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("更新线索数据异常:" + e.message));
        }
    },

    allotClueSingle: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            await clueMoudle.allotClueInfoSingle(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.CLUEDATA + " 绑定负责人 ID:" + info.user_id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("分配线索数据异常:" + e.message));
        }
    },

    /**
     * 批量分配责任人：更新线索责任人id
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    allotClue: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            await clueMoudle.allotClueInfo(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.CLUEDATA + " ID:" + info.clue_list);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("分配线索数据异常:" + e.message));
        }
    },

    /**
     * 批量转为客户：先批量将线索分配状态改为2(已转),再批量新增客户
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    divertCustom: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            //更新线索状态
            await clueMoudle.updateClueType(info);

            //获取要转入的所有线索数据
            let getRes = await clueMoudle.selectListByDivert(info);

            //新增客户: 将获取到的数据进行格式转换
            let creatTime = moment().format("x");
            let temp = getRes.rows.map(item => {
                let list = [
                    item.clue_name,
                    item.source_id,
                    item.clue_mail,
                    item.clue_phone,
                    item.clue_address,
                    item.cus_trade,
                    item.cus_level,
                    item.charge_user_id,
                    item.remark,
                    creatTime,
                    info.admin_id
                ];
                return list;
            });

            await crmUserMoudle.addDivertCLue(temp);

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.CRMUSER + " 线索批量转客户:" + info.clue_list);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("转客户数据异常:" + e.message));
        }
    }

};
