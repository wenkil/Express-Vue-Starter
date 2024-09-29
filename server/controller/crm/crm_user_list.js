const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const CrmUserMoudle = require("../../moudle/crm/crm_user_list");
const systemMoudle = require("../../moudle/system/user");
const crmSourceMoudle = require("../../moudle/crm/clue_source");
const moment = require("moment");
const xlsx = require("node-xlsx");

module.exports = {
    getCrmUserList: async (req, res) => {
        try {
            let info = req.query;
            // crm_list_type 1自己的客户 2自己的和所有下属的客户
            if (info.crm_list_type && info.crm_list_type == 2) {
                if (res.locals.role_id !== 1) { //找出当前请求用户所有下级
                    let allSubordinateData = await systemMoudle.getAllSubordinateByUser(res.locals.admin_id);
                    let allData = allSubordinateData.rows.map(item => item.user_id).join(",");
                    info.hierarchy = res.locals.admin_id + (allData ? "," + allData : "");
                }
            }
            else {
                if (res.locals.role_id !== 1) info.hierarchy = res.locals.admin_id;
            }

            let count = await CrmUserMoudle.count(info);
            let data = await CrmUserMoudle.list(info);
            let resData = { list: data.rows, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.CRMUSER);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取客户数据异常:" + e.message));
        }
    },

    export: async (req, res) => {
        try {
            let info = req.query;
            // crm_list_type 1自己的客户 2自己的和所有下属的客户
            if (info.crm_list_type && info.crm_list_type == 2) {
                if (res.locals.role_id !== 1) { //找出当前请求用户所有下级
                    let allSubordinateData = await systemMoudle.getAllSubordinateByUser(res.locals.admin_id);
                    let allData = allSubordinateData.rows.map(item => item.user_id).join(",");
                    info.hierarchy = res.locals.admin_id + (allData ? "," + allData : "");
                }
            }
            else {
                if (res.locals.role_id !== 1) info.hierarchy = res.locals.admin_id;
            }

            //导出的数据处理
            info.page = 1;
            info.limit = 2000;
            let data = await CrmUserMoudle.list(info);
            if (data.rows.length == 0) {
                res.send(util.ErrorResponse("当前搜索条件未查询到客户数据"));
            }
            else {
                let source_data = await crmSourceMoudle.list({ page: 1, limit: 500 });
                let array = data.rows.map(item => {
                    let creat_time = moment(item.creat_time).format("YYYY-MM-DD HH:mm:ss");
                    let update_time = item.update_time ? moment(item.update_time).format("YYYY-MM-DD HH:mm:ss") : "";
                    let source_filter = source_data.rows.filter(v => v.id == item.source_id);
                    let source_name = source_filter.length > 0 ? source_filter[0].source_name : "";
                    let crm_user_trade = util.getCrmuserInfoByType(item.crm_user_trade, "cus_trade");
                    let crm_user_level = util.getCrmuserInfoByType(item.crm_user_level, "cus_level");
                    return [
                        item.crm_user_name,
                        source_name,
                        item.crm_user_phone,
                        item.crm_user_mail,
                        item.crm_user_address,
                        crm_user_trade,
                        crm_user_level,
                        item.contact_cnt,
                        item.record_cnt,
                        item.order_cnt,
                        item.charge_user_name,
                        item.remark,
                        creat_time,
                        update_time,
                        item.creat_admin_name,
                        item.admin_name
                    ];
                });
                array.unshift([
                    "客户名称",
                    "客户来源",
                    "手机号",
                    "邮箱",
                    "联系地址",
                    "客户行业",
                    "客户等级",
                    "联系人",
                    "跟进记录",
                    "客户订单",
                    "负责人",
                    "备注",
                    "创建时间",
                    "更新时间",
                    "创建人",
                    "最后操作人"
                ]);

                const options = {
                    "!cols": [
                        { wpx: 100 },
                        { wpx: 80 },
                        { wpx: 90 },
                        { wpx: 100 },
                        { wpx: 140 },
                        { wpx: 100 },
                        { wpx: 100 },
                        { wpx: 80 },
                        { wpx: 80 },
                        { wpx: 80 },
                        { wpx: 60 },
                        { wpx: 200 },
                        { wpx: 140 },
                        { wpx: 140 },
                        { wpx: 60 },
                        { wpx: 80 }
                    ]
                    // "!margins": { left: 0.7, right: 0.7, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 }
                };
                const buffer = xlsx.build([{ name: "sheet", data: array }], options);
                res.setHeader("Content-Type", "application/octet-stream"); //setHeader一定要写在生成buffer的下面
                res.send(buffer);
                logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.EXPORT, operationType.CRMUSER);
            }
        } catch (e) {
            return res.send(util.ErrorResponse("导出客户数据异常:" + e.message));
        }
    },

    addCrmUser: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            info.creat_admin_id = res.locals.admin_id;
            let data = await CrmUserMoudle.add(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.CRMUSER + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("新增客户操作异常:" + e.message));
        }
    },

    updateCrmUser: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            await CrmUserMoudle.update(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.CRMUSER + " ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("更新客户数据异常:" + e.message));
        }
    },

    /**
     * 批量分配责任人：更新客户责任人id
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    allotCrmUserInfo: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            await CrmUserMoudle.allotCrmUserInfo(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.CRMUSER + " 绑定负责人 ID:" + info.clue_list);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("分配线索数据异常:" + e.message));
        }
    },

    /**
     * 客户来源分析
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    getCrmSourceAnalyse: async (req, res) => {
        try {
            let info = req.query;
            let data = await CrmUserMoudle.sourceAnalyse(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.CRMUSER_ANALYSE);
            res.send(util.SuccessResponse({ list: data.rows }));
        } catch (e) {
            res.send(util.ErrorResponse("客户来源分析数据异常:" + e.message));
        }
    },

    /**
     * 客户等级分析
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    getCrmLevelAnalyse: async (req, res) => {
        try {
            let info = req.query;
            let data = await CrmUserMoudle.levelAnalyse(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.CRMUSER_ANALYSE);
            res.send(util.SuccessResponse({ list: data.rows }));
        } catch (e) {
            res.send(util.ErrorResponse("客户来源分析数据异常:" + e.message));
        }
    },

    /**
     * 客户行业分析
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    getCrmTradeAnalyse: async (req, res) => {
        try {
            let info = req.query;
            let data = await CrmUserMoudle.tradeAnalyse(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.CRMUSER_ANALYSE);
            res.send(util.SuccessResponse({ list: data.rows }));
        } catch (e) {
            res.send(util.ErrorResponse("客户来源分析数据异常:" + e.message));
        }
    }
};
