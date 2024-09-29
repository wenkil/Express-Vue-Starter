const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const goodsListModule = require("../../moudle/goods/goodslist");

module.exports = {
    getGoodsList: async (req, res) => {
        try {
            let info = req.query;
            info.admin_id = res.locals.admin_id;
            let data = await goodsListModule.list(info);
            let count = await goodsListModule.count(info);
            let resData = { list: data.rows, count: count.rows[0].count };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.GOODS_LIST);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取产品列表异常:" + e.message));
        }
    },

    addGoodsList: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;

            //检测同名
            let checkNameData = await goodsListModule.checkSameGoodsName(info);
            if (checkNameData.rows.length) return res.send(util.ErrorResponse("已存在同名产品"));

            let data = await goodsListModule.add(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.GOODS_LIST + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse());
        } catch (e) {
            res.send(util.ErrorResponse("新增产品异常:" + e.message));
        }
    },

    editGoodsList: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            if(info.type == 2 && !info.goods_status) return res.send(util.ErrorResponse("参数错误"));
            await goodsListModule.update(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.GOODS_LIST + " ID:" + info.goods_type_id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("更新产品数据异常:" + e.message));
        }
    },


};
