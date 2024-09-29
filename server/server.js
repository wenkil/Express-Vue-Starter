var createError = require("http-errors");
var express = require("express");
var path = require("path");
var compression = require("compression");
var bodyParser = require("body-parser");
var logger = require("morgan");
const http = require("http");
// var history = require('connect-history-api-fallback');
const {ValidationError} = require("express-validation");

var app = express();
var api_route = require("./routes");
var loginMoudle = require("./moudle/login");

var port = process.env.PORT || "8088";
app.set("port", port);

//请求头配置
app.all("*", async function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Credentials', 'true')
    // res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept,X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    // res.setHeader("Content-Type", "application/json;charset=utf-8")
    console.log("req.url-->", req.url);
    if (req.url == "/api/login") {
        next();
    }
    else {
        let token = req.headers["authorization"] || req.headers["Authorization"];
        if (!token) return res.send({code: -10, msg: "非法请求"});
        let checkToken = await loginMoudle.getAuthorization(token);
        // console.log('查询的返回', checkToken)
        if (checkToken.rows) {
            if (checkToken.rows.length > 0 && checkToken.rows[0].token == token) {
                console.log("请求人信息---->", "id:", checkToken.rows[0].user_id + " 名称:" + checkToken.rows[0].name);
                if (checkToken.rows[0].user_status === 1) {
                    // console.log('res.locals',res.locals)
                    res.locals.admin_id = checkToken.rows[0].user_id;
                    res.locals.role_id = checkToken.rows[0].role_id;
                    next();
                }
                else {
                    res.send({code: -10, msg: "当前登录账号已被禁用,请联系管理员"});
                }
            }
            else {
                res.send({code: -10, msg: "token验证无效,请先登录"});
            }
        }
        else {
            let msg = checkToken.err ? "系统错误: " + checkToken.err.sqlMessage : "token验证无效,请先登录";
            res.send({code: -10, msg: msg});
        }
    }
});

app.use(logger("dev"));
// app.use(express.json());
app.use(compression());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: "400mb"}));
app.use(bodyParser.urlencoded({limit: "400mb", extended: true}));
// app.use(history({
//     verbose: true,
//     index: '/'
// }))

//修改send方法执行当前中间件
// app.use(function (req,res,next) {
//     var _send = res.send;
//     var sent = false;
//     let obj = {}
//     res.send = function (data) {
//         if (sent) return;
//         _send.bind(res)(data);
//         obj = JSON.stringify(data)
//         console.log('data----->',data);
//         sent = true;
//     };
//     next();
//
//     console.log('测试send之后执行',JSON.parse(obj));
// })

app.use(api_route);

app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
app.use(function (err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).send(err);
    }
    return res.status(500).send(err);
});
process.on("uncaughtException", (err) => console.log(err, err.stack));
http.createServer(app).listen(app.get("port"), () => {
    console.log("Express server listening on port " + app.get("port"));
});
module.exports = app;
