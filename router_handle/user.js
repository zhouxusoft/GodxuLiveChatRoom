//导入bcryptjs
const bcrypt = require('bcryptjs')

const { validationResult } = require('express-validator')

//导入数据库操作模块
const db = require('../database/index')

//注册新用户
exports.regUser = (req, res) => {
    //接收表单数据
    const userinfo = req.body
    if (!userinfo) return res.cc(err)
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.cc('用户名或密码不能为空')
    //检测用户名是否被占用
    //定义查询语句
    const sql = 'select * from usertable where username = ?'
    //执行sql语句并根据结果判断
    db.query(sql, [userinfo.username], function (err, results) {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('用户名已存在')
        }
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sql = 'insert into usertable set ?'
        db.query(sql, { username: userinfo.username, password: userinfo.password, nickname: userinfo.username }, (err, results) => {
            if (err) {
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                return res.cc('注册失败,请稍后再试')
            }
            res.send({ status: 0, message: '注册成功' })
        })
    })
}

//登录
exports.login = (req, res) => {
    //请求表单数据
    const userinfo = req.body

    //判断输入是否为空
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户名或密码不能为空')
    }
    //定义sql语句
    const sql = 'select * from usertable where username = ?'
    //执行SQL语句，查询用户数据
    db.query(sql, userinfo.username, function (err, results) {
        //执行sql语句失败
        if (err) {
            return res.cc(err)
        }
        //执行sql语句成功，但查询到的数据不等于1
        if (results.length !== 1) {
            return res.cc('请输入正确的用户名')
        }
        //判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('密码错误')
        }
        const user = { ...results[0], password: '' }
        res.send({
            status: 0,
            message: '登陆成功',
            //为方便用户端直接使用token，在服务器端直接拼接Bearer前缀
            token: user
        })
    })
}

//修改用户名
exports.changeNickname = (req, res) => {
    //接收表单数据
    const userinfo = req.body
    if (!userinfo) return res.cc(err)
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.cc('昵称不能为空')
    //检测用户名是否被占用
    //定义查询语句
    const sql = 'select * from usertable where nickname = ?'
    //执行sql语句并根据结果判断
    db.query(sql, [userinfo.nickname], function (err, results) {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('昵称已存在')
        }
        const sql = 'UPDATE usertable SET nickname="${userinfo.nickname}" WHERE id=${userinfo.id}'
        db.query(sql, (err, results) => {
            if (err) {
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                return res.cc('修改失败,请稍后再试')
            }
            res.send({ status: 0, message: '修改成功' })
        })
    })
}