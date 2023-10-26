let users = JSON.parse(localStorage.getItem("array"));
let person = JSON.parse(localStorage.getItem("person"));
let bills = JSON.parse(localStorage.getItem("bills")) || [];
let account = users.find((e) => e.email == person.user);
let userBills = bills.filter(e => e.user == person.user);
const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});
function tableBill() {
    let table = "";
    if (userBills.length > 0) {
        userBills.map((e) => {
            let arr = [];
            let status;
            if (e.status == "waiting") {
                status = "Chờ duyệt";
            } else if (e.status == "denied") {
                status = "Hủy đơn";
            } else if (e.status == "accepted") {
                status = "Đã duyệt";
            }
            e.cart.forEach((i) => arr.push(`${i.name} x${i.quantity}`));
            table += `
                <tr>
                    <td>${e.id}</td>
                    <td>${arr.join("<br>")}</td>
                    <td>${VND.format(e.price)}</td>
                    <td>${e.timeCreated}</td>
                    <td>${e.note}</td>
                    <td>${status}</td>
                    <td style="${e.status != "waiting" ? "display: none" : ""}">
                        <button onclick="destroyBill('${e.id}')">Hủy đơn</button>
                    </td>
                </tr>
            `
        })
    } else {
        table += `<td colspan="6" style="text-align: center;">Chưa có đơn hàng</td>`
    }
    document.getElementById("table-bill").innerHTML = table;
};
tableBill();
document.getElementById("name").value = `${account.username}`;
document.getElementById("email").value = `${account.email}`;
function changeImage(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        account.avatar = reader.result;
        localStorage.setItem("array", JSON.stringify(users));
        readerImage()
    }
    reader.readAsDataURL(file);
}
function readerImage() {
    document.getElementById("changeImg").src = account.avatar || 'https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg';
}
readerImage();
function changePassword() {
    document.getElementsByClassName("reset-ps")[0].style.display = "inline-block";
    document.getElementById("overlay").style.display = "block";
    document.getElementsByClassName("reset-info")[0].style.display = "block";
}
function closeRs() {
    document.getElementsByClassName("reset-ps")[0].style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementsByClassName("error")[0].innerHTML = "";
}
function resetInformation() {
    let username = document.getElementById("name").value;
    account.username = username;
    notification("Thay đổi thành công", "success");
    localStorage.setItem("array", JSON.stringify(users));
}
function submitReset() {
    let value = document.getElementById("newPass").value;
    if (value == "") {
        document.getElementsByClassName("error")[0].innerHTML = "Không được để trống";
    } else {
        account.password = value;
        account.cfpassword = value;
        let again = confirm("Xác nhận muốn đổi");
        if (again) {
            localStorage.setItem("array", JSON.stringify(users));
            document.getElementById("newPass").value = "";
            document.getElementsByClassName("error")[0].innerHTML = "";
            document.getElementsByClassName("reset-info")[0].style.display = "none";
            let alert = document.createElement("div");
            alert.innerHTML = "Thay đổi thành công, tự động đăng xuất";
            document.getElementsByClassName("reset-ps")[0].appendChild(alert);
            setTimeout(() => {
                closeRs();
                alert.remove();
                localStorage.removeItem("person");
                window.location.href = "../login/login.html";
            }, 1000);
        }
    }
}
function destroyBill(id) {
    let index = bills.findIndex(e => e.id == id);
    let confirmDn = confirm("Xác nhận hủy đơn?");
    if (confirmDn) {
        bills[index].status = "denied";
        localStorage.setItem("bills", JSON.stringify(bills));
        tableBill();
    }
}
function notification(text, type) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text;
    x.className = `show ${type}`;
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
}