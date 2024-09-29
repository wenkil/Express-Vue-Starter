module.exports = {
    info: {
        host: "localhost",
        user: "root",
        password: "123456",
        database: "backendDB",
        port: 3306
    },

    /**
     * 数据库表名
     */
    configureName: {
        ADMINUSER: "admin_user",
        OPERATION_LOG: "operation_log",
        ROLE: "admin_role",

        CRM_CLUE: "crm_clue",
        CRM_CLUESOURCE: "crm_clue_source",
        CRM_USER_LIST: "crm_user_list",
        CRM_CONTACT: "contact_list",
        CRM_FOLLOW_UP: "follow_up_list",
        DEPARTMENT: "department",
        STAFF: "staff",
        GOODS_LIST: "goods_list",
        GOODS_CLASS: "goods_class",
        GOODS_BRANCH: "goods_branch",
        GOODS_TYPE: "goods_type",
        GOODS_TYPE_NAME: "goods_type_name",

        ORDERLIST:'orderlist',
        ORDER_APPROVE:'order_approve',
        ORDE_FLOW_RECORD:'order_flow_record',

        BACKMONEYLIST: 'back_money_list',
        BACKMONEY_APPROVE: 'back_money_approve',
    }
};
