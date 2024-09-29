var sqlPool = require("../../DB/sqlPool");
var moment = require("moment");
const utils = require("../../utils/utils");
const sqlConfig = require("../../DB/sqlConfig");
const ORDER_APPROVE = sqlConfig.configureName.ORDER_APPROVE;
const BACKMONEY_APPROVE = sqlConfig.configureName.BACKMONEY_APPROVE;
const ORDE_FLOW_RECORD = sqlConfig.configureName.ORDE_FLOW_RECORD;
const ORDER_FLOW_LIST = sqlConfig.configureName.ORDE_FLOW_RECORD;
const orderTable = sqlConfig.configureName.ORDERLIST;

module.exports = {
    //新增订单的审批记录
    approveOrderReport: async (info) => {
        let create_time = moment().format("x");
        let sql = `insert into ${ORDER_APPROVE} (order_id,approve_user,create_time) values `;
        sql += `(${info.order_id},${info.approve_user},${create_time})`;
        return sqlPool.queryData(sql);
    },

    //驳回订单时删除审批记录
    deleteOrderApproveReport: async (info) => {
        let sql = `DELETE FROM ${ORDER_APPROVE} WHERE order_id = ?`;
        return sqlPool.queryData(sql, [info.id]);
    },

    //新增回款审批记录
    approveBackmoney: async (info) => {
        let create_time = moment().format("x");
        let sql = `insert into ${BACKMONEY_APPROVE} (back_money_id,approve_user,create_time) values `;
        sql += `(${info.id},${info.approve_user},${create_time})`;
        return sqlPool.queryData(sql);
    },
    //驳回回款时删除审批记录
    deleteBackMoneyApproveReport: async (info) => {
        let sql = `DELETE FROM ${BACKMONEY_APPROVE} WHERE back_money_id = ?`;
        return sqlPool.queryData(sql, [info.id]);
    },

    //新增订单、回款、退款维度的记录: 创建、审批、驳回、回款退回、取消订单、、、
    orderFlowReport: async (info) => {
        let create_time = moment().format("x");
        let param = 'order_id,order_type,operate_type,admin_id,create_time'
        let values = `${info.order_id},${info.order_type},${info.operate_type},${info.admin_id},${create_time}`
        if(info.descr){
            param += ',descr'
            values += `,'${info.descr}'`
        }
        let sql = `insert into ${ORDE_FLOW_RECORD} (${param}) values (${values})`;
        return sqlPool.queryData(sql);
    },

    //获取订单流程记录列表
    getOrderFlowRecordList: async (info) => {
        let sql = `SELECT f.*, a.name as approve_user_name FROM ${ORDER_FLOW_LIST} f `;
        sql += `LEFT JOIN ${sqlConfig.configureName.ADMINUSER} a ON f.admin_id = a.user_id `;
        sql += `WHERE f.order_id = ?  ORDER BY f.create_time ASC`;
        return sqlPool.queryData(sql, [info.id]);
    },
};
