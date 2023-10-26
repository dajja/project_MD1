let users = JSON.parse(localStorage.getItem("array")) || [];
const formSub = (e) => {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let cfpassword = document.getElementById("cfpassword").value;
    let person = {
        id: uuId(),
        username: username,
        email: email,
        password: password,
        cfpassword: cfpassword,
        avatar: '',
        created: dateFormat(),
        role: "user",
        status: 'active',
        bill: [],
    }
    checkExist(person);
}
function checkExist(value) {
    const existEmail = users.find((e) => e.email == value.email);
    const re = /\S+@\S+\.\S+/;
    if (!existEmail && re.test(value.email) && value.password == value.cfpassword && value.password != "" && value.cfpassword != "") {
        users.push(value);
        localStorage.setItem("array", JSON.stringify(users));
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        document.getElementById("cfpassword").value = "";
        document.getElementById("username").value = "";
        window.location.href = "../login/login.html";
    }
    if (value.username == "") {
        document.getElementsByClassName("error")[0].innerText = "Tên trống";
    } else {
        document.getElementsByClassName("error")[0].innerText = "";
    }
    if (value.email == "") {
        document.getElementById("error").innerText = "Email trống";
    } else if (!re.test(value.email)) {
        document.getElementById("error").innerText = "Email sai định dạng";
    } else if (existEmail) {
        document.getElementById("error").innerText = "Email đẫ tồn tại";
    } else {
        document.getElementById("error").innerText = "";
    }
    if (value.password !== value.cfpassword) {
        document.getElementsByClassName("error")[2].innerHTML = "Mật khẩu không trùng khớp";
        document.getElementsByClassName("error")[1].innerHTML = "";
    } else if (value.password == "") {
        document.getElementsByClassName("error")[1].innerHTML = "Mật khẩu trống";
    } else if (value.cfpassword == "") {
        document.getElementsByClassName("error")[2].innerHTML = "Mật khẩu trống";
    } else {
        document.getElementsByClassName("error")[1].innerHTML = "";
        document.getElementsByClassName("error")[2].innerHTML = "";
    }
}
document.getElementById("eye1").addEventListener("click", () => {
    let eye = document.getElementById("eye1");
    let password = document.getElementById("password");
    if (password.type == "password") {
        password.type = "text";
        eye.classList.add("fa-eye-slash");
        eye.classList.remove("fa-eye");
    } else {
        password.type = "password";
        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");
    }
})
document.getElementById("eye2").addEventListener("click", () => {
    let eye = document.getElementById("eye2");
    let cfpassword = document.getElementById("cfpassword");
    if (cfpassword.type == "password") {
        cfpassword.type = "text";
        eye.classList.add("fa-eye-slash");
        eye.classList.remove("fa-eye");
    } else {
        cfpassword.type = "password";
        eye.classList.remove("fa-eye-slash");
        eye.classList.add("fa-eye");
    }
})
function dateFormat() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
const uuId = () => {
    return Math.floor(Math.random() * 1000000) + new Date().getMilliseconds();
}