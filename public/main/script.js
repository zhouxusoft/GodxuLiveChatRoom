//拿到登录的token
//判断值是否为空
let token = JSON.parse(localStorage.getItem("token"))

//设置时间
let date = new Date()

//0.5s后再进行判断 为了防止页面刷新过快而出现token为空的误判
if (!token) {
    window.location = '../login/'
}

const socket = io('http://127.0.0.1:30018', {
    query: { id: token.nickname }
});

//获取到输出框，用于修改内容
let output = document.getElementsByClassName("output");
let header = document.getElementsByClassName("header");
let menu = document.getElementsByClassName("menu");

//获取输入框，用于判断其内部的内容
//获取发送按钮
let inputElement = document.getElementsByClassName("input");
let btn = document.getElementsByClassName("btn")
let btndown = document.getElementsByClassName("btndown")

//给输入框添加监听事件，判断内容
//input中有内容 箭头向上 代表发送
//无内容 箭头向下 代表打开下拉菜单
inputElement[0].addEventListener('input', (event) => {
    let inputValue = event.target.value;
    if (inputValue) {
        btn[0].classList.remove("btndown")
        btn[0].classList.add("btnup")
        if (output[0].style.height == "420px") {
            output[0].style.height = "470px"
            menu[0].style.height = "7px"
        }
    } else {
        btn[0].classList.add("btndown")
        btn[0].classList.remove("btnup")
    }
});

//箭头向下时，点击打开下拉菜单
btndown[0].addEventListener("click", function () {
    //点击事件先判断是否有值，若没有，则打开下拉菜单
    if (!inputElement[0].value) {
        if (output[0].style.height == "420px") {
            output[0].style.height = "470px"
            menu[0].style.height = "7px"
        } else {
            output[0].style.height = "420px"
            menu[0].style.height = "57px"
        }
    }  
});

//客户端连接成功后触发
socket.on('connect', () => {
    //将连接着的昵称传到服务端
    socket.emit('login', JSON.stringify(token))
    while (output[0].firstChild) {  
        output[0].removeChild(output[0].firstChild);
    }
});

//客户端登陆时触发
socket.on('login', (login) => {
    //console.log("登录", login)
    const elements = document.querySelectorAll('.joinin');
    elements.forEach(function (element) {
        element.remove();
    });
    header[0].innerHTML += `<span class="joinin">${login} 已连接</span>`;
    header[0].scrollTop = header[0].scrollHeight;
});

//客户端断开连接时触发
socket.on('disc', (disconnect) => {
    //console.log("断连", disconnect)
    const elements = document.querySelectorAll('.joinin');
    elements.forEach(function (element) {
        element.remove();
    });
    header[0].innerHTML += `<span class="joinin">${disconnect} 已断开</span>`;
    header[0].scrollTop = header[0].scrollHeight;
});

//人数变化
socket.on('count', (connCount) => {
    //console.log(connCount)
    const elements = document.querySelectorAll('.count');
    elements.forEach(function (element) {
        element.remove();
    });
    header[0].innerHTML += `<span class="count">在线人数：${connCount}</span>`;
});

//服务端向客户端发送消息时触发
socket.on('message', (message) => {
    //将字符串转回对象
    //console.log(message)
    let data = JSON.parse(message)
    if (data.room == token.room) {
        if (data.userid == token.id) {
            output[0].innerHTML +=
                `<div class="usertimebox">
                    <div class="sendtime">${data.time}</div>
                    <div class="senduser">${data.nickname}</div>
                </div>
                <div class="selfmessage">${data.message}</div>
                <div class="clear"></div>`;
        } else {
            output[0].innerHTML += 
                `<div class="usertimebox">
                    <div class="senduser">${data.nickname}</div>
                    <div class="sendtime">${data.time}</div>
                </div>
                <div class="othermessage">${data.message}</div>`;
        }
        output[0].scrollTop = output[0].scrollHeight;
    } 
});

//客户端发送消息时触发
sendForm.addEventListener('submit', function (e) {
    e.preventDefault()
    date = new Date().toLocaleString()
    let toSend = { userid: token.id, nickname: token.nickname, message: this.tosend.value, time: date, room: token.room}
    if (toSend.message) {
        socket.emit('message', JSON.stringify(toSend))
    }
    //console.log(toSend.nickname)
    //清空input
    inputElement[0].value = "";
    btn[0].classList.add("btndown")
    btn[0].classList.remove("btnup")
})

//获取元素
let pop = document.getElementsByClassName("pop")[0];
let overlay = document.getElementsByClassName("overlay")[0];
let exit = document.getElementById("exit");
let changeinfo = document.getElementById("changeinfo");
let sendfile = document.getElementById("sendfile");
let sendimg = document.getElementById("sendimg");
let changeroom = document.getElementById("changeroom");

//显示/关闭弹窗
function showPop() {
    //每打开一次 其内部的元素都应该重新加载一遍
    while (pop.firstChild) {  
        pop.removeChild(pop.firstChild);
    }
    pop.style.display = "block";
    overlay.style.display = "block";

    //添加并获取关闭按钮 注册监听事件
    pop.innerHTML += `<div class="closebtn"></div>`;
    pop.addEventListener("click", function (event) {
        if (event.target.classList.contains("closebtn")) {
            hidePop();
        }
    });

    // //添加并获取关闭按钮 注册监听事件
    // pop.innerHTML += `<div class="closebtn"></div>`;
    // let closebtn = pop.querySelector(".closebtn");
    // closebtn.addEventListener("click", function () {
    //     hidePop()
    // });
}

function hidePop() {
    pop.style.display = "none";
    overlay.style.display = "none";
}

//退出登录点击事件
exit.addEventListener("click", function () {
    showPop()
    pop.innerHTML += `<div class="exit">是否确认退出</div>
                      <div class="makesure">
                          <div class="makesurebtn" id="yesbtn">确认</div>
                          <div class="makesurebtn" id="nobtn">取消</div>
                      </div>`;
    let yesbtn = document.getElementById("yesbtn");
    let nobtn = document.getElementById("nobtn");
    yesbtn.addEventListener("click", function () {
        localStorage.clear()
        window.location = '../login/'
    });
    nobtn.addEventListener("click", function () {
        hidePop()
    });
});

//修改信息点击事件
changeinfo.addEventListener("click", function () {
    showPop()
    pop.innerHTML += 
        `<form action="" id="changenameForm">
        <div class="changeinfo">修改昵称</div>
        <input class="changeinfoinput" placeholder="${token.nickname}" name="nickname">
        <button class="makesurechange" type="submit">确认修改</button>
        <div class="clear"></div>
        </form>
        <form action="" id="changepasswordForm">
        <div class="changeinfo">修改密码</div>
        <input class="changeinfoinput" placeholder="原密码" name="nowpassword">
        <input class="changeinfoinput" placeholder="新密码" name="newpassword">
        <button class="makesurechange" type="submit">确认修改</button>
        </form>`;

    //用于检测输入是否有空白符
    function hasWhiteSpace(str) {
        return /\s/g.test(str);
    }

    const changenameForm = document.getElementById("changenameForm")
    changenameForm.addEventListener("submit", function (e) {
        e.preventDefault()
        if (this.nickname.value) {
            //用于判断用户名长度是否在1-12字符之间
            const length = new RegExp('(^.{1,12}$)')
            if (length.test(this.nickname.value) && !hasWhiteSpace(this.nickname.value)) {
                let xhr = new XMLHttpRequest()
                let data = {
                    id: token.id,
                    nickname: this.nickname.value
                }
                let formData = ''
                for (let key in data) {
                    formData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
                }
                formData = formData.slice(0, -1)
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let resData = JSON.parse(this.response)
                        if (resData.status == 0) {
                            token.nickname = data.nickname
                            localStorage.clear()
                            localStorage.setItem("token", JSON.stringify({
                                "id":3,
                                "username":token.nickname,
                                "password":"",
                                "nickname":token.nickname}))
                            let changeinfoinput= document.getElementsByClassName("changeinfoinput")[0]
                            changeinfoinput.value = ""
                            changeinfoinput.placeholder = token.nickname
                            alert("修改成功！\n注意: 昵称修改不会影响用户名,登录时请使用用户名")
                        } else {
                            alert(resData.message)
                        }
                    } 
                }
                xhr.open('POST', 'http://localhost:30017/api/changeNickname', true)
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                xhr.send(formData)
            } else {
                alert("昵称不合法")
            } 
        }
    })
    const changepasswordForm = document.getElementById("changepasswordForm")
    changepasswordForm.addEventListener("submit", function (e) {
        e.preventDefault()
        if (this.nowpassword.value && this.newpassword.value) {
            console.log(456)
            const length = new RegExp('(?=.{6,})')
            if (length.test(this.newpassword.value) && !hasWhiteSpace(this.newpassword.value)) {
                console.log(789)
                let xhr = new XMLHttpRequest()
                let data = {
                    id: token.id,
                    nowpassword: this.nowpassword.value,
                    newpassword: this.newpassword.value
                }
                let formData = ''
                for (let key in data) {
                    formData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&'
                }
                formData = formData.slice(0, -1)
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let resData = JSON.parse(this.response)
                        if (resData.status == 0) {
                            alert("修改密码后需重新登录")
                            localStorage.clear()
                            window.location = "../login"
                        } else {
                            alert(resData.message)
                        }
                    }
                }
                xhr.open('POST', 'http://localhost:30017/api/changePassword', true)
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                xhr.send(formData)
            } else {
                alert("密码长度小于6位或含有非法字符")
            }
        }
    })  
});

//发送文件点击事件
sendfile.addEventListener("click", function () {
    showPop()
});

//发送图片点击事件
sendimg.addEventListener("click", function () {
    showPop()
});

//修改房间点击事件
changeroom.addEventListener("click", function () {
    showPop()
    pop.innerHTML += 
        `<div class="roomhead">
            <div class="roomtitle">房间列表</div>
            <button class="roombtn">搜索房间</button>
        </div>
        <div class="roomlist"></div>
        <div class="roomhead">
            <button class="roombtn">创建房间</button>
            <button class="roombtn">我创建的</button>
        </div>`
    socket.emit("roomlist", JSON.stringify(token))
    
});

socket.on("roomlist", (roomdata) => {
    //console.log(roomdata)
    let roomlist =  document.getElementsByClassName("roomlist")[0]
    if (roomdata) {
        for (let i = 0; i < roomdata.length; i++) {
            let lock = "\uf3c1"
            if (roomdata[i].password) {
                lock = "\uf023"
            }
            roomlist.innerHTML += 
                `<div class="roombox">
                    <div class="roomname">${roomdata[i].roomname}</div>
                    <div class="roomlock">${lock}</div>
                    <div class="roombtn roomjoin" id="${i}">加入</div>
                </div>`  
        }
        let roombtns = document.getElementsByClassName("roomjoin")
        for (let i = 0; i < roombtns.length; i++) {
            roombtns[i].addEventListener("click", () => {
                if (roomdata[i].password) {
                    
                }
                //修改目前所在房间的id值
                token.room = roomdata[i].id
                localStorage.setItem("token", JSON.stringify(token))
                while (output[0].firstChild) {  
                    output[0].removeChild(output[0].firstChild);
                }
                socket.emit("login", JSON.stringify(token))
                hidePop()
            });     
        }
    }
});