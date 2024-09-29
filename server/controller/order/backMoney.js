const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const backMoneyModule = require("../../moudle/order/backMoney");
const orderModule = require("../../moudle/order/order");
const orderReportModule = require("../../moudle/order/order-report");

module.exports = {

    getList: async (req, res) => {
        try {
            let info = req.query;
            info.admin_id = res.locals.admin_id;
            if (Number(res.locals.role_id) === 1) { //管理员账户看到所有回款列表
                info.related = 0;
            }
            //related 值为1时查找待我审批的订单,值为2时查找所有我创建的
            let data = await backMoneyModule.list(info);
            let count = await backMoneyModule.count(info);
            let list = data.rows.length > 0
                ?
                data.rows.map(item => {
                    item.isApprove = info.related == 0 || info.related == 2 ? 2 : 1;//1在审批人里,2不在审批人里
                    return item;
                })
                :
                [];
            let resData = { list, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.BACKMONEYLIST);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取回款列表异常:" + e.message));
        }
    },

    add: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            let orderIndo = await orderModule.getOrderById({ id: info.order_id });
            if (orderIndo.rows.length == 0) return res.send(util.ErrorResponse("该订单不存在"));
            if (orderIndo.rows[0].effect_status == 1) return res.send(util.ErrorResponse("该订单已生效,不可新增回款"));
            if (orderIndo.rows[0].order_cycle == 2) return res.send(util.ErrorResponse("该订单已取消,不可新增回款"));

            let data = await backMoneyModule.add(info);

            //订单流程记录: 创建回款记录
            await orderReportModule.orderFlowReport({
                order_id: info.order_id,
                order_type: 2,
                operate_type: 1,
                admin_id: res.locals.admin_id,
                descr: `回款ID:${data.rows.insertId},回款金额:${Number(info.collect_amount) / 100}`
            });
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.BACKMONEYLIST + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("新增回款操作异常:" + e.message));
        }
    },

    edit: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;

            //检查订单状态是否是驳回状态
            let orderInfo = await backMoneyModule.getById(info);
            if (orderInfo.rows.length == 0) return res.send(util.ErrorResponse("该回款不存在"));
            if (orderInfo.rows[0].admin_id !== res.locals.admin_id) return res.send(util.ErrorResponse("非该回款创建人,不可进行编辑操作"));
            if (orderInfo.rows[0].approve_status != 2) return res.send(util.ErrorResponse("此回款非驳回状态不可编辑"));
            if (orderInfo.rows[0].approve_status == 2) { //如果是驳回状态就将状态改为待审批状态
                info.approve_status = 1;
            }

            await backMoneyModule.update(info);

            //编辑之后写入订单流程记录,重新走审批流程
            await orderReportModule.orderFlowReport({
                order_id: orderInfo.rows[0].order_id,
                order_type: 2,
                operate_type: 6,//重新发起审批
                admin_id: res.locals.admin_id,
                descr: `回款ID:${info.id},回款金额:${info.collect_amount / 100}`
            });

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.ORDERLIST + " ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("编辑回款操作异常:" + e.message));
        }
    },

    //用户点击审批弹框时检测当前用户是否已经审批过了,审批过的不再审批,未审批过的查看是否轮到自己审批
    //(传入的回款id必定是当前登陆人在审批列表里的，因为列表接口已经判断过)
    checkApprove: async (req, res) => {
        try {
            let info = req.query;
            info.admin_id = res.locals.admin_id;
            let orderData = await backMoneyModule.getById(info);
            if (orderData.rows.length == 0) return res.send(util.ErrorResponse("该回款不存在"));
            let data = await backMoneyModule.getAdminByApprove(info);

            let resData = { isApprove: 2 };//1可以审批,2不可审批
            let order_approves = orderData.rows[0].approve_user.split(",").map(v => Number(v));
            console.log("审批列表", order_approves);
            let arr = data.rows[0].a_id ? data.rows.map(v => v.a_id) : [];
            console.log("已审批列表", arr);

            if (order_approves.length == arr.length) {
                resData.isApprove = 2;
            }
            else {
                if (arr.length == 0) {//没有审批过,直接查看第一个是否是自己
                    resData.isApprove = order_approves[0] == info.admin_id ? 1 : 2;
                }
                else {
                    let idx = order_approves.indexOf(info.admin_id);
                    //判断审批列表,审批人是否轮到自己
                    for (let i = 0; i < order_approves.length; i++) {
                        if (order_approves[i] == info.admin_id && arr.indexOf(info.admin_id) < 0 && idx == arr.length) {
                            resData.isApprove = 1;
                            break;
                        }
                    }
                }
            }

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.BACKMONEYLIST + " 查验回款审批权限: " + info.id);
            res.send(util.SuccessResponse({ ...resData, msg: resData.isApprove == 1 ? "可以审批" : "不可审批" }));
        } catch (e) {
            return res.send(util.ErrorResponse("查看回款审批权限异常:" + e.message));
        }
    },

    //回款审核记录
    getApprovelist: async (req, res) => {
        try {
            let info = req.query;
            info.admin_id = res.locals.admin_id;

            //先获取回款数据再获取审核流程
            let orderData = await backMoneyModule.getById(info);
            if (orderData.rows.length == 0) return res.send(util.ErrorResponse("该回款不存在,无法查找审批记录"));
            info.users = orderData.rows[0].approve_user;

            let data = await backMoneyModule.getApproveOrderList(info);
            let arr = info.users.split(",");
            let resData = [];
            for (let i = 0; i < arr.length; i++) {
                let temp = data.rows.filter(item => item.user_id == arr[i]);
                resData.push(temp[0]);
            }

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.BACKMONEYAPPROVELIST);
            res.send(util.SuccessResponse({ list: resData }));
        } catch (e) {
            res.send(util.ErrorResponse("获取回款审核记录操作异常:" + e.message));
        }
    },

    //审批回款 : type 1驳回 2通过  不需要验证是否有审批权了,点击审批按钮时验证通过后才可以走这里
    approveOrder: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;

            //检查订单状态是否是驳回状态
            let orderData = await backMoneyModule.getById(info);

            let orderIndo = await orderModule.getOrderById({ id: orderData.rows[0].order_id });
            if (orderIndo.rows.length == 0) return res.send(util.ErrorResponse("该订单不存在"));
            if (orderIndo.rows[0].effect_status == 1) return res.send(util.ErrorResponse("该订单已生效,不可审批回款"));
            if (orderIndo.rows[0].order_cycle == 2) return res.send(util.ErrorResponse("该订单已取消,不可审批回款"));
            if (orderIndo.rows[0].approve_status == 4) return res.send(util.ErrorResponse("该订单已退款,不可审批回款"));
            if (orderIndo.rows[0].approve_status != 3) return res.send(util.ErrorResponse("该订单非审批通过状态,不可审批回款"));

            if (orderData.rows.length == 0) return res.send(util.ErrorResponse("该回款不存在"));
            if (orderData.rows[0].collect_cycle == 2) return res.send(util.ErrorResponse("此回款已取消,不可审批"));
            if (orderData.rows[0].approve_status == 2) return res.send(util.ErrorResponse("此回款已被驳回,不可审批"));

            let is_order_effect = false;
            //驳回时修改回款状态为已驳回,只有所有人都审批通过才改为回款状态为通过
            if (info.type == 1) {
                //先审批回款：修改订单状态、更新时间、操作人
                await backMoneyModule.approveOrder(info);

                //如果是驳回回款,把审批记录表的该回款id记录全部删除,该回款从新走审批流程
                await orderReportModule.deleteBackMoneyApproveReport(info);
            }
            else if (info.type == 2) { //只有审批通过才写入审批数据表中,为了做验证审批权限； type值： 1驳回 2通过
                //如果是审批通过回款，先判断是否大于未回款的金额
                let order_data = orderIndo.rows[0];
                let { rows } = await backMoneyModule.list({ id: order_data.id });//得到所有回款数据
                let amount_total = 0;
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].approve_status == 3) {
                        amount_total += rows[i].collect_amount;
                    }
                }
                if (orderData.rows[0].collect_amount > order_data.actual_amount - amount_total) {
                    return res.send(util.ErrorResponse("回款金额不得大于未回款金额"));
                }
                //写进回款审批记录
                await orderReportModule.approveBackmoney({
                    id: info.id,
                    approve_user: res.locals.admin_id
                });
                //审批通过后判断是否是最后一人审批,是的话修改订单状态为已通过
                let approveData = await backMoneyModule.getAdminByApprove(info);
                let order_approves = orderData.rows[0].approve_user.split(",").map(v => Number(v));
                console.log("审批列表", order_approves);
                let arr = approveData.rows.length > 0 ? approveData.rows.map(v => v.a_id) : [];
                console.log("已审批列表", arr);
                let repeatArr = order_approves.filter(v => !arr.includes(v));
                console.log("去重", repeatArr);
                if (repeatArr.length == 0) { //所有人都审批完成，可以修改状态为已通过
                    await backMoneyModule.approveOrder(info);

                    //审批完成时如果已回款金额等于订单金额,则订单生效
                    let new_order_data = await orderModule.list({ id: orderData.rows[0].order_id, related: 0 });
                    if (new_order_data.rows[0].real_back_amount === new_order_data.rows[0].actual_amount) {
                        await orderModule.effectOrder({ id: orderData.rows[0].order_id });
                        //订单生效后则生成订单流程记录为生效
                        is_order_effect = true;
                    }
                }
            }
            //回款维度的订单流程记录
            await orderReportModule.orderFlowReport({
                order_id: orderData.rows[0].order_id,//该笔回款的订单id
                order_type: 2,
                operate_type: info.type == 1 ? 3 : 2, //info.type 1驳回 2通过  operate_type 2通过 3驳回
                admin_id: res.locals.admin_id,
                descr: `回款ID:${orderData.rows[0].id},回款金额:${orderData.rows[0].collect_amount / 100}`
            });
            if (is_order_effect) {
                await orderReportModule.orderFlowReport({
                    order_id: orderData.rows[0].order_id,//该笔回款的订单id
                    order_type: 1,
                    operate_type: 7,//订单生效
                    admin_id: res.locals.admin_id,
                    descr: `订单金额已全部回款,订单已生效`
                });
            }
            await logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.APPROVE, operationType.BACKMONEYLIST + " 回款审批ID:" + info.id);
            await logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.APPROVE, operationType.ORDERFLOWLIST + " 回款审批ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("审核订单操作异常:" + e.message));
        }
    },

    /**
     * 删除回款
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    cancel: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            //根据订单生命周期流程检查是否可以取消,判断订单是否生效
            let backInfo = await backMoneyModule.getById(info);
            if (backInfo.rows.length == 0) return res.send(util.ErrorResponse("该回款不存在"));
            if (backInfo.rows[0].collect_cycle == 2) return res.send(util.ErrorResponse("此回款已取消,不可重复操作"));
            if (backInfo.rows[0].approve_status == 3) return res.send(util.ErrorResponse("此回款已审批通过,不可取消"));
            if (backInfo.rows[0].admin_id !== res.locals.admin_id) return res.send(util.ErrorResponse("非该回款创建人,不可进行取消操作"));

            //取消订单
            await backMoneyModule.del(info);

            //取消之后写入订单流程记录
            await orderReportModule.orderFlowReport({
                order_id: backInfo.rows[0].order_id,
                order_type: 2,
                operate_type: 5,//取消回款
                admin_id: res.locals.admin_id,
                descr: `回款ID:${backInfo.rows[0].id},回款金额:${backInfo.rows[0].collect_amount / 100}`
            });

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.DELETE, operationType.ORDERLIST + " ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("取消订单操作异常:" + e.message));
        }
    }
};
