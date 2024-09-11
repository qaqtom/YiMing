/*
 Navicat Premium Data Transfer

 Source Server         : test
 Source Server Type    : MySQL
 Source Server Version : 80037
 Source Host           : localhost:3306
 Source Schema         : zysjk

 Target Server Type    : MySQL
 Target Server Version : 80037
 File Encoding         : 65001

 Date: 04/09/2024 12:55:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cases
-- ----------------------------
DROP TABLE IF EXISTS `cases`;
CREATE TABLE `cases`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cases
-- ----------------------------
INSERT INTO `cases` VALUES (1, '红军长征');
INSERT INTO `cases` VALUES (2, '一个新的案例');

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES (1, '地理信息系统原理');
INSERT INTO `course` VALUES (3, '这是一个测试案例');

-- ----------------------------
-- Table structure for dlxxxtyl
-- ----------------------------
DROP TABLE IF EXISTS `dlxxxtyl`;
CREATE TABLE `dlxxxtyl`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `knowledge_points` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '知识点',
  `case_study` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '案例',
  `spirit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '精神',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '地理信息系统原理' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dlxxxtyl
-- ----------------------------
INSERT INTO `dlxxxtyl` VALUES (1, '地理信息系统概述', 'GIS 技术在北京奥运会中的应用、嫦娥探月工程', '爱国奉献、追求卓越、民族自信');
INSERT INTO `dlxxxtyl` VALUES (2, 'GIS的空间参照系统', '北斗卫星导航系统建设、国家地理信息公共服务平台建设', '爱国奉献、追求卓越、以人为本');
INSERT INTO `dlxxxtyl` VALUES (3, '空间数据结构', '国家地理信息标准化技术委员会工作、国产 SuperMap 软件的发展', '团结合作、追求卓越、遵守规则、民族自信');
INSERT INTO `dlxxxtyl` VALUES (4, '空间数据管理', '国产 GeoScene 引擎的发展、李德仁院士设计的 R 树空间索引机制、国家地理信息数据库建设', '爱国奉献、求真务实、团结合作、追求卓越、遵守规则、民族自信');
INSERT INTO `dlxxxtyl` VALUES (5, '空间数据的编辑与处理', '全国地理国情普查工作、陈军院士基于云计算的空间数据分析平台建设、张良培教授的空间数据质量评价标准建设', '求真务实、艰苦奋斗、民族自信');
INSERT INTO `dlxxxtyl` VALUES (6, '空间数据的查询检索与量算', '杨元喜院士的高精度地球重力场模型、中国地质大学空间数据查询检索系统建设', '追求卓越、求真务实');
INSERT INTO `dlxxxtyl` VALUES (7, 'GIS基本空间分析', '汤国安教授城市热岛效应', '遵守规则、尊重自然');
INSERT INTO `dlxxxtyl` VALUES (8, '数字地面模型与地形分析', '王家耀院士 DTM 数据采集与生成算法、陈述彭院士的 DEM 数据结构', '求真务实、艰苦奋斗、追求卓越、民族自信');
INSERT INTO `dlxxxtyl` VALUES (9, '地理信息系统应用模型', '数字地球建设、城市扩展模型、环境遥感', '求真务实、遵守规则');

-- ----------------------------
-- Table structure for famous_people
-- ----------------------------
DROP TABLE IF EXISTS `famous_people`;
CREATE TABLE `famous_people`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of famous_people
-- ----------------------------
INSERT INTO `famous_people` VALUES (1, '李德仁');
INSERT INTO `famous_people` VALUES (2, '掌心啊大哥');

-- ----------------------------
-- Table structure for hjcz
-- ----------------------------
DROP TABLE IF EXISTS `hjcz`;
CREATE TABLE `hjcz`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `course_name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '课程名',
  `knowledge_points` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '知识点',
  `spirit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '精神',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '红军长征' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hjcz
-- ----------------------------
INSERT INTO `hjcz` VALUES (1, '数字地形测量学', '时空描述构建与数据模型', '艰苦奋斗');
INSERT INTO `hjcz` VALUES (2, '地理信息系统原理', '路线信息符号化表达', '以人为本');
INSERT INTO `hjcz` VALUES (3, '地图学基础', '路线地形特征分析', '团结合作');
INSERT INTO `hjcz` VALUES (4, 'GIS空间分析', '空间量算分析', '追求卓越');
INSERT INTO `hjcz` VALUES (5, 'GIS应用开发', 'GIS系统的设计与实现', '民族自信');

-- ----------------------------
-- Table structure for issues
-- ----------------------------
DROP TABLE IF EXISTS `issues`;
CREATE TABLE `issues`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ldr
-- ----------------------------
DROP TABLE IF EXISTS `ldr`;
CREATE TABLE `ldr`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `research_field` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '研究领域',
  `specific` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '具体内容',
  `materials_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '素材文件路径或URL',
  `spirit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '精神',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '李德仁' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ldr
-- ----------------------------
INSERT INTO `ldr` VALUES (1, '地理信息系统 (GIS)', '地球空间信息科学的理论创新、集成创新和协同', NULL, '追求卓越、爱国奉献、求真务实');
INSERT INTO `ldr` VALUES (2, '地理信息系统(GIS)', '地球空间信息科学概念和理论体系', NULL, '追求卓越、求真务实');
INSERT INTO `ldr` VALUES (3, '地理信息系统(GIS)', '广义和狭义空间信息网格的概念与理论', NULL, '追求卓越、求真务实、爱国奉献');
INSERT INTO `ldr` VALUES (4, '全球定位系统(GNSS)', '\"3S集成\"即将GIS、GNSS与RS集成', NULL, '民族自信、艰苦奋斗、追求卓越、爱国奉献、求真务实');
INSERT INTO `ldr` VALUES (5, '全球定位系统(GNSS)', '天空地高分辨率遥感系统的发展', NULL, '民族自信、艰苦奋斗、追求卓越');
INSERT INTO `ldr` VALUES (6, '遥感 (RS)', '测量误差理论与处理方法', NULL, '追求卓越');
INSERT INTO `ldr` VALUES (7, '遥感 (RS)', '遥感数据高精度智能处理关键技术', NULL, '民族自信、求真务实、艰苦奋斗');
INSERT INTO `ldr` VALUES (8, '遥感 (RS)', '遥感技术在经济建设国防建设和大众民生中的应用', NULL, '爱国奉献、民族自信、艰苦奋斗');

-- ----------------------------
-- Table structure for others
-- ----------------------------
DROP TABLE IF EXISTS `others`;
CREATE TABLE `others`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for pyfa
-- ----------------------------
DROP TABLE IF EXISTS `pyfa`;
CREATE TABLE `pyfa`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `major` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '专业',
  `course_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '课程',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 129 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '培养方案' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pyfa
-- ----------------------------
INSERT INTO `pyfa` VALUES (1, '海洋类', '海洋科学导论');
INSERT INTO `pyfa` VALUES (2, '海洋类', '物理海洋学基础');
INSERT INTO `pyfa` VALUES (3, '测绘工程', '数字地形测量学');
INSERT INTO `pyfa` VALUES (4, '测绘工程', '地理信息系统原理');
INSERT INTO `pyfa` VALUES (5, '测绘工程', '遥感原理与应用');
INSERT INTO `pyfa` VALUES (6, '测绘工程', '数字图像处理');
INSERT INTO `pyfa` VALUES (7, '测绘工程', '误差理论与测量平差');
INSERT INTO `pyfa` VALUES (8, '测绘工程', '卫星定位原理及应用');
INSERT INTO `pyfa` VALUES (9, '测绘工程', '摄影测量学基础');
INSERT INTO `pyfa` VALUES (10, '测绘工程', '物理大地测量学');
INSERT INTO `pyfa` VALUES (11, '测绘工程', '大地测量学基础');
INSERT INTO `pyfa` VALUES (12, '测绘工程', '地图学基础');
INSERT INTO `pyfa` VALUES (13, '测绘工程', '工程测量学');
INSERT INTO `pyfa` VALUES (14, '地理信息科学', '地图学基础');
INSERT INTO `pyfa` VALUES (15, '地理信息科学', '遥感原理与应用');
INSERT INTO `pyfa` VALUES (16, '地理信息科学', '数字地形测量学');
INSERT INTO `pyfa` VALUES (17, '地理信息科学', '摄影测量学基础');
INSERT INTO `pyfa` VALUES (18, '地理信息科学', '地理信息系统原理');
INSERT INTO `pyfa` VALUES (19, '地理信息科学', 'GIS 应用开发');
INSERT INTO `pyfa` VALUES (20, '地理信息科学', '空间数据库');
INSERT INTO `pyfa` VALUES (21, '地理信息科学', 'GIS 空间分析');
INSERT INTO `pyfa` VALUES (22, '地理信息科学', '卫星定位原理及应用');
INSERT INTO `pyfa` VALUES (23, '地理信息科学', '自然地理学');
INSERT INTO `pyfa` VALUES (24, '电子信息工程', '信号与系统');
INSERT INTO `pyfa` VALUES (25, '电子信息工程', '人工智能模型和算法');
INSERT INTO `pyfa` VALUES (26, '电子信息工程', '模拟电子技术');
INSERT INTO `pyfa` VALUES (27, '电子信息工程', '海洋信息技术基础');
INSERT INTO `pyfa` VALUES (28, '电子信息工程', '微机原理');
INSERT INTO `pyfa` VALUES (29, '电子信息工程', '电子信息系统设计');
INSERT INTO `pyfa` VALUES (30, '电子信息工程', '数字电子技术');
INSERT INTO `pyfa` VALUES (31, '电子信息工程', '通信原理');
INSERT INTO `pyfa` VALUES (32, '电子信息工程', '数字信号处理');
INSERT INTO `pyfa` VALUES (33, '电子信息工程', '电路理论基础');
INSERT INTO `pyfa` VALUES (34, '电子信息工程', '电磁场与电磁波');
INSERT INTO `pyfa` VALUES (35, '通信工程', '数据结构与算法');
INSERT INTO `pyfa` VALUES (36, '通信工程', '通信原理');
INSERT INTO `pyfa` VALUES (37, '通信工程', '信息论与编码');
INSERT INTO `pyfa` VALUES (38, '通信工程', '模拟电子技术');
INSERT INTO `pyfa` VALUES (39, '通信工程', '信号与系统');
INSERT INTO `pyfa` VALUES (40, '通信工程', '通信电子线路');
INSERT INTO `pyfa` VALUES (41, '通信工程', '通信工程概论');
INSERT INTO `pyfa` VALUES (42, '通信工程', '数字系统设计');
INSERT INTO `pyfa` VALUES (43, '通信工程', '计算机网络');
INSERT INTO `pyfa` VALUES (44, '通信工程', '数字信号处理');
INSERT INTO `pyfa` VALUES (45, '通信工程', '电路理论基础');
INSERT INTO `pyfa` VALUES (46, '通信工程', '电磁场与电磁波');
INSERT INTO `pyfa` VALUES (129, '海洋类', '这是一个测试案例');

-- ----------------------------
-- Table structure for suggestions
-- ----------------------------
DROP TABLE IF EXISTS `suggestions`;
CREATE TABLE `suggestions`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of suggestions
-- ----------------------------
INSERT INTO `suggestions` VALUES (1, '一个新的内容', '8888888', '2024-09-02 21:29:46');

-- ----------------------------
-- Table structure for table_mapping
-- ----------------------------
DROP TABLE IF EXISTS `table_mapping`;
CREATE TABLE `table_mapping`  (
  `text_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `table_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`text_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of table_mapping
-- ----------------------------
INSERT INTO `table_mapping` VALUES ('一个新的案例', 'ygxdal');
INSERT INTO `table_mapping` VALUES ('地理信息系统原理', 'dlxxxtyl');
INSERT INTO `table_mapping` VALUES ('掌心啊大哥', 'zxadg');
INSERT INTO `table_mapping` VALUES ('李德仁', 'ldr');
INSERT INTO `table_mapping` VALUES ('红军长征', 'hjcz');
INSERT INTO `table_mapping` VALUES ('这是一个测试案例', 'zsygcsal');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('user','admin','superadmin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'user',
  `identity_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (2, '2016020115', '$2b$10$iGrz8e4rp9O3ZjqypUy.ee0GKjvsd30VBvljd459JoSb5k5CmsSr2', 'superadmin', '666888', '2024-09-03 15:05:22');

-- ----------------------------
-- Table structure for ygxdal
-- ----------------------------
DROP TABLE IF EXISTS `ygxdal`;
CREATE TABLE `ygxdal`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `knowledge_points` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `case_study` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spirit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ygxdal
-- ----------------------------
INSERT INTO `ygxdal` VALUES (1, '不会', 'add', '有什么精神');

-- ----------------------------
-- Table structure for zsygcsal
-- ----------------------------
DROP TABLE IF EXISTS `zsygcsal`;
CREATE TABLE `zsygcsal`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `knowledge_points` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `case_study` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spirit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of zsygcsal
-- ----------------------------
INSERT INTO `zsygcsal` VALUES (1, '我不是只是', '我是案例', '没有精神');

-- ----------------------------
-- Table structure for zxadg
-- ----------------------------
DROP TABLE IF EXISTS `zxadg`;
CREATE TABLE `zxadg`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `research_field` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `specific` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `materials_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spirit` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of zxadg
-- ----------------------------
INSERT INTO `zxadg` VALUES (1, '阿达伟大', '伟大时代', 'http://localhost:8080/caselibraryentry', '阿达达瓦');

SET FOREIGN_KEY_CHECKS = 1;
