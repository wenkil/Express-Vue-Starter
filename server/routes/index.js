var express = require("express");
const { validate } = require("express-validation");
var router = express.Router();

const validations = require("./validations");

var operationLog = require("../controller/system/operationLog");
var login = require("../controller/login");
var systemUser = require("../controller/system/user");
var systemRole = require("../controller/system/role");
var clueSourceController = require("../controller/crm/clue_source");
var clueController = require("../controller/crm/clue");
var crmUserController = require("../controller/crm/crm_user_list");
var contactController = require("../controller/crm/contact");
var followUpController = require("../controller/crm/follow_up_controller");
var departmentController = require("../controller/oa/department");
var staffController = require("../controller/oa/staff");
var goodsTypeController = require("../controller/goods/goodsType");
var goodsListController = require("../controller/goods/goodsList");
var orderListController = require("../controller/order/order");
var backMoneyController = require("../controller/order/backMoney");

/*   系统相关   */
router.get("/api/user/info", systemUser.getUserInfo);//后台用户信息
router.post("/api/login", validate(validations.loginParam), login.login);//用户登录
router.post("/api/user/changpwd", validate(validations.changePwdParam), systemUser.changePassword);
router.get("/api/user/list", validate(validations.systemUserList), systemUser.getUserList);//后台用户列表
router.post("/api/user/add", validate(validations.systemAddUser), systemUser.addUser);//新增后台用户
router.post("/api/user/update", validate(validations.systemUpdateUser), systemUser.updateUser);//编辑后台用户
router.post("/api/user/status", validate(validations.systemDeleteUser), systemUser.deleteUser);//禁用启用后台用户
router.get("/api/user/operate/list", validate(validations.systemUserOperateList), operationLog.getSystemUserLogsList);//后台用户操作日志
router.get("/api/user/role/list", validate(validations.systemRoleList), systemRole.getRoleList);//权限列表
router.post("/api/user/role/add", validate(validations.systemAddRole), systemRole.addRole);//新增权限
router.post("/api/user/role/update", validate(validations.systemUpdateRole), systemRole.updateRole);//修改权限

router.get("/api/department/list", departmentController.getDepList);//部门列表
router.post("/api/department/add", validate(validations.addDep), departmentController.addDep);//新增部门
router.post("/api/department/update", validate(validations.updateDep), departmentController.updateDep);//编辑部门
router.post("/api/department/delete", validate(validations.deleteDep), departmentController.deleteDep);//删除部门
router.get("/api/staff/list", validate(validations.getStaffList), staffController.getStaffList);//员工列表
router.post("/api/staff/add", validate(validations.addStaff), staffController.addStaff);//新增员工
router.post("/api/staff/edit", validate(validations.addStaff), staffController.editStaff);//编辑员工
router.post("/api/staff/dismiss", validate(validations.dismissStaff), staffController.dismissStaff);//员工离职

/*   CRM相关   */
router.get("/api/crm/clueSource/list", validate(validations.getClueSourceList), clueSourceController.getClueSource);//线索来源列表
router.post("/api/crm/clueSource/add", validate(validations.addClueSource), clueSourceController.addClueSource);//新增线索来源
router.post("/api/crm/clueSource/update", validate(validations.updateClueSource), clueSourceController.updateClueSource);//新增线索来源
router.get("/api/crm/clue/list", validate(validations.getClueList), clueController.getClueList);//线索列表
router.post("/api/crm/clue/add", validate(validations.addClue), clueController.addClue);//新增线索
router.post("/api/crm/clue/update", validate(validations.updateClue), clueController.updateClue);//更新线索
router.post("/api/crm/clue/allot/single", validate(validations.allotClueSingle), clueController.allotClueSingle);//(单个)线索分配责任人
router.post("/api/crm/clue/allot", validate(validations.allotClue), clueController.allotClue);//(批量)线索分配责任人
router.post("/api/crm/clue/divert", validate(validations.divertClue), clueController.divertCustom);//(批量)线索转客户

router.get("/api/crm/user/list", validate(validations.getCrmUserList), crmUserController.getCrmUserList);//客户列表
router.post("/api/crm/user/add", validate(validations.addCrmUser), crmUserController.addCrmUser);//新增客户
router.post("/api/crm/user/update", validate(validations.updateCrmUser), crmUserController.updateCrmUser);//编辑客户
router.post("/api/crm/user/allot", validate(validations.allotCrmUser), crmUserController.allotCrmUserInfo);//(单个)分配客户负责人
router.get("/api/export/crmuser", validate(validations.getCrmUserList), crmUserController.export);//导出客户列表

router.get("/api/crm/contact/list", validate(validations.getCrmContactList), contactController.getList);//联系人列表
router.post("/api/crm/contact/add", validate(validations.addCrmContactList), contactController.addContact);//新建联系人
router.post("/api/crm/contact/update", validate(validations.updateCrmContactList), contactController.updateContact);//编辑联系人

router.get("/api/crm/followrecord/list", validate(validations.getFollowRecordList), followUpController.getFollowRecord);//跟进记录
router.post("/api/crm/followrecord/add", validate(validations.addFollowRecord), followUpController.addFollowRecord);//新建跟进记录

/*  客户分析  */
router.get("/api/crm/analyse/source", validate(validations.getCrmAnalyse), crmUserController.getCrmSourceAnalyse);//客户来源分析
router.get("/api/crm/analyse/level", validate(validations.getCrmAnalyse), crmUserController.getCrmLevelAnalyse);//客户等级分析
router.get("/api/crm/analyse/trade", validate(validations.getCrmAnalyse), crmUserController.getCrmTradeAnalyse);//客户行业分析

/*  产品  */
router.get("/api/goods/type/list", validate(validations.getGoodsTypeList), goodsTypeController.getGoodsTypeList);//产品分类列表
router.get("/api/goods/type/allLevelList", validate(validations.getGoodsLevelList), goodsTypeController.getGoodsListByLevel);//模糊搜索产品层级表(四层)
router.post("/api/goods/type/add", validate(validations.addGoodsType), goodsTypeController.addGoodsType);//新增产品分类
router.post("/api/goods/type/edit", validate(validations.editGoodsType), goodsTypeController.updateGoodsType);//编辑产品分类
router.post("/api/goods/type/delete", validate(validations.deleteGoodsType), goodsTypeController.delGoodsType);//删除产品分类
router.post("/api/goods/type/checkrelevance", validate(validations.checkGoodsTypeRelevance), goodsTypeController.checkGoodsTypeRelevance);//删除产品分类

router.get("/api/goods/list", validate(validations.getGoodsList), goodsListController.getGoodsList);//产品列表
router.post("/api/goods/add", validate(validations.addGoodsList), goodsListController.addGoodsList);//新建产品
router.post("/api/goods/edit", validate(validations.editGoodsList), goodsListController.editGoodsList);//编辑产品

/* 订单 */
router.get("/api/order/list", validate(validations.getOrderList), orderListController.getList);//订单列表
router.get("/api/order/list/approvelist", validate(validations.getApprovelist), orderListController.getApprovelist);//订单审核记录
router.get("/api/order/list/orderflowlist", validate(validations.getApprovelist), orderListController.getOrderFlowRecordList);//订单流程记录
router.get("/api/order/checkApprove", validate(validations.getCheckApprove), orderListController.checkApprove);//检查当前用户是否轮到审批
router.post("/api/order/add", validate(validations.addOrderList), orderListController.add);//新建订单
router.post("/api/order/edit", validate(validations.editOrderList), orderListController.edit);//编辑订单
router.post("/api/order/cancel", validate(validations.getOrderIdByPost), orderListController.cancel);//取消订单
router.post("/api/order/approve", validate(validations.approveOrderParam), orderListController.approveOrder);//审批订单

/* 回款 */
router.get("/api/backmoney/list", validate(validations.getBackMoneyList), backMoneyController.getList);//回款列表
router.post("/api/backmoney/add", validate(validations.addBackMoney), backMoneyController.add);//新建回款
router.post("/api/backmoney/edit", validate(validations.editBackMoney), backMoneyController.edit);//编辑回款
router.get("/api/backmoney/checkApprove", validate(validations.getCheckApprove), backMoneyController.checkApprove);//检查当前用户是否轮到审批
router.get("/api/backmoney/list/approvelist", validate(validations.getApprovelist), backMoneyController.getApprovelist);//回款审核记录
router.post("/api/backmoney/list/approvelist", validate(validations.approveOrderParam), backMoneyController.approveOrder);//审批回款
router.post("/api/backmoney/cancel", validate(validations.getOrderIdByPost), backMoneyController.cancel);//取消回款

module.exports = router;
