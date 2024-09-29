var mysql = require("mysql");
var config = require("./sqlConfig");

var queryDB = mysql.createPool(config.info);

let sqlPool = {
    querySql(sql, info, callback) {
        queryDB.getConnection(function (err, conn) {
            if (err) {
                callback(err, null, null);
            }
            else {
                conn.query(sql, info, function (qerr, vals, fields) {
                    //释放连接
                    conn.release();
                    //事件驱动回调
                    callback(qerr, vals, fields);
                });
            }
        });
    },

    queryData(sql, info = []) {
        return new Promise((resolve, reject) => {
            console.log("数据库语句", sql);
            console.log("数据库参数", info);
            sqlPool.querySql(sql, info, (err, rows) => {
                if(err) return reject(new Error(err.sqlMessage))
                resolve({ rows: rows, err: err });
            });
        });
    }

};

module.exports = sqlPool;
