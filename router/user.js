//导入express模块
const express = require('express')

//创建路由对象
const router = express.Router()

//导入用户路由处理函数对应的模块
const user_handle = require('../router_handle/user')

//注册
router.post('/reguser', user_handle.regUser)

//登录
router.post('/login', user_handle.login)

//将路由对象共享出去
module.exports = router