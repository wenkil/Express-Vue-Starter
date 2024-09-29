const config = require("../config/index");

module.exports = {
    MD5_KEYS: "B2a0c2k1e0n5d_Token",
    OPERATION_TYPE: {
        ADD: 1,
        UPDATE: 2,
        QUERY: 3,
        DELETE: 4,
        LOGIN: 5,
        PASSWORD: 6,
        APPROVE: 7,
        EXPORT: 8
    },

    ErrorResponse: function (msg = "") {
        return { code: 1, msg: msg || "服务器异常" };
    },

    SuccessResponse: function (data = {}) {
        return { code: 200, msg: "success", data: data };
    },

    getLimitAndOffset(limit, page) {
        if (!limit || !page) return { limit: 15, offset: 0 };
        return { limit: Number(limit), offset: (Number(page) - 1) * limit };
    },

    /**
     * 判断数据库请求数据对象的异常错误
     * arguments：参数数量
     * @returns {null}
     * @constructor
     */
    VerifyErrorObject() {
        let message = null;
        for (let i = 0; i < arguments.length; i++) {
            if (arguments[i].err) {
                message = arguments[i].err.sqlMessage;
                break;
            }
        }
        return message;
    },

    /**
     * 递归遍历数据层级
     * @param data 树列表
     * @param pid  父级id
     * @returns {*}
     */
    getTree(data = [], pid = null, level = 0) {
        level += 1;
        const children = [];
        for (const i in data) {
            const node = data[i];
            if ((!pid && !node.pid) || node.pid === pid) {
                let v = {
                    label: node.name,
                    level,
                    ...node
                };
                let arr = this.getTree(data, node.id, level);
                if (arr.length) v.children = arr;
                children.push(v);
            }
        }

        return children.length ? children.sort(function (a, b) {
            return b.id - a.id;
        }) : [];
    },

    /**
     * 根据传来的数据验证是否为空，组装成sql查询语句 ： 一般用作获取列表数据的接口
     * @param info  要验证的请求对象
     * @param keys  要验证的字段
     * @returns {{data: [], sql: string}}
     */
    getParamsForSql(info, keys, table = "") {
        let sql = "";
        let data = [];
        if (info && keys.length) {
            Object.keys(info).forEach(key => {
                keys.map(item => {
                    if (item == key && info[key] && info[key] != "") {
                        data.push(info[key]);
                        if (sql != "") {
                            sql += " AND ";
                        }
                        else {
                            sql += " WHERE ";
                        }
                        sql += ((table ? table + "." + key : key) + "= ? ");
                    }
                });
            });
        }
        return { sql, data };
    },

    /**
     * 根据字段拼装update语句
     * @param info
     * @param keys 要加字符串的key值
     */
    getParamByUpdate(info, keys = []) {
        console.log("update--->", keys);
        let sql = "";
        if (info) {
            Object.keys(info).forEach(key => {
                let str = sql ? "," : " ";
                let param = `${info[key]}`;
                keys.map(item => {
                    if (key == item) {
                        param = `'${info[key]}'`;
                    }
                });
                let updateStr = (str + `${key}` + "=" + param);
                sql += updateStr;
            });
        }
        console.log("updateSql = ", sql);
        return sql;
    },

    getCrmuserInfoByType(id, type) {
        let arr = config[type];
        let filter = arr.filter(v => v.id == Number(id));
        return arr.length && filter.length ? filter[0].name : "";
    }

};
