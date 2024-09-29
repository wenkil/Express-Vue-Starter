const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const orderModule = require("../../moudle/order/order");
const backMoneyModule = require("../../moudle/order/backMoney");
const orderReportModule = require("../../moudle/order/order-report");

module.exports = {

    getList: async (req, res) => {
        try {
            let info = req.query;
            info.admin_id = res.locals.admin_id;

            //非管理员只能查看 自己创建的和需要自己审批的
            //related 值为1时查找待我审批的订单,值为2时查找所有我创建的

            if (Number(res.locals.role_id) === 1) { //管理员账户看到所有订单列表,并且默认isApprove=2
                info.related = 0;
            }

            let data = await orderModule.list(info);
            let count = await orderModule.count(info);

            let list = data.rows.length > 0
                ?
                data.rows.map(item => {
                    item.isApprove = info.related == 0 || info.related == 2 ? 2 : 1;//1在审批人里,2不在审批人里
                    if (info.order_cycle === 2) { //如果订单已取消,只能查看,不得操作
                        item.isApprove = 2;
                    }
                    return item;
                })
                :
                [];
            let resData = { list, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.ORDERLIST);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取订单列表异常:" + e.message));
        }
    },

    add: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;

            let order = await orderModule.getOrderByOrderNumber(info);
            let obj = order.rows && order.rows.length > 0 ? order.rows[0] : {};
            if (obj.order_number == info.order_number) {
                return res.send(util.ErrorResponse("订单编号重复"));
            }

            let data = await orderModule.add(info);
            //订单维度的订单流程记录
            await orderReportModule.orderFlowReport({
                order_id: data.rows.insertId,
                order_type: 1,
                operate_type: 1,
                admin_id: res.locals.admin_id
            });
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.ORDERLIST + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("新增订单操作异常:" + e.message));
        }
    },

    edit: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;

            //检查订单状态是否是驳回状态
            let orderInfo = await orderModule.getOrderById(info);
            if (orderInfo.rows.length == 0) return res.send(util.ErrorResponse("该订单不存在"));
            if (orderInfo.rows[0].admin_id !== res.locals.admin_id) return res.send(util.ErrorResponse("非该订单创建人,不可进行取消操作"));
            if (orderInfo.rows[0].order_cycle == 2) return res.send(util.ErrorResponse("此订单已取消,不可编辑"));
            if (orderInfo.rows[0].approve_status != 2) return res.send(util.ErrorResponse("此订单非驳回状态不可编辑"));
            if (orderInfo.rows[0].approve_status == 2) { //如果是驳回状态就将状态改为待审批状态
                info.approve_status = 1;
            }

            //编辑时查验订单编号是否重复
            let orderNumber = await orderModule.getOrderByOrderNumber(info);
            for (let i = 0; i < orderNumber.rows.length; i++) {
                if (orderNumber.rows[i].order_number == info.order_number && orderNumber.rows[i].id != info.id) {
                    return res.send(util.ErrorResponse("订单编号重复"));
                }
            }

            await orderModule.update(info);

            //编辑之后写入订单流程记录,重新走审批流程
            await orderReportModule.orderFlowReport({
                order_id: info.id,
                order_type: 1,
                operate_type: 6,//重新发起审批
                admin_id: res.locals.admin_id
            });

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.ORDERLIST + " ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("编辑订单操作异常:" + e.message));
        }
    },

    cancel: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            //根据订单生命周期流程检查是否可以取消,判断订单是否生效
            let orderInfo = await orderModule.getOrderById(info);
            if (orderInfo.rows.length == 0) return res.send(util.ErrorResponse("该订单不存在"));
            if (orderInfo.rows[0].admin_id !== res.locals.admin_id) return res.send(util.ErrorResponse("非该订单创建人,不可进行取消操作"));
            if (orderInfo.rows[0].order_cycle == 2) return res.send(util.ErrorResponse("此订单已取消,不可重复操作"));
            if (orderInfo.rows[0].effect_status == 1) return res.send(util.ErrorResponse("此订单已生效,不可取消"));
            if (orderInfo.rows[0].approve_status == 4) return res.send(util.ErrorResponse("此订单已退款,不可取消"));

            //获取该订单下所有回款数据：如果订单下有回款,如果有任一一笔已经通过,不可取消订单,如都未审批通过,提示先取消回款,再取消订单
            let backInfo = await backMoneyModule.list({
                order_id: info.id
            });
            if (backInfo.rows.length > 0) {
                let approve_arr = backInfo.rows.filter(item => item.collect_cycle == 1 && item.approve_status == 3)
                console.log('approve_arr',approve_arr);
                if(approve_arr.length) return res.send(util.ErrorResponse("此订单已有回款通过审批,不可取消"));

                //待审批和驳回状态都计算在内
                let arr = backInfo.rows.filter(item => item.collect_cycle == 1 && (item.approve_status == 1 || item.approve_status == 2));
                if (arr.length == backInfo.rows.length) return res.send(util.ErrorResponse("请先取消此订单下的所有回款,再取消此订单"));
            }

            //取消订单
            await orderModule.cancelOrder(info);

            //取消之后写入订单流程记录
            await orderReportModule.orderFlowReport({
                order_id: info.id,
                order_type: 1,
                operate_type: 5,
                admin_id: res.locals.admin_id
            });

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.DELETE, operationType.ORDERLIST + " ID:" + info.id);
            res.send(util.SuccessResponse({list:backInfo.rows}));
        } catch (e) {
            res.send(util.ErrorResponse("取消订单操作异常:" + e.message));
        }
    },

    //审批订单 ： type 1驳回 2通过  不需要验证是否有审批权了,点击审批按钮时验证通过后才可以走这里
    approveOrder: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;

            //检查订单状态是否是驳回状态
            let orderData = await orderModule.getOrderById(info);
            if (orderData.rows.length == 0) return res.send(util.ErrorResponse("该订单不存在"));
            if (orderData.rows[0].order_cycle == 2) return res.send(util.ErrorResponse("此订单已取消,不可审批"));
            if (orderData.rows[0].approve_status == 2) return res.send(util.ErrorResponse("此订单已被驳回,不可审批"));

            //驳回时修改订单状态为已驳回,只有所有人都审批通过才改为订单状态为通过
            if (info.type == 1) {
                //先审批订单：修改订单状态、更新时间、操作人
                await orderModule.approveOrder(info);

                //如果是驳回订单,把审批记录表的该订单id记录全部删除,该订单从新走审批流程
                await orderReportModule.deleteOrderApproveReport(info);
            }
            else if (info.type == 2) { //只有审批通过才写入审批数据表中,为了做验证审批权限； type值： 1驳回 2通过
                //写进订单审批记录
                await orderReportModule.approveOrderReport({
                    order_id: info.id,
                    approve_user: res.locals.admin_id
                });

                //审批通过后判断是否是最后一人审批,是的话修改订单状态为已通过
                let approveData = await orderModule.getAdminByApprove(info);
                let order_approves = orderData.rows[0].approve_user.split(",").map(v => Number(v));
                console.log("审批列表", order_approves);
                let arr = approveData.rows.length > 0 ? approveData.rows.map(v => v.a_id) : [];
                console.log("已审批列表", arr);
                let repeatArr = order_approves.filter(v => !arr.includes(v));
                console.log("去重", repeatArr);
                if (repeatArr.length == 0) { //所有人都审批完成，可以修改状态为已通过
                    await orderModule.approveOrder(info);
                }
            }

            //订单维度的订单流程记录
            await orderReportModule.orderFlowReport({
                order_id: info.id,
                order_type: 1,
                operate_type: info.type == 1 ? 3 : 2, //info.type 1驳回 2通过  operate_type 2通过 3驳回
                admin_id: res.locals.admin_id
            });

            await logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.APPROVE, operationType.ORDERAPPROVELIST + " 订单审批ID:" + info.id);
            await logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.APPROVE, operationType.ORDERLIST + " 订单审批ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("审核订单操作异常:" + e.message));
        }
    },

    //用户点击审批弹框时检测当前用户是否已经审批过了,审批过的不再审批,未审批过的查看是否轮到自己审批
    //(传入的订单id必定是当前登陆人在审批列表里的，因为列表接口已经判断过)
    checkApprove: async (req, res) => {
        try {
            let info = req.query;
            info.admin_id = res.locals.admin_id;
            let orderData = await orderModule.getOrderById(info);
            if (orderData.rows.length == 0) return res.send(util.ErrorResponse("该订单不存在"));
            let data = await orderModule.getAdminByApprove(info);

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

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.ORDERLIST + " 查验订单审批权限: " + info.id);
            res.send(util.SuccessResponse({ ...resData, msg: resData.isApprove == 1 ? "可以审批" : "不可审批" }));
        } catch (e) {
            return res.send(util.ErrorResponse("查看订单审批权限异常:" + e.message));
        }
    },

    //订单审核记录
    getApprovelist: async (req, res) => {
        try {
            let info = req.query;
            info.admin_id = res.locals.admin_id;

            //先获取订单数据再获取审核流程
            let orderData = await orderModule.getOrderById(info);
            if (orderData.rows.length == 0) return res.send(util.ErrorResponse("该订单不存在,无法查找审批记录"));
            info.users = orderData.rows[0].approve_user;

            let data = await orderModule.getApproveOrderList(info);
            let arr = info.users.split(",");
            let resData = [];
            for (let i = 0; i < arr.length; i++) {
                let temp = data.rows.filter(item => item.user_id == arr[i]);
                resData.push(temp[0]);
            }

            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.ORDERAPPROVELIST);
            res.send(util.SuccessResponse({ list: resData }));
        } catch (e) {
            res.send(util.ErrorResponse("获取订单审核记录操作异常:" + e.message));
        }
    },

    //订单流程记录
    getOrderFlowRecordList: async (req, res) => {
        try {
            let info = req.query;
            info.admin_id = res.locals.admin_id;
            let data = await orderReportModule.getOrderFlowRecordList(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.ORDERFLOWLIST);
            res.send(util.SuccessResponse({ list: data.rows }));
        } catch (e) {
            res.send(util.ErrorResponse("获取订单流程记录操作异常:" + e.message));
        }
    }
};
