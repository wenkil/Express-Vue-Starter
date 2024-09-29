const { Joi } = require("express-validation");

module.exports = {
    loginParam: {
        body: Joi.object({
            name: Joi.string().required(),
            password: Joi.string().required()
        })
    },
    changePwdParam: {
        body: Joi.object({
            old_password: Joi.string().required(),
            new_password: Joi.string().required()
        })
    },
    systemUserList: {
        query: Joi.object({
            name: Joi.string().allow(""),
            type: Joi.number().allow(""),
            listType: Joi.number().allow(""),
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    systemAddUser: {
        body: Joi.object({
            name: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.number().required(),
            superior: Joi.number().allow("")
        })
    },
    systemUpdateUser: {
        body: Joi.object({
            user_id: Joi.number().required(),
            name: Joi.string().required(),
            role_id: Joi.number().required(),
            superior: Joi.number().allow("")
        })
    },
    systemDeleteUser: {
        body: Joi.object({
            user_id: Joi.number().required(),
            type: Joi.number().required()
        })
    },
    systemUserOperateList: {
        query: Joi.object({
            type: Joi.number().allow(""),
            start_time: Joi.number().allow(""),
            end_time: Joi.number().allow(""),
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    systemRoleList: {
        query: Joi.object({
            id: Joi.number().allow(""),
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    systemAddRole: {
        body: Joi.object({
            name: Joi.string().required(),
            menulist: Joi.string().required()
        })
    },
    systemUpdateRole: {
        body: Joi.object({
            name: Joi.string().required(),
            role_id: Joi.number().required(),
            menulist: Joi.string().required()
        })
    },
    getClueSourceList: {
        query: Joi.object({
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    addClueSource: {
        body: Joi.object({
            source_name: Joi.string().required()
        })
    },
    updateClueSource: {
        body: Joi.object({
            id: Joi.number().required(),
            source_name: Joi.string().required()
        })
    },
    getClueList: {
        query: Joi.object({
            isCharge: Joi.string().allow(""),
            clue_name: Joi.string().allow(""),
            clue_phone: Joi.string().allow(""),
            source_id: Joi.number().allow(""),
            cus_level: Joi.number().allow(""),
            next_contact_time_start: Joi.number().allow(""),
            next_contact_time_end: Joi.number().allow(""),

            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    addClue: {
        body: Joi.object({
            clue_name: Joi.string().required(),
            clue_phone: Joi.string().required(),
            source_id: Joi.number().required(),
            cus_trade: Joi.number().required(),
            cus_level: Joi.number().required(),
            next_contact_time: Joi.number().required(),
            clue_address: Joi.string().required(),
            clue_mail: Joi.string().allow(""),
            remark: Joi.string().allow("")
        })
    },
    updateClue: {
        body: Joi.object({
            id: Joi.number().required(),
            clue_name: Joi.string().required(),
            clue_phone: Joi.string().required(),
            source_id: Joi.number().required(),
            cus_trade: Joi.number().required(),
            cus_level: Joi.number().required(),
            next_contact_time: Joi.number().required(),
            clue_address: Joi.string().required(),
            clue_mail: Joi.string().allow(""),
            remark: Joi.string().allow("")
        })
    },
    allotClue: {
        body: Joi.object({
            user_id: Joi.number().required(),
            clue_list: Joi.string().required()
        })
    },
    allotClueSingle: {
        body: Joi.object({
            id: Joi.number().required(),
            user_id: Joi.number().required()
        })
    },
    divertClue: {
        body: Joi.object({
            clue_list: Joi.string().required()
        })
    },

    getCrmUserList: {
        query: Joi.object({
            crm_list_type: Joi.number().required(),
            crm_user_name: Joi.string().allow(""),
            crm_user_phone: Joi.string().allow(""),
            source_id: Joi.number().allow(""),
            id: Joi.number().allow(""),
            crm_user_level: Joi.number().allow(""),

            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    addCrmUser: {
        body: Joi.object({
            crm_user_name: Joi.string().required(),
            crm_user_phone: Joi.string().required(),
            source_id: Joi.number().required(),
            crm_user_trade: Joi.number().required(),
            crm_user_level: Joi.number().required(),
            crm_user_address: Joi.string().required(),
            crm_user_mail: Joi.string().allow(""),
            remark: Joi.string().allow("")
        })
    },
    updateCrmUser: {
        body: Joi.object({
            id: Joi.number().required(),
            crm_user_name: Joi.string().required(),
            crm_user_phone: Joi.string().required(),
            source_id: Joi.number().required(),
            crm_user_trade: Joi.number().required(),
            crm_user_level: Joi.number().required(),
            crm_user_address: Joi.string().required(),
            crm_user_mail: Joi.string().allow(""),
            remark: Joi.string().allow("")
        })
    },
    allotCrmUser: {
        body: Joi.object({
            id: Joi.number().required(),
            user_id: Joi.number().required()
        })
    },
    addDep: {
        body: Joi.object({
            name: Joi.string().required(),
            type: Joi.number().required(),
            pid: Joi.number().allow()
        })
    },
    updateDep: {
        body: Joi.object({
            name: Joi.string().required(),
            id: Joi.number().required()
        })
    },
    deleteDep: {
        body: Joi.object({
            id: Joi.number().required()
        })
    },
    getStaffList: {
        query: Joi.object({
            name: Joi.string().allow(""),
            entry_date_start: Joi.number().allow(""),
            entry_date_end: Joi.number().allow(""),

            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    addStaff: {
        body: Joi.object({
            id: Joi.number().optional(),
            name: Joi.string().required(),
            depart_id: Joi.string().required(),
            phone: Joi.string().required(),
            mail: Joi.string().allow(""),
            contact_way: Joi.string().allow(""),
            paper_type: Joi.number().required(),
            paper_data: Joi.string().required(),
            gender: Joi.number().required(),
            birthday: Joi.number().allow(""),
            is_married: Joi.number().optional(),
            is_birth: Joi.number().optional(),
            politics_status: Joi.string().allow(""),
            native_place: Joi.string().required(),
            native_location: Joi.string().required(),
            education: Joi.string().allow(""),
            current_address: Joi.string().allow(""),
            emergency_contact: Joi.string().required(),
            emergency_contact_phone: Joi.string().required(),
            probation_start_date: Joi.number().required(),
            probation_end_date: Joi.number().required(),
            entry_date: Joi.number().required(),
            remark: Joi.string().allow("")
        })
    },
    dismissStaff: {
        body: Joi.object({
            id: Joi.number().required(),
            dimiss_date: Joi.number().required(),
            reason: Joi.string().required()
        })
    },

    getCrmContactList: {
        query: Joi.object({
            crm_user_id: Joi.string().allow(""),
            contact_name: Joi.string().allow(""),
            contact_phone: Joi.string().allow(""),
            next_contact_time_start: Joi.number().allow(""),
            next_contact_time_end: Joi.number().allow(""),

            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    addCrmContactList: {
        body: Joi.object({
            crm_user_id: Joi.number().required(),
            contact_name: Joi.string().required(),
            contact_gender: Joi.number().required(),
            contact_phone: Joi.string().required(),
            contact_mail: Joi.string().allow(""),
            decision_type: Joi.number().required(),
            contact_address: Joi.string().allow(),
            next_contact_time: Joi.number().required(),
            remark: Joi.string().allow("")
        })
    },
    updateCrmContactList: {
        body: Joi.object({
            contact_id: Joi.number().required(),
            crm_user_id: Joi.number().required(),
            contact_name: Joi.string().required(),
            contact_gender: Joi.number().required(),
            contact_phone: Joi.number().required(),
            contact_mail: Joi.string().allow(""),
            decision_type: Joi.number().required(),
            contact_address: Joi.string().allow(),
            next_contact_time: Joi.number().required(),
            remark: Joi.string().allow("")
        })
    },
    getFollowRecordList: {
        query: Joi.object({
            crm_user_id: Joi.string().allow(""),
            next_contact_time_start: Joi.number().allow(""),
            next_contact_time_end: Joi.number().allow(""),

            type: Joi.number().required(),
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    addFollowRecord: {
        body: Joi.object({
            follow_time: Joi.number().required(),
            follow_type: Joi.number().required(),
            // follow_user_id:Joi.number().required(),
            crm_user_id: Joi.number().required(),
            crm_contact_id: Joi.number().required(),
            follow_record: Joi.string().required(),
            next_contact_time: Joi.number().required(),
            remark: Joi.string().allow("")
        })
    },

    getCrmAnalyse: {
        query: Joi.object({
            start_time: Joi.number().required(),
            end_time: Joi.number().required()
        })
    },
    getGoodsTypeList: {
        query: Joi.object({
            type: Joi.number().required(),
            pid: Joi.number().optional()
        })
    },
    getGoodsLevelList: {
        query: Joi.object({
            type: Joi.number().optional(),
            id: Joi.number().optional(),
            name: Joi.string().optional()
        })
    },
    addGoodsType: {
        body: Joi.object({
            type: Joi.number().required(),
            pid: Joi.number().optional(),
            name: Joi.string().required()
        })
    },
    editGoodsType: {
        body: Joi.object({
            type: Joi.number().required(),
            id: Joi.number().required(),
            name: Joi.string().required()
        })
    },
    deleteGoodsType: {
        body: Joi.object({
            type: Joi.number().required(),
            id: Joi.number().required()
        })
    },
    checkGoodsTypeRelevance: {
        body: Joi.object({
            id: Joi.number().required()
        })
    },
    getGoodsList: {
        query: Joi.object({
            goods_name: Joi.string().optional(),
            goods_type_id: Joi.number().optional(),
            goods_status: Joi.number().optional(),

            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    addGoodsList: {
        body: Joi.object({
            goods_name: Joi.string().required(),
            goods_type_id: Joi.number().required(),
            goods_price: Joi.number().required(),
            goods_intro: Joi.string().allow(""),
            remark: Joi.string().allow("")
        })
    },
    editGoodsList: {
        body: Joi.object({
            type: Joi.number().required(),
            goods_id: Joi.number().required(),
            goods_status: Joi.number().optional(),
            goods_intro: Joi.string().allow(""),
            remark: Joi.string().allow("")
        })
    },

    getOrderList: {
        query: Joi.object({
            id: Joi.number().optional(),
            crm_user_id: Joi.number().optional(),
            related: Joi.number().required(),
            order_cycle: Joi.number().required(),
            approve_status: Joi.number().optional(),
            effect_status: Joi.number().optional(),

            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    },
    getApprovelist: {
        query: Joi.object({
            id: Joi.number().required()
        })
    },
    getCheckApprove: {
        query: Joi.object({
            id: Joi.number().required()
        })
    },
    getOrderIdByPost: {
        body: Joi.object({
            id: Joi.number().required()
        })
    },
    addOrderList: {
        body: Joi.object({
            order_name: Joi.string().required(),
            order_type: Joi.number().required(),
            order_number: Joi.string().required(),
            crm_user_id: Joi.number().required(),
            crm_contact_id: Joi.number().required(),
            contract_date: Joi.number().required(),
            goods_id: Joi.number().required(),
            goods_cnt: Joi.number().required(),
            discount: Joi.number().required(),
            actual_amount: Joi.number().required(),
            approve_user: Joi.string().required(),
            reject_reason: Joi.string().allow(""),
            remark: Joi.string().allow("")
        })
    },
    editOrderList: {
        body: Joi.object({
            id: Joi.number().required(),

            order_name: Joi.string().required(),
            order_type: Joi.number().required(),
            order_number: Joi.string().required(),
            crm_user_id: Joi.number().required(),
            crm_contact_id: Joi.number().required(),
            contract_date: Joi.number().required(),
            goods_id: Joi.number().required(),
            goods_cnt: Joi.number().required(),
            discount: Joi.number().required(),
            actual_amount: Joi.number().required(),
            approve_user: Joi.string().required(),
            reject_reason: Joi.string().allow(""),
            remark: Joi.string().allow("")
        })
    },
    approveOrderParam: {
        body: Joi.object({
            id: Joi.number().required(),
            type: Joi.number().required(),
            reject_reason: Joi.string().allow("")
        })
    },
    addBackMoney: {
        body: Joi.object({
            crm_user_id: Joi.number().required(),
            order_id: Joi.number().required(),
            collect_date: Joi.number().required(),
            collect_amount: Joi.number().required(),
            collect_type: Joi.number().required(),
            approve_user: Joi.string().required(),
            remark: Joi.string().allow("")
        })
    },
    editBackMoney: {
        body: Joi.object({
            id: Joi.number().required(),

            // crm_user_id: Joi.number().required(),
            // order_id: Joi.number().required(),
            collect_date: Joi.number().required(),
            collect_amount: Joi.number().required(),
            collect_type: Joi.number().required(),
            approve_user: Joi.string().required(),
            remark: Joi.string().allow("")
        })
    },
    getBackMoneyList: {
        query: Joi.object({
            id: Joi.number().optional(),
            collect_cycle: Joi.number().optional(),
            order_id: Joi.number().optional(),
            crm_user_id: Joi.number().optional(),
            related: Joi.number().required(),

            page: Joi.number().min(1).required(),
            limit: Joi.number().min(10).required()
        })
    }
};
