//导入mysql模块
const mysql = require('mysql')

//创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: '20230320',
    charset: 'utf8mb4'
})

//向外共享数据库连接对象
module.exports = db