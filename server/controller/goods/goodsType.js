const util = require("../../utils/utils");
var logMoudle = require("../../api/operateLog");
var operationType = require("../../utils/operationType");
const goodsModule = require("../../moudle/goods/goodsType");

module.exports = {
    getGoodsTypeList: async (req, res) => {
        try {
            let info = req.query;
            if (Number(info.type) > 1 && !info.pid) return res.send(util.ErrorResponse("pid must be required"));
            info.admin_id = res.locals.admin_id;
            let data = await goodsModule.list(info);
            let resData = { list: data.rows };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.GOODS_TYPE);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取产品分类异常:" + e.message));
        }
    },

    addGoodsType: async (req, res) => {
        try {
            let info = req.body;
            if (Number(info.type) > 1 && !info.pid) return res.send(util.ErrorResponse("pid must be required"));
            info.admin_id = res.locals.admin_id;

            //检测同名
            let checkNameData = await goodsModule.checkSameGoodsName(info);
            if (checkNameData.rows.length) return res.send(util.ErrorResponse("该层级下已有同名类型"));

            let data = await goodsModule.add(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.ADD, operationType.GOODS_TYPE + " ID:" + data.rows.insertId);
            res.send(util.SuccessResponse({ id: data.rows.insertId }));
        } catch (e) {
            res.send(util.ErrorResponse("新增产品分类异常:" + e.message));
        }
    },

    updateGoodsType: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;

            //检测id
            let checkId = await goodsModule.checkGoodsByid(info);
            if (!checkId.rows.length) return res.send(util.ErrorResponse("该数据不存在或已被删除"));

            //检测同名
            let checkNameData = await goodsModule.checkSameGoodsName(info);
            if (checkNameData.rows.length) return res.send(util.ErrorResponse("该层级下已有同名类型"));

            await goodsModule.update(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.UPDATE, operationType.GOODS_TYPE + " ID:" + info.id);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("编辑产品分类异常:" + e.message));
        }
    },

    delGoodsType: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            //检测id
            let checkId = await goodsModule.checkGoodsByid(info);
            if (!checkId.rows.length) return res.send(util.ErrorResponse("该数据不存在或已被删除"));

            if (info.type < 4) { //如果层级小于4的,检查该层级是否有下级尚未删除
                let checkLevelTree = await goodsModule.checkGoodsByPid({ type: info.type + 1, pid: info.id });
                if (checkLevelTree.rows.length > 0) return res.send(util.ErrorResponse("该层级下还有子级未删除,请先删除子级数据"));
            }

            await goodsModule.delete(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.DELETE, operationType.GOODS_TYPE + " ID: " + info.id + " 名字: " + info.name);
            res.send(util.SuccessResponse({}));
        } catch (e) {
            res.send(util.ErrorResponse("删除产品分类异常:" + e.message));
        }
    },

    getGoodsListByLevel: async (req, res) => {
        try {
            let info = req.query;
            let data;
            if (info.type) {  //传了type就走模糊搜索或id搜索,不传就是全部四级列表
                if (Number(info.type) == 1 && !info.id) return res.send(util.ErrorResponse("产品id不得为空"));
                if (Number(info.type) == 2 && !info.name) return res.send(util.ErrorResponse("产品名称不得为空"));
                data = await goodsModule.levelListById(info);
            }
            else {
                data = await goodsModule.levelList(info);
            }

            let resData = {
                list: data.rows.filter(item => {
                    return item.type_name_id && item.type_name_name;
                })
            };
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.GOODS_TYPE);
            res.send(util.SuccessResponse(resData));
        } catch (e) {
            return res.send(util.ErrorResponse("获取产品分类异常:" + e.message));
        }
    },

    checkGoodsTypeRelevance: async (req, res) => {
        try {
            let info = req.body;
            info.admin_id = res.locals.admin_id;
            let data = await goodsModule.checkGoodsTypeRelevance(info);
            logMoudle.setUserOperationLog(req, res, util.OPERATION_TYPE.QUERY, operationType.GOODS_TYPE);
            res.send(util.SuccessResponse({ list: data.rows }));
        } catch (e) {
            return res.send(util.ErrorResponse("获取产品分类异常:" + e.message));
        }
    }

};
