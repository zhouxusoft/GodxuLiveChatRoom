//导入express模块
const express = require('express')

//导入cors中间件
const cors = require('cors')

//导入用户路由模块
const userRouter = require('./router/user')

//导入配置文件
const config = require('./config')

//解析token的中间件
const expressJWT = require('express-jwt')

//创建express的服务器实例
const app = express()

//将cors注册为全局中间件
app.use(cors())

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

//在所有路由之前封装一个res.cc()函数
app.use((req, res, next) => {
    //status默认值为1，表示失败
    //err的值，可以是一个错误对象，也可以是一个错误描述字符串
    res.cc = function(err, status = 1) {
        res.send({status, message: err instanceof Error ? err.message : err})
    }
    next()
})

//全局挂载用户路由
app.use('/api', userRouter)

app.get('', function(req, res) {
    res.sendFile(__dirname + '/public/login/index.html')
})
//静态资源托管
app.use(express.static(__dirname + "/public/"))
app.use(express.static(__dirname + "/public/login/"))
app.use(express.static(__dirname + "/public/register/"))

//调用app.listen方法，指定端口号并启动web服务器
app.listen(3007, function() {
    console.log('api sever running at http://127.0.0.1:3007')
})