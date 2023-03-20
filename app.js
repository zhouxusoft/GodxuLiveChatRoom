//导入express模块
const express = require('express')

//导入cors中间件
const cors = require('cors')

//创建express的服务器实例
const app = express()

//导入用户路由模块
const userRouter = require('./router/user')

//将cors注册为全局中间件
app.use(cors())

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))


//全局挂载用户路由
app.use('/api', userRouter)

//调用app.listen方法，指定端口号并启动服务器
app.listen(3008, function() {
    console.log('running at 3008')
})