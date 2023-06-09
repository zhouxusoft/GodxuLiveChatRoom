//拿到登录的token
//判断值是否为空
let token = JSON.parse(localStorage.getItem("token"))

//设置时间
let date = new Date()

// 用于存储文件下载链接和文件名
let filesrc = []
let filenamelist = []

//用于存储图片的高度
let imgshowheight = []
            
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
let zoom = mediumZoom('[data-zoomable]')

//获取输入框，用于判断其内部的内容
//获取发送按钮
let inputElement = document.getElementsByClassName("input");
let btn = document.getElementsByClassName("btn");
let btndown = document.getElementsByClassName("btndown");

//获取房间名显示元素
let roomtoptitle = document.getElementById("roomtoptitle");

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
    //检测房间状态
    changeRoomTitle()

    //判断用户是否在房间内
    if (data.room == token.room) {
        //判断消息是否为图片
        if (data.message.startsWith("$img$src=")) {
            let imgwidth = parseInt(data.message.match(/\$width=([\s\S]*?)\$height=/)[1])
            let imgheight = parseInt(data.message.split("$height=")[1])
            if (imgwidth <= 240) {
                imgshowheight.push(imgheight)
            } else {
                imgshowheight.push(parseInt(240 * imgheight / imgwidth))
            }
            data.message = data.message.match(/\$img\$src=([\s\S]*?)\$width=/)[1]
            if (data.userid == token.id) {
                output[0].innerHTML +=
                    `<div class="usertimebox">
                        <div class="sendtime">${data.time}</div>
                        <div class="senduser">${data.nickname}</div>
                    </div>
                    <div class="selfmessageimg">
                        <img class="myimg" data-zoomable data-zoom-src="${data.message}" src="${data.message}" referrerPolicy="no-referrer">
                    </div>
                    <div class="clear"></div>`;
            } else {
                output[0].innerHTML +=
                    `<div class="usertimebox">
                        <div class="senduser">${data.nickname}</div>
                        <div class="sendtime">${data.time}</div>
                    </div>
                    <div class="othermessageimg">
                        <img class="myimg" data-zoomable data-zoom-src="${data.message}" src="${data.message}" referrerPolicy="no-referrer">
                    </div>`;
            }
            let myimg = document.getElementsByClassName("myimg")
            for (let i = 0; i < myimg.length; i++) {
                // console.log(imgshowheight[i])
                myimg[i].height = imgshowheight[i]
            }
            
        } else if (data.message.startsWith("$file$name=")) {
            filesrc.push(data.message.split("$src=")[1])
            data.message = data.message.match(/\$file\$name=([\s\S]*?)\$src=/)[1]
            filenamelist.push(data.message)
            if (data.userid == token.id) {
                output[0].innerHTML +=
                    `<div class="usertimebox">
                        <div class="sendtime">${data.time}</div>
                        <div class="senduser">${data.nickname}</div>
                    </div>
                    <div class="selfmessage filemessage download" title="点击下载">${data.message}</div>
                    <div class="clear"></div>`;
            } else {
                output[0].innerHTML +=
                    `<div class="usertimebox">
                        <div class="senduser">${data.nickname}</div>
                        <div class="sendtime">${data.time}</div>
                    </div>
                    <div class="othermessage filemessage download" title="点击下载">${data.message}</div>`;
            }
            // console.log(filesrc) 
        } else {
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
        }
        let filemessage = document.getElementsByClassName("filemessage")
        for (let i = 0; i < filemessage.length; i++) {
            filemessage[i].addEventListener("click", () => {
                showPop()
                pop.innerHTML += `
                    <div class="makesuresendimage">是否确认下载</div>
                    <div class="filebox">
                        <div class="filelogo">\uf15b</div>
                        <div class="filename">${filenamelist[i]}</div>
                    </div>
                    <div class="makesure">
                        <div class="makesurebtn" id="yesbtn">确认</div>
                        <div class="makesurebtn" id="nobtn">取消</div>
                    </div>`;
                let yesbtn = document.getElementById("yesbtn");
                let nobtn = document.getElementById("nobtn");
                //点击确认发送
                yesbtn.addEventListener("click", function () {
                    hidePop()
                    let downloadUrl = 'http://sharewh1.xuexi365.com/share/download/' + filesrc[i];
                    var iframe_box = document.querySelector('#iframe_box')
                    while (iframe_box.firstChild) {
                        iframe_box.removeChild(iframe_box.firstChild);
                    }
                    iframe_box.innerHTML = iframe_box.innerHTML + '<iframe src="' + downloadUrl + '"><iframe>'
                });
                nobtn.addEventListener("click", function () {
                    hidePop()
                });
            })
        }
        zoom = mediumZoom('[data-zoomable]', {
            margin: 24,
            background: 'rgba(25, 18, 25, 0.9)',
        })
        output[0].scrollTop = output[0].scrollHeight;
    }
});

//服务端返回房间名
socket.on('roomtitle', (roomdata) => {
    if (roomdata.length > 0) {
        roomtoptitle.textContent = roomdata[0].roomname
    } else {
        roomtoptitle.textContent = "当前房间已被解散"
    }
});

//客户端发送消息时触发
sendForm.addEventListener('submit', function (e) {
    e.preventDefault()
    date = new Date().toLocaleString()
    let toSend = { userid: token.id, nickname: token.nickname, message: this.tosend.value, time: date, room: token.room }
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
let pop2 = document.getElementsByClassName("pop2")[0];
let overlay = document.getElementsByClassName("overlay")[0];
let overlay2 = document.getElementsByClassName("overlay2")[0];
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
}

function showPop2() {
    //每打开一次 其内部的元素都应该重新加载一遍
    while (pop2.firstChild) {
        pop2.removeChild(pop2.firstChild);
    }
    pop2.style.display = "block";
    overlay2.style.display = "block";

    //添加并获取关闭按钮 注册监听事件
    pop2.innerHTML += `<div class="closebtn"></div>`;
    pop2.addEventListener("click", function (event) {
        if (event.target.classList.contains("closebtn")) {
            hidePop2();
        }
    });

}

function hidePop() {
    pop.style.display = "none";
    overlay.style.display = "none";
}

function hidePop2() {
    pop2.style.display = "none";
    overlay2.style.display = "none";
}

//用于检测输入是否有空白符
function hasWhiteSpace(str) {
    return /\s/g.test(str);
}

//用于更改切换房间后的房间名显示
function changeRoomTitle() {
    socket.emit("roomtitle", JSON.stringify(token))
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
        <input class="changeinfoinput" placeholder="${token.nickname}" name="nickname" autocomplete="off">
        <button class="makesurechange" type="submit">确认修改</button>
        <div class="clear"></div>
        </form>
        <form action="" id="changepasswordForm">
        <div class="changeinfo">修改密码</div>
        <input class="changeinfoinput" placeholder="原密码" name="nowpassword" autocomplete="off">
        <input class="changeinfoinput" placeholder="新密码" name="newpassword" autocomplete="off">
        <button class="makesurechange" type="submit">确认修改</button>
        </form>`;

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
                                "id": 3,
                                "username": token.nickname,
                                "password": "",
                                "nickname": token.nickname
                            }))
                            let changeinfoinput = document.getElementsByClassName("changeinfoinput")[0]
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

//发送文件点击事件 调用超星的文件上传接口  
sendfile.addEventListener("click", function () {
    var fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.name = 'file';

    fileInput.onchange = function () {
        let file = this.files[0];
        // console.log(file.name)
        // console.log(file.size)
        // console.log(file.type)
        // console.log(file.lastModified)

        //选择好图片后进入预览，选择是否发送
        showPop()
        pop.innerHTML += `
            <div class="makesuresendimage">是否确认发送</div>
            <div class="filebox">
                <div class="filelogo">\uf15b</div>
                <div class="filename">${file.name}</div>
            </div>
            <div class="makesure">
                <div class="makesurebtn" id="yesbtn">确认</div>
                <div class="makesurebtn" id="nobtn">取消</div>
            </div>`;
        
        let yesbtn = document.getElementById("yesbtn");
        let nobtn = document.getElementById("nobtn");
        //点击确认发送
        yesbtn.addEventListener("click", function () {
            hidePop()
            let formData = new FormData()
            // 将文件对象添加到formData对象中
            formData.append('file', file)
            formData.append('name', file.name)
            formData.append('_token', '99ad00c891d3e9e9bc9a613314ef9890')
            formData.append('puid', '198665227')

            // console.log(formData.get("file"))

            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    let resData = JSON.parse(this.response)
                    let filemessage = "$file$name=" + file.name + "$src=" + resData.data.objectId
                    let toSend = { userid: token.id, nickname: token.nickname, message: filemessage, time: date, room: token.room }
                    if (toSend.message) {
                        socket.emit('message', JSON.stringify(toSend))
                    }
                }
            };
            xhr.open('POST', 'http://pan-yz.chaoxing.com/upload/uploadfile?fldid=851576482269757440', true)
            xhr.send(formData)
        });
        nobtn.addEventListener("click", function () {
            hidePop()
        });
    };
    //自动触发input的点击事件
    fileInput.click();
});

//发送图片点击事件 调用超星的文件上传接口
sendimg.addEventListener("click", function () {
    var fileInput = document.createElement('input');

    let imgwidth = 0
    let imgheight = 0

    fileInput.type = 'file';
    fileInput.name = 'img';
    fileInput.accept = 'image/bmp,image/heic,image/heif,image/jpeg,image/png,image/webp,image/x-icon'

    fileInput.onchange = function () {
        let file = this.files[0];
        // console.log(file.name)
        // console.log(file.size)
        // console.log(file.type)
        // console.log(file.lastModified)

        //选择好图片后进入预览，选择是否发送
        showPop()
        pop.innerHTML += `
            <div class="makesuresendimage">是否确认发送</div>
            <div class="imgbox">
                <img id="myimg">
            </div>
            <div class="makesure">
                <div class="makesurebtn" id="yesbtn">确认</div>
                <div class="makesurebtn" id="nobtn">取消</div>
            </div>`;
        //本地获取要发送的图片 显示在dom中
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            // 将文件转换为base64编码的字符串
            const imageDataUrl = reader.result;
            // 获取img元素并设置src属性
            const imgElement = document.getElementById("myimg");
            imgElement.src = imageDataUrl;

            //新建一个img对象，用于获取图片的宽高
            let img = new Image();
            img.src = reader.result;
            img.onload = function() {
                imgwidth = img.width
                imgheight = img.height
                // console.log(imgheight, imgwidth)
            };
        });
        reader.readAsDataURL(file);
        let yesbtn = document.getElementById("yesbtn");
        let nobtn = document.getElementById("nobtn");
        //点击确认发送
        yesbtn.addEventListener("click", function () {
            hidePop()
            let formData = new FormData()
            // 将文件对象添加到formData对象中
            formData.append('file', file)
            formData.append('name', file.name)
            formData.append('_token', '99ad00c891d3e9e9bc9a613314ef9890')
            formData.append('puid', '198665227')

            // console.log(formData.get("file"))

            let xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    let resData = JSON.parse(this.response)
                    // console.log(6, imgheight, imgwidth)
                    let imgmessage = "$img$src=" + resData.data.previewUrl + "$width=" + imgwidth + "$height=" + imgheight
                    let toSend = { userid: token.id, nickname: token.nickname, message: imgmessage, time: date, room: token.room }
                    if (toSend.message) {
                        socket.emit('message', JSON.stringify(toSend))
                    }
                }
            };
            xhr.open('POST', 'http://pan-yz.chaoxing.com/upload/uploadfile?fldid=848684910924488704', true)
            xhr.send(formData)
        });
        nobtn.addEventListener("click", function () {
            hidePop()
        });
    };
    //自动触发input的点击事件
    fileInput.click();
});

//修改房间点击事件
changeroom.addEventListener("click", function () {
    showPop()
    pop.innerHTML +=
        `<div class="roomhead">
            <div class="roomtitle">房间列表</div>
            <button class="roombtn" id="searchroom">搜索房间</button>
        </div>
        <div class="roomlist"></div>
        <div class="roomhead">
            <button class="roombtn" id="createroom">创建房间</button>
            <button class="roombtn" id="myroom">我创建的</button>
        </div>`
    socket.emit("roomlist", JSON.stringify(token))
    let myroom = document.getElementById("myroom")
    let createroom = document.getElementById("createroom")
    let searchroom = document.getElementById("searchroom")
    myroom.addEventListener("click", function () {
        if (myroom.textContent == '我创建的') {
            socket.emit("myroom", JSON.stringify(token))
            myroom.textContent = '所有房间'
        } else {
            socket.emit('roomlist', JSON.stringify(token))
            myroom.textContent = '我创建的'
        }
    });
    createroom.addEventListener("click", function () {
        showPop2()
        pop2.innerHTML +=
            `<form action="" id="createroomForm">
            <div class="changeinfo">房间名称</div>
            <input class="roominput" placeholder="不超过七个字符" name="roomname" autocomplete="off">
            <div class="changeinfo">房间密码</div>
            <input class="roominput" placeholder="可以为空" name="roompassword" autocomplete="off">
            <button class="makesurechange" type="submit">确认创建</button>
            <div class="clear"></div>
            </form>`
        const createroomForm = document.getElementById("createroomForm")
        createroomForm.addEventListener('submit', function (e) {
            e.preventDefault()
            if (this.roomname.value) {
                //判断是否再7个字符之内
                const length = new RegExp('(^.{1,7}$)')
                if (length.test(this.roomname.value) && !hasWhiteSpace(this.roomname.value)) {
                    const createrinfo = {
                        createrid: token.id,
                        roomname: this.roomname.value,
                        password: this.roompassword.value
                    }
                    socket.emit("createroom", JSON.stringify(createrinfo))
                    hidePop2()
                    alert("创建成功")
                    if (myroom.textContent == '我创建的') {
                        socket.emit('roomlist', JSON.stringify(token))
                    } else {
                        socket.emit("myroom", JSON.stringify(token))
                    }
                } else {
                    alert("房间名称不合法")
                }
            }
        });
    });
    searchroom.addEventListener("click", function () {
        showPop2()
        pop2.innerHTML +=
            `<div class="roomtitle">搜索房间</div>
            <form action="" id="searchroomForm">
            <input class="roominput" name="searchroominput" autocomplete="off">
            <div class="makesure">
                <button class="makesurebtn" type="submit" id="yessearchroom">确认</button>
                <button class="makesurebtn" type="button" id="nosearchroom">取消</button>
            </div>
            </form>`
        let searchroomForm = document.getElementById("searchroomForm")
        let nosearchroom = document.getElementById("nosearchroom")
        searchroomForm.addEventListener('submit', function (e) {
            e.preventDefault()
            hidePop2()
            socket.emit('searchroom', this.searchroominput.value)
            myroom.textContent = "显示全部"
        });
        nosearchroom.addEventListener("click", function () {
            hidePop2()
        });
    })
});

socket.on("roomlist", (roomdata) => {
    //console.log(roomdata)
    let roomlist = document.getElementsByClassName("roomlist")[0]
    //每打开一次 其内部的元素都应该重新加载一遍
    while (roomlist.firstChild) {
        roomlist.removeChild(roomlist.firstChild);
    }
    if (roomdata.length > 0) {
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
                    showPop2()
                    pop2.innerHTML +=
                        `<div class="roomtitle">输入密码</div>
                        <form action="" id="roompasswordForm">
                        <input class="roominput" name="roompassword" autocomplete="off">
                        <div class="makesure">
                          <button class="makesurebtn" type="submit">确认</button>
                          <button class="makesurebtn" type="button" id="noroompassword">取消</button>
                        </div>
                        </form>`
                    let noroompassword = document.getElementById("noroompassword")
                    noroompassword.addEventListener("click", function () {
                        hidePop2()
                    });
                    const roompasswordForm = document.getElementById("roompasswordForm")
                    roompasswordForm.addEventListener('submit', function (e) {
                        e.preventDefault()
                        if (this.roompassword.value) {
                            if (this.roompassword.value == roomdata[i].password) {
                                //修改目前所在房间的id值
                                token.room = roomdata[i].id
                                localStorage.setItem("token", JSON.stringify(token))
                                while (output[0].firstChild) {
                                    output[0].removeChild(output[0].firstChild);
                                }
                                socket.emit("login", JSON.stringify(token))
                                changeRoomTitle()
                                hidePop2()
                                hidePop()
                            } else {
                                alert("密码错误")
                            }
                        }
                    })
                } else {
                    //修改目前所在房间的id值
                    token.room = roomdata[i].id
                    localStorage.setItem("token", JSON.stringify(token))
                    while (output[0].firstChild) {
                        output[0].removeChild(output[0].firstChild);
                    }
                    socket.emit("login", JSON.stringify(token))
                    hidePop()
                    changeRoomTitle()
                }
            });
        }
    } else {
        roomlist.innerHTML +=
            `<div class="roombox">
                <div class="roomname">无结果</div>
            </div>`
    }
});

socket.on("myroom", (roomdata) => {
    //console.log(roomdata)
    let roomlist = document.getElementsByClassName("roomlist")[0]
    //每打开一次 其内部的元素都应该重新加载一遍
    while (roomlist.firstChild) {
        roomlist.removeChild(roomlist.firstChild);
    }
    if (roomdata.length > 0) {
        for (let i = 0; i < roomdata.length; i++) {
            let lock = "\uf3c1"
            if (roomdata[i].password) {
                lock = "\uf023"
            }
            roomlist.innerHTML +=
                `<div class="roombox">
                    <div class="roomname">${roomdata[i].roomname}</div>
                    <div class="roomlock">${lock}</div>
                    <div class="roombtn roomdel" id="${i}">解散</div>
                </div>`
        }
        let roombtns = document.getElementsByClassName("roomdel")
        for (let i = 0; i < roombtns.length; i++) {
            roombtns[i].addEventListener("click", () => {
                showPop2()
                pop2.innerHTML +=
                    `<div class="exit">是否确认解散</div>
                    <div class="makesure">
                        <button class="makesurebtn" type="submit" id="yesroomdel">确认</button>
                        <button class="makesurebtn" type="button" id="noroomdel">取消</button>
                    </div>`
                let yesroomdel = document.getElementById("yesroomdel")
                let noroomdel = document.getElementById("noroomdel")
                yesroomdel.addEventListener("click", function () {
                    socket.emit("delroom", JSON.stringify(roomdata[i]))
                    hidePop2()
                });
                noroomdel.addEventListener("click", function () {
                    hidePop2()
                });
            });
        }
    } else {
        roomlist.innerHTML +=
            `<div class="roombox">
                <div class="roomname">无结果</div>
            </div>`
    }
});

//添加滚动事件 退出图片预览
document.body.addEventListener("wheel", () => {
    zoom.close()
})