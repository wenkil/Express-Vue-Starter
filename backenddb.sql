/*
 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : localhost:3306
 Source Schema         : backenddb

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin_role
-- ----------------------------
DROP TABLE IF EXISTS `admin_role`;
CREATE TABLE `admin_role`  (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `role_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '角色名',
  `menulist` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '菜单列表',
  `creat_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`role_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin_role
-- ----------------------------
INSERT INTO `admin_role` VALUES (1, '超级管理员', '999,1011,1013,1012,2011,2012,2013,2014,3011,3012,4011,4012,5011,5012,6001,6002', '2021-06-07 16:16:51', '2021-06-24 11:52:32');
INSERT INTO `admin_role` VALUES (2, '级别1', '999,1011,1013,1012,2011,2012,2013,2014,3011,3012,4011,4012,5011,5012,6001,6002', '2021-06-07 16:16:51', '2021-09-27 11:36:35');
INSERT INTO `admin_role` VALUES (3, '级别2', '999,1011,1013,1012,2011,2012,2013,2014,3011,3012,4011,4012,5011,5012,6001,6002', '2021-06-07 16:17:05', '2021-09-27 11:36:38');
INSERT INTO `admin_role` VALUES (4, '级别3', '999,1011,1013,1012,2011,2012,2013,2014,3011,3012,4011,4012,5011,5012,6001,6002', '2021-06-10 15:11:01', '2021-09-27 11:36:43');
INSERT INTO `admin_role` VALUES (7, '级别4', '999,2011,2012,2013,2014,5011,5012,6001,6002', '2021-06-10 15:21:14', '2021-09-27 11:37:15');
INSERT INTO `admin_role` VALUES (9, '级别5', '999,2011,2012,2013,2014,5011,5012,6001,6002', '2021-06-17 16:54:10', '2021-09-27 11:36:57');

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user`  (
  `user_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `user_status` int(255) NULL DEFAULT NULL COMMENT '用户状态 1启用 2 禁用',
  `salt` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密钥',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录密码',
  `token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT 'token',
  `role_id` int(255) NULL DEFAULT NULL COMMENT '角色id',
  `superior` int(11) NULL DEFAULT NULL COMMENT '直属上级',
  `creat_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin_user
-- ----------------------------
INSERT INTO `admin_user` VALUES (1, 'root', 1, '16002edfc2541f12', '2ab6aff99c60d5c8f419dfe56178086a6cdbe6332e31afdcce434a9166cb4bb03881b3e3c171ad9783f40293d00c37be00612bccbea199c43e44ff6592dbdfe6', '5f132544a85ab2aa4afd085da10d8dce', 1, NULL, '2024-09-19 11:01:43', NULL);

-- ----------------------------
-- Table structure for back_money_approve
-- ----------------------------
DROP TABLE IF EXISTS `back_money_approve`;
CREATE TABLE `back_money_approve`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `back_money_id` int(11) NULL DEFAULT NULL COMMENT '回款id',
  `approve_user` int(11) NULL DEFAULT NULL COMMENT '审批人id',
  `create_time` bigint(20) NULL DEFAULT NULL COMMENT '审批时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of back_money_approve
-- ----------------------------

-- ----------------------------
-- Table structure for back_money_list
-- ----------------------------
DROP TABLE IF EXISTS `back_money_list`;
CREATE TABLE `back_money_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crm_user_id` int(20) NULL DEFAULT NULL COMMENT '客户id',
  `order_id` int(20) NULL DEFAULT NULL COMMENT '订单id',
  `collect_cycle` int(11) NULL DEFAULT NULL COMMENT '回款生命周期: 1未取消,2已取消(已删除)',
  `approve_status` int(11) NULL DEFAULT NULL COMMENT '回款审批状态: 待审批,已驳回,已通过',
  `collect_date` bigint(20) NULL DEFAULT NULL COMMENT '回款日期',
  `collect_amount` int(20) NULL DEFAULT NULL COMMENT '回款金额',
  `collect_type` int(11) NULL DEFAULT NULL COMMENT '回款方式',
  `approve_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审批人',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `reject_reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '驳回原因',
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '创建人',
  `create_time` bigint(20) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of back_money_list
-- ----------------------------

-- ----------------------------
-- Table structure for contact_list
-- ----------------------------
DROP TABLE IF EXISTS `contact_list`;
CREATE TABLE `contact_list`  (
  `contact_id` int(11) NOT NULL AUTO_INCREMENT,
  `crm_user_id` int(11) NULL DEFAULT NULL COMMENT '客户id',
  `contact_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系人姓名',
  `contact_gender` int(11) NULL DEFAULT NULL COMMENT '联系人性别 1男 2女',
  `contact_phone` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系人手机',
  `contact_mail` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系人邮箱',
  `decision_type` int(11) NULL DEFAULT NULL COMMENT '是否决策人 1是 2否',
  `charge_user_id` int(11) NULL DEFAULT NULL COMMENT '负责人',
  `contact_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系人地址',
  `next_contact_time` bigint(20) NULL DEFAULT NULL COMMENT '下次联系时间',
  `record_cnt` int(11) NULL DEFAULT NULL COMMENT '跟进记录数量',
  `remark` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `creat_time` bigint(20) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) NULL DEFAULT NULL COMMENT '更新时间',
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '最后操作人',
  `creat_admin_id` int(11) NULL DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`contact_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of contact_list
-- ----------------------------

-- ----------------------------
-- Table structure for crm_clue
-- ----------------------------
DROP TABLE IF EXISTS `crm_clue`;
CREATE TABLE `crm_clue`  (
  `clue_id` int(11) NOT NULL AUTO_INCREMENT,
  `clue_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '线索名称',
  `source_id` int(11) NULL DEFAULT NULL COMMENT '来源id',
  `clue_mail` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '邮箱',
  `clue_phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '手机号',
  `clue_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '地址',
  `cus_trade` int(11) NULL DEFAULT NULL COMMENT '客户行业',
  `cus_level` int(11) NULL DEFAULT NULL COMMENT '客户等级',
  `charge_user_id` int(11) NULL DEFAULT NULL COMMENT '负责人id',
  `next_contact_time` bigint(255) NULL DEFAULT NULL COMMENT '下次联系时间',
  `clue_type` int(11) NULL DEFAULT NULL COMMENT '线索状态： 1未转化 2已转化为客户 ',
  `remark` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `creat_time` bigint(20) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) NULL DEFAULT NULL COMMENT '更新时间',
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '最后操作人',
  `creat_admin_id` int(11) NULL DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`clue_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of crm_clue
-- ----------------------------

-- ----------------------------
-- Table structure for crm_clue_source
-- ----------------------------
DROP TABLE IF EXISTS `crm_clue_source`;
CREATE TABLE `crm_clue_source`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '线索来源id',
  `source_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '来源名称',
  `creat_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of crm_clue_source
-- ----------------------------
INSERT INTO `crm_clue_source` VALUES (2, '广告推送', '2021-06-24 14:44:31');
INSERT INTO `crm_clue_source` VALUES (3, '市场活动', '2021-06-24 14:44:53');
INSERT INTO `crm_clue_source` VALUES (4, '客户转介绍', '2021-06-24 14:44:57');
INSERT INTO `crm_clue_source` VALUES (6, '商务合作', '2021-06-24 16:10:16');

-- ----------------------------
-- Table structure for crm_user_list
-- ----------------------------
DROP TABLE IF EXISTS `crm_user_list`;
CREATE TABLE `crm_user_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `crm_user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '客户名称',
  `source_id` int(11) NULL DEFAULT NULL COMMENT '客户来源id',
  `crm_user_mail` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '邮箱',
  `crm_user_phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '手机号',
  `crm_user_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '地址',
  `crm_user_trade` int(11) NULL DEFAULT NULL COMMENT '客户行业',
  `crm_user_level` int(11) NULL DEFAULT NULL COMMENT '客户等级',
  `remark` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `charge_user_id` int(11) NULL DEFAULT NULL COMMENT '负责人',
  `creat_time` bigint(20) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) NULL DEFAULT NULL COMMENT '更新时间',
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '操作人',
  `creat_admin_id` int(11) NULL DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of crm_user_list
-- ----------------------------

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '部门id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '部门名称',
  `pid` int(11) NULL DEFAULT NULL COMMENT '上级部门id',
  `creat_time` bigint(20) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 78 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES (58, '测试', NULL, 1627034543000, NULL);
INSERT INTO `department` VALUES (59, '部门11', 58, 1627034601000, 1627034604000);
INSERT INTO `department` VALUES (61, '部门2', 58, 1627034660000, NULL);
INSERT INTO `department` VALUES (62, '部门3', 58, 1627034666000, NULL);
INSERT INTO `department` VALUES (66, 'xinz', 62, 1627188377000, NULL);
INSERT INTO `department` VALUES (68, '自行车', 61, 1628575672000, NULL);
INSERT INTO `department` VALUES (69, '部门4', 58, 1628575897000, NULL);
INSERT INTO `department` VALUES (70, '111', 61, 1628575902000, NULL);
INSERT INTO `department` VALUES (72, '帆帆发', 66, 1628575912000, NULL);
INSERT INTO `department` VALUES (76, 'vvvv', 59, 1628661506718, NULL);

-- ----------------------------
-- Table structure for follow_up_list
-- ----------------------------
DROP TABLE IF EXISTS `follow_up_list`;
CREATE TABLE `follow_up_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `follow_time` bigint(20) NULL DEFAULT NULL COMMENT '跟进时间',
  `follow_type` int(11) NULL DEFAULT NULL COMMENT '跟进类型',
  `crm_user_id` int(11) NULL DEFAULT NULL COMMENT '客户id',
  `crm_contact_id` int(11) NULL DEFAULT NULL COMMENT '联系人id',
  `follow_record` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '跟进内容',
  `remark` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '备注',
  `next_contact_time` bigint(20) NULL DEFAULT NULL COMMENT '下次联系时间',
  `creat_time` bigint(11) NULL DEFAULT NULL COMMENT '创建时间',
  `creat_admin_id` int(11) NULL DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of follow_up_list
-- ----------------------------

-- ----------------------------
-- Table structure for goods_branch
-- ----------------------------
DROP TABLE IF EXISTS `goods_branch`;
CREATE TABLE `goods_branch`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int(11) NULL DEFAULT NULL,
  `goods_status` int(11) NULL DEFAULT NULL COMMENT '1正常2禁用',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `creat_time` bigint(20) NULL DEFAULT NULL,
  `update_time` bigint(20) NULL DEFAULT NULL,
  `admin_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of goods_branch
-- ----------------------------

-- ----------------------------
-- Table structure for goods_class
-- ----------------------------
DROP TABLE IF EXISTS `goods_class`;
CREATE TABLE `goods_class`  (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `goods_status` int(11) NULL DEFAULT NULL COMMENT '1正常2禁用',
  `creat_time` bigint(20) NULL DEFAULT NULL,
  `update_time` bigint(20) NULL DEFAULT NULL,
  `admin_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of goods_class
-- ----------------------------
INSERT INTO `goods_class` VALUES (1, '第一级', 2, 1627982741, 1628487497552, 1);
INSERT INTO `goods_class` VALUES (2, 'ceshi', 2, 1628065157868, 1628478516434, 1);
INSERT INTO `goods_class` VALUES (3, '1111自行车', 2, 1628476192621, 1628478501891, 1);
INSERT INTO `goods_class` VALUES (4, 'zxc111', 2, 1628480058269, 1628480937537, 1);
INSERT INTO `goods_class` VALUES (5, 'qwe', 2, 1628480181829, 1628480914099, 1);
INSERT INTO `goods_class` VALUES (6, 'eeee', 2, 1628480248497, 1628487507913, 1);
INSERT INTO `goods_class` VALUES (7, '冰淇淋', 1, 1628487524398, NULL, 1);
INSERT INTO `goods_class` VALUES (8, '测试', 1, 1628488449255, NULL, 1);
INSERT INTO `goods_class` VALUES (9, '类别1', 1, 1628668090180, NULL, 1);
INSERT INTO `goods_class` VALUES (10, 'rrrfrfdsf', 1, 1628733752774, NULL, 1);
INSERT INTO `goods_class` VALUES (11, '第一级1', 1, 1628756675967, NULL, 1);
INSERT INTO `goods_class` VALUES (12, '啊啊啊啊啊啊啊啊啊啊', 2, 1628757003655, 1628758054936, 1);
INSERT INTO `goods_class` VALUES (13, '自行车111', 2, 1628757081577, 1628758075424, 1);
INSERT INTO `goods_class` VALUES (14, '执行程序333吱吱吱', 2, 1628757123670, 1628758070660, 1);

-- ----------------------------
-- Table structure for goods_list
-- ----------------------------
DROP TABLE IF EXISTS `goods_list`;
CREATE TABLE `goods_list`  (
  `goods_id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '名称',
  `goods_type_id` int(11) NULL DEFAULT NULL COMMENT '类型,绑定产品第四级类型id',
  `goods_price` int(20) NULL DEFAULT NULL COMMENT '价格',
  `goods_status` int(11) NULL DEFAULT NULL COMMENT '状态:1启用2禁用',
  `goods_intro` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '简介',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `creat_time` bigint(20) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) NULL DEFAULT NULL COMMENT '更新时间',
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`goods_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of goods_list
-- ----------------------------
INSERT INTO `goods_list` VALUES (1, 'test', 10, 150000, 2, 'cccc', 'cccccccccccccc', 1628675478639, 1628752613479, 1);
INSERT INTO `goods_list` VALUES (2, 'test1', 9, 22200, 2, 'cccc', 'cccccccccccccc', 1628675625060, 1628740325463, 1);
INSERT INTO `goods_list` VALUES (3, 'test111', 11, 150000, 1, '', '', 1628737806977, NULL, 1);
INSERT INTO `goods_list` VALUES (4, '测试1344', 10, 40000, 2, 'qweqweqwe', '', 1628750456736, NULL, 1);
INSERT INTO `goods_list` VALUES (5, 'ccccccc', 10, 30000, 1, '222', '', 1628750552023, NULL, 1);
INSERT INTO `goods_list` VALUES (6, 'rgrgrgrg', 12, 33300, 2, '', 'ccc', 1628750580739, 1628753126154, 1);

-- ----------------------------
-- Table structure for goods_type
-- ----------------------------
DROP TABLE IF EXISTS `goods_type`;
CREATE TABLE `goods_type`  (
  `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int(11) NULL DEFAULT NULL,
  `goods_status` int(11) NULL DEFAULT NULL COMMENT '1正常2禁用',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `creat_time` bigint(20) NULL DEFAULT NULL,
  `update_time` bigint(20) NULL DEFAULT NULL,
  `admin_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of goods_type
-- ----------------------------
INSERT INTO `goods_type` VALUES (1, 10, 2, 'xxx', 1628476525180, 1628478480644, 1);
INSERT INTO `goods_type` VALUES (2, 7, 2, '3333', 1628478527370, 1628487492027, 1);
INSERT INTO `goods_type` VALUES (3, 12, 2, '3eeeerr', 1628480084949, 1628480928206, 1);
INSERT INTO `goods_type` VALUES (4, 14, 2, '3e3e3e', 1628480325581, 1628487503174, 1);
INSERT INTO `goods_type` VALUES (5, 6, 2, '3e3e', 1628481111015, 1628481210362, 1);
INSERT INTO `goods_type` VALUES (6, 7, 2, '3t3t3t', 1628487395322, 1628487485299, 1);
INSERT INTO `goods_type` VALUES (7, 6, 2, '2r2r2r', 1628487404061, 1628487478571, 1);
INSERT INTO `goods_type` VALUES (8, 15, 1, '巧克力口味', 1628487548649, NULL, 1);
INSERT INTO `goods_type` VALUES (9, 16, 1, '222', 1628488459440, NULL, 1);
INSERT INTO `goods_type` VALUES (10, 19, 1, 'b5', 1628733762828, NULL, 1);
INSERT INTO `goods_type` VALUES (11, 18, 1, 'cccc', 1628756402462, NULL, 1);
INSERT INTO `goods_type` VALUES (12, 20, 1, '第三集', 1628756688886, NULL, 1);
INSERT INTO `goods_type` VALUES (13, 20, 1, '这些33', 1628756749298, NULL, 1);
INSERT INTO `goods_type` VALUES (14, 21, 2, '嘎嘎嘎嘎嘎嘎嘎嘎嘎嘎', 1628757146131, 1628758066489, 1);

-- ----------------------------
-- Table structure for goods_type_name
-- ----------------------------
DROP TABLE IF EXISTS `goods_type_name`;
CREATE TABLE `goods_type_name`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) NULL DEFAULT NULL,
  `goods_status` int(11) NULL DEFAULT NULL COMMENT '1正常2禁用',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `creat_time` bigint(20) NULL DEFAULT NULL,
  `update_time` bigint(20) NULL DEFAULT NULL,
  `admin_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of goods_type_name
-- ----------------------------
INSERT INTO `goods_type_name` VALUES (1, 1, 2, '4e', 1628476628506, 1628478309450, 1);
INSERT INTO `goods_type_name` VALUES (2, 2, 2, '444', 1628478532250, 1628479662065, 1);
INSERT INTO `goods_type_name` VALUES (3, 2, 2, '3333', 1628478576269, 1628487390662, 1);
INSERT INTO `goods_type_name` VALUES (4, 2, 2, '4444r', 1628478688095, 1628487489811, 1);
INSERT INTO `goods_type_name` VALUES (5, 2, 2, '4ttt', 1628479724154, 1628487378744, 1);
INSERT INTO `goods_type_name` VALUES (6, 3, 2, 'zxc44444', 1628480090998, 1628480926221, 1);
INSERT INTO `goods_type_name` VALUES (7, 4, 2, '4e4e44', 1628480331640, 1628487499613, 1);
INSERT INTO `goods_type_name` VALUES (8, 7, 2, '2t2t2t', 1628487408019, 1628487471337, 1);
INSERT INTO `goods_type_name` VALUES (9, 8, 1, '100克装', 1628487569163, 1628756049246, 1);
INSERT INTO `goods_type_name` VALUES (10, 9, 1, '4333', 1628488463201, NULL, 1);
INSERT INTO `goods_type_name` VALUES (11, 8, 1, '200克装', 1628733567480, NULL, 1);
INSERT INTO `goods_type_name` VALUES (12, 9, 1, 'rrrr', 1628733683553, NULL, 1);
INSERT INTO `goods_type_name` VALUES (13, 10, 2, 'g6', 1628733767339, 1628756284053, 1);
INSERT INTO `goods_type_name` VALUES (14, 10, 2, '杠', 1628755591877, 1628756280854, 1);
INSERT INTO `goods_type_name` VALUES (15, 10, 2, 'fff', 1628756295809, 1628756298727, 1);
INSERT INTO `goods_type_name` VALUES (16, 9, 1, 'tgtgt', 1628756313435, NULL, 1);
INSERT INTO `goods_type_name` VALUES (17, 9, 1, 'rtr5656', 1628756377718, NULL, 1);
INSERT INTO `goods_type_name` VALUES (18, 11, 1, 'er343', 1628756560732, NULL, 1);
INSERT INTO `goods_type_name` VALUES (19, 11, 1, 'zv2314', 1628756581702, NULL, 1);
INSERT INTO `goods_type_name` VALUES (20, 10, 1, 'eeeee', 1628756596268, NULL, 1);
INSERT INTO `goods_type_name` VALUES (21, 12, 1, '第四季', 1628756694040, NULL, 1);
INSERT INTO `goods_type_name` VALUES (22, 12, 1, '1从v吧', 1628756740159, NULL, 1);
INSERT INTO `goods_type_name` VALUES (23, 14, 2, '刚刚涛涛涛涛涛涛涛涛', 1628757159117, 1628758059928, 1);
INSERT INTO `goods_type_name` VALUES (24, 14, 2, '刚刚顶顶顶顶顶顶顶发', 1628757767055, 1628758061794, 1);
INSERT INTO `goods_type_name` VALUES (25, 14, 2, '刚刚红红火火恍恍惚惚', 1628757778830, 1628758063856, 1);

-- ----------------------------
-- Table structure for operation_log
-- ----------------------------
DROP TABLE IF EXISTS `operation_log`;
CREATE TABLE `operation_log`  (
  `id` int(50) NOT NULL AUTO_INCREMENT COMMENT '记录id',
  `operat_type` tinyint(4) NULL DEFAULT NULL COMMENT '操作类型：1新增2编辑/修改3查询4删除5登录',
  `token` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '操作人token',
  `ip` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '请求ip地址',
  `creat_time` bigint(255) NULL DEFAULT NULL COMMENT '操作时间戳',
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '操作内容',
  `browser` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '浏览器信息',
  `os` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '操作系统',
  `device` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '设备信息',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of operation_log
-- ----------------------------

-- ----------------------------
-- Table structure for order_approve
-- ----------------------------
DROP TABLE IF EXISTS `order_approve`;
CREATE TABLE `order_approve`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NULL DEFAULT NULL COMMENT '订单id',
  `approve_user` int(11) NULL DEFAULT NULL COMMENT '审批人id',
  `create_time` bigint(20) NULL DEFAULT NULL COMMENT '审批时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order_approve
-- ----------------------------

-- ----------------------------
-- Table structure for order_flow_record
-- ----------------------------
DROP TABLE IF EXISTS `order_flow_record`;
CREATE TABLE `order_flow_record`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NULL DEFAULT NULL COMMENT '订单id',
  `descr` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '描述性字段：回款id 1 金额 100',
  `order_type` int(11) NULL DEFAULT NULL COMMENT '1订单、2回款、3退款',
  `operate_type` int(11) NULL DEFAULT NULL COMMENT '1创建类型(订单\\回款\\退款)、2审批(订单\\回款\\退款)、3驳回(订单、回款)、4回款退回、5取消订单或回款、6编辑,重新走审批(订单、回款)7订单生效',
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '操作人',
  `create_time` bigint(20) NULL DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order_flow_record
-- ----------------------------

-- ----------------------------
-- Table structure for orderlist
-- ----------------------------
DROP TABLE IF EXISTS `orderlist`;
CREATE TABLE `orderlist`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_type` int(11) NULL DEFAULT NULL COMMENT '体验产品订单,新签订单,复购订单',
  `order_cycle` int(11) NULL DEFAULT NULL COMMENT '订单生命周期: 1未取消,2已取消',
  `approve_status` int(11) NULL DEFAULT NULL COMMENT '订单审批状态: 待审批,已驳回,已通过,已退款',
  `effect_status` int(11) NULL DEFAULT NULL COMMENT '订单生效状态：1已生效,2未生效',
  `order_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '订单名称',
  `order_number` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '订单编号',
  `crm_user_id` int(11) NULL DEFAULT NULL COMMENT '客户id',
  `contract_date` bigint(20) NULL DEFAULT NULL COMMENT '签约日期',
  `crm_contact_id` int(11) NULL DEFAULT NULL COMMENT '客户签约人id(联系人id)',
  `goods_id` int(11) NULL DEFAULT NULL COMMENT '产品id',
  `goods_cnt` int(11) NULL DEFAULT NULL COMMENT '产品数量',
  `discount` int(11) NULL DEFAULT NULL COMMENT '订单折扣',
  `actual_amount` int(20) NULL DEFAULT NULL COMMENT '实际金额',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `reject_reason` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '驳回原因',
  `approve_user` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审批人',
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '创建人',
  `create_time` bigint(20) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(20) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of orderlist
-- ----------------------------

-- ----------------------------
-- Table structure for staff
-- ----------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `status` int(11) NULL DEFAULT 1 COMMENT '状态：1在职2离职',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `depart_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '部门id(存字符串,部门层级,逗号隔开)',
  `phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `mail` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `contact_way` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '其他联系方式：qq号或微信号',
  `paper_type` int(11) NULL DEFAULT NULL COMMENT '证件类型',
  `paper_data` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '证件号',
  `gender` int(11) NULL DEFAULT NULL COMMENT '1男2女',
  `birthday` bigint(20) NULL DEFAULT NULL COMMENT '生日',
  `is_married` int(11) NULL DEFAULT NULL COMMENT '是否已婚：1是2否',
  `is_birth` int(11) NULL DEFAULT NULL COMMENT '是否已育：1是2否',
  `politics_status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '政治面貌',
  `native_place` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '籍贯(存字符串,省市区三级)',
  `native_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '籍贯详细地址',
  `education` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '最高学历',
  `current_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '现居住地',
  `emergency_contact` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '紧急联系人',
  `emergency_contact_phone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '紧急联系人电话',
  `probation_start_date` bigint(20) NULL DEFAULT NULL COMMENT '试用期开始日期',
  `probation_end_date` bigint(20) NULL DEFAULT NULL COMMENT '试用期结束日期',
  `entry_date` bigint(20) NULL DEFAULT NULL COMMENT '入职日期',
  `dimission_date` bigint(20) NULL DEFAULT NULL COMMENT '离职日期',
  `dimission_cause` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '离职原因',
  `create_time` bigint(20) NULL DEFAULT NULL COMMENT '创建日期',
  `update_time` bigint(20) NULL DEFAULT NULL COMMENT '更新日期',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `admin_id` int(11) NULL DEFAULT NULL COMMENT '操作人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of staff
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
