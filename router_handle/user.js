//导入bcryptjs
const bcrypt = require('bcryptjs')

//导入数据库操作模块
const db = require('../database/index')

//导入生成token的包
const jwt = require('jsonwebtoken')

//导入配置文件
const config = require('../config')

//注册新用户
exports.regUser = (req, res) => {
    //接收表单数据
    const userinfo = req.body
    //判断用户名或密码是否为空
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户名或密码不能为空')
    }
    //检测用户名是否被占用
    //定义查询语句
    const sql = 'select * from usertable where username = ?'
    //执行sql语句并根据结果判断
    db.query(sql, [userinfo.username], function(err, results) {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('用户名已存在')
        }
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sql = 'insert into usertable set ?'
        db.query(sql, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            if (err) {
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                return res.cc('注册失败,请稍后再试')
            }
            res.send({status: 0, message: '注册成功'})
        })
    })
}

//登录
exports.login = (req, res) => {
    //请求表单数据
    const userinfo = req.body
    //定义sql语句
    const sql = 'select * from usertable where username = ?'
    //执行SQL语句，查询用户数据
    db.query(sql, userinfo.username, function(err, results) {
        //执行sql语句失败
        if (err) {
            return res.cc(err)
        }
        //执行sql语句成功，但查询到的数据不等于1
        if (results.length !== 1) {
            return res.cc('用户名不存在')
        }
        //判断密码是否正确
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('密码错误')
        }
        const user = {...results[0], password: '', user_pic: ''}
        //对用户信息进行加密，生成一个token
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h'
        })
        res.send({
            status: 0,
            message: '登陆成功',
            //为方便用户端直接使用token，在服务器端直接拼接Bearer前缀
            token:'Bearer' + tokenStr
        })
    })
}