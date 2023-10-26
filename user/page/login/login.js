let data = JSON.parse(localStorage.getItem("array"));
let change = false;
const login = (e) => {
    e.preventDefault();
    let obj = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };
    document.getElementsByClassName("error")[0].innerHTML = "";
    document.getElementsByClassName("error")[1].innerHTML = "";
    if (obj.email == "") {
        document.getElementsByClassName("error")[0].innerHTML = "Email trống";
    } else {
        document.getElementsByClassName("error")[0].innerHTML = "";
    }
    if (obj.password == "") {
        document.getElementsByClassName("error")[1].innerHTML = "Password trống";
    } else {
        document.getElementsByClassName("error")[1].innerHTML = "";
    }
    const accIndex = data.findIndex((e) => e.email == obj.email);
    if (accIndex !== -1) {
        const user = data[accIndex];
        if (user.password === obj.password && user.status == "active") {
            if (user.role === "admin") {
                localStorage.setItem("admin", JSON.stringify({ name: user.username }));
                window.location.href = "../../../admin/page/index.html";
            } else {
                localStorage.setItem("person", JSON.stringify({ user: user.email, name: user.username, cart: [] }));
                window.location.href = "../index.html";
            }
        } else if (user.password !== obj.password){
            document.getElementsByClassName("error")[1].innerHTML = "Mật khẩu không đúng";
        } else if (user.status != "active") {
            notification("Tài khoản bị khóa, hãy liên hệ với admin", "warning");
        }
    } else {
        document.getElementsByClassName("error")[0].innerHTML = "Email không tồn tại";
    }
}
document.getElementById("eye").addEventListener("click", () => {
    const password = document.getElementById("password");
    const eyeIcon = document.getElementById("eye");
    if (password.type == "password") {
        password.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        eyeIcon.classList.add("fa-eye");
        eyeIcon.classList.remove("fa-eye-slash");
    }
})
function forgotPw() {
    change = true;
    document.getElementsByClassName("reset-ps")[0].style.display = "inline-block";
    document.getElementById("overlay").style.display = "block";
}

function closeRs() {
    change = false;
    document.getElementsByClassName("reset-ps")[0].style.display = "none";
    document.getElementById("overlay").style.display = "none";
    // Reset the email input field and error message
    document.getElementsByClassName("error")[2].innerHTML = "";
    document.getElementById("resetEmail").value = "";
    // Hide the reset password elements
    document.getElementById("resetEmail").style.display = "block";
    document.getElementById("btn-reset").style.display = "block";
    document.getElementById("de").innerHTML = "Nhập lại email của bạn";
    document.getElementById("resetEmail").nextSibling.remove();
    document.getElementById("resetEmail").nextSibling.remove();
}
function submitReset() {
    let inputVal = document.getElementById("resetEmail").value;
    if (inputVal == "") {
        document.getElementsByClassName("error")[2].innerHTML = "Form can't be empty";
    } else {
        let findIndex = data.findIndex((e) => e.email == inputVal);
        if (findIndex != -1) {
            changePassword(findIndex, inputVal);
        } else {
            document.getElementsByClassName("error")[2].innerHTML = "Email not exist";
        }
    }
}
function changePassword(index, value) {
    document.getElementById("de").innerHTML = `Xin chào ${value}`;
    document.getElementById("resetEmail").style.display = "none";
    document.getElementById("btn-reset").style.display = "none";
    const inputPass = document.createElement("input");
    inputPass.placeholder = "Nhập vào mật khẩu mới";
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm";
    document.getElementById("resetEmail").parentNode.insertBefore(inputPass, document.getElementById("resetEmail").nextSibling);
    document.getElementById("resetEmail").parentNode.insertBefore(confirmButton, inputPass.nextSibling);
    confirmButton.addEventListener("click", function () {
        const newPassword = inputPass.value;
        if (newPassword !== "") {
            data[index].password = newPassword;
            data[index].cfpassword = newPassword;
            closeRs();
            localStorage.setItem("array", JSON.stringify(data));
        } else {
            document.getElementsByClassName("error")[2].innerHTML = "Không được để trống";
        }
    });
}
function notification(text, type) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text;
    x.className = `show ${type}`;
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
}