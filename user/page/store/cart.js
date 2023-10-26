let person = JSON.parse(localStorage.getItem("person"));
let users = JSON.parse(localStorage.getItem("array"));
let categories = JSON.parse(localStorage.getItem("categories"));
let bills = JSON.parse(localStorage.getItem("bills")) || [];
const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});
if (person.cart.length > 0) {
    render();
} else {
    emptyCart();
}
function render() {
    let cart = "";
    let total = person.cart.reduce((a, b) => a + b.price * b.quantity, 0);
    person.cart.forEach(e => {
        let category = categories.find(item => item.id == e.category);
        cart += `
        <tr>
            <td>${e.id}</td>
            <td>
                <img src="${e.img}" alt="">
            </td>
            <td>${e.name}</td>
            <td>${category.name}</td>
            <td>
                <div class="quantity-change">
                    <button style="cursor:pointer" onclick="decreItem(${e.id})">-</button>
                    <div>${e.quantity}</div>
                    <button style="cursor:pointer" onclick="increItem(${e.id})">+</button>
                </div>
            </td>
            <td>${VND.format(e.price * e.quantity)}</td>
        </tr>
        `
    })
    document.getElementById("tbody").innerHTML = cart;
    document.getElementsByClassName("total-count")[0].innerHTML = VND.format(total);
}
function emptyCart() {
    document.getElementById("tbody").innerHTML = '<td style="text-align: center;" colspan="6">Chưa có sản phẩm</td>';
    document.getElementsByClassName("total-count")[0].innerHTML = VND.format(0);
}
function decreItem(id) {
    let index = person.cart.findIndex(e => e.id == id);
    if (index != -1) {
        const item = person.cart[index];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            let a = confirm("Xoa san pham");
            if (a) {
                person.cart.splice(index, 1);
            }
        }
    }
    person.cart.length > 0 ? render() : emptyCart();
    localStorage.setItem("person", JSON.stringify(person));
}
function increItem(id) {
    let item = person.cart.find(e => e.id == id);
    if (item) {
        item.quantity++;
    }
    render();
    localStorage.setItem("person", JSON.stringify(person));
}
function submitCheckout() {
    if (person.cart.length > 0) {
        document.getElementById("overlay").style.display = "block";
    } else {
        notification("Không có sản phẩm ", "warning");
    }
}
function cancelSm() {
    document.getElementById("overlay").style.display = "none";
}
let askDetail;
function confirmSm() {
    document.getElementsByClassName("confirm-sb")[0].style.display = "none";
    askDetail = document.createElement("div");
    askDetail.innerHTML = `
        <div class="form-sb-bill">
            <label for="phone">Số điện thoại: </label> <br>
            <input type="text" placeholder="Nhập số điện thoại" id="phone"> <br>
            <div class="error" style="display: none"></div> 
            <label for="note"></label>Ghi chú:<br>
            <input type="text" placeholder="Nhập ghi chú" id="note"> <br>
            <button onclick="smBill()">Xác nhận</button>
            <button onclick="cancelSm2()">Hủy</button>
        </div>
    `;
    document.getElementsByClassName("confirm-bill")[0].appendChild(askDetail);
}
function cancelSm2() {
    document.getElementsByClassName("confirm-sb")[0].style.display = "block";
    document.getElementsByClassName("confirm-bill")[0].removeChild(askDetail);
    document.getElementById("overlay").style.display = "none";
}
function smBill() {
    let phone = document.getElementById("phone").value;
    let note = document.getElementById("note").value;
    if (phone == "") {
        document.getElementsByClassName("error")[0].style.display = "block";
        document.getElementsByClassName("error")[0].innerHTML = "Không được để trống";
    } else if (phone.length != 12) {
        document.getElementsByClassName("error")[0].style.display = "block";
        document.getElementsByClassName("error")[0].innerHTML = "Sai định dạng số điện thoại";
    } else {
        document.getElementsByClassName("error")[0].style.display = "none";
        document.getElementsByClassName("error")[0].innerHTML = "";
        let billDetail = {
            id: randomCode(),
            price: person.cart.reduce((a, b) => a + b.price * b.quantity, 0),
            user: person.user,
            username: person.name,
            timeCreated: dateFormat(),
            cart: person.cart,
            phone: phone,
            note: note,
            status: "waiting"
        }
        bills.unshift(billDetail);
        localStorage.setItem("bills", JSON.stringify(bills));
        cancelSm2();
        notification("Mua thành công", "success");
        person.cart = [];
        localStorage.setItem("person", JSON.stringify(person));
        render();
    }
}
function dateFormat() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function randomCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let counter = 0;
    while (counter < 11) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
    }
    return result;
}

function notification(text, type) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text;
    x.className = `show ${type}`;
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
}