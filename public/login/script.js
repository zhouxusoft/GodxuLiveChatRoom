let passwords = document.querySelectorAll('.passwordBox')
let logoButtons = document.querySelectorAll('.logoButton')
for (let i = 0; i < logoButtons.length; i++) {
    logoButtons[i].onclick = function () {
        if (passwords[i].type === 'password') {
            passwords[i].setAttribute('type', 'text')
            logoButtons[i].classList.add('hide')
        }
        else {
            passwords[i].setAttribute('type', 'password')
            logoButtons[i].classList.remove('hide')
        }
    }
}

const loginForm = document.getElementById('loginForm')

loginForm.addEventListener('submit', function (e) {

    e.preventDefault()
    let xhr = new XMLHttpRequest()
    let data = {
        username: this.username.value,
        password: this.password.value
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
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(resData.token))
                window.location = 'http://localhost:30018/'
            } else {
                alert(resData.message)
            }
        } 
    }
    xhr.open('POST', '/api/login', true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(formData)
})