const users = JSON.parse(localStorage.getItem("array"));
const productsArr = JSON.parse(localStorage.getItem("products")) || [];
const admin = JSON.parse(localStorage.getItem("admin"));
const bills = JSON.parse(localStorage.getItem("bills"));
let category = JSON.parse(localStorage.getItem("categories")) || [];
if (!admin) {
    window.location.href = "../../user/page/login/login.html";
    localStorage.removeItem("person");
}
let where = "user";
let currentPageUser = 1; // >> A hoang
let currentPageProduct = 1; // >>
let currentPageOrder = 1;
let itemsPerPage = 10;
let itemsProductPerPage = 8;
let itemsOrderPerPage = 5;
let minPage = 1;
let totalPageUser;// >>
let totalPageProduct; // >>
let totalPageOrder;
let start;
let end;
const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});
document.getElementById("admin").innerHTML = `Xin chào, <div style="text-decoration: underline; cursor: default">${admin.name}</div>`;
function signOut() {
    const result = confirm("Xác nhận đăng xuất ?");
    if (result) {
        localStorage.removeItem("admin");
        window.location.href = "../../user/page/login/login.html";
    }
}
// click thay doi
document.querySelectorAll(".sidebar-manage-box").forEach((e, i) => {
    e.addEventListener("click", () => {
        switch (i) {
            case 0:
                where = "user";
                userManage();
                render(users);
                break;
            case 1:
                where = "product";
                productsManage();
                renderProducts();
                break;
            case 2:
                where = "order";
                orderManage();
                renderOrder();
                break;
            default:
        }
    })
})
// User
function userManage() {
    document.getElementsByClassName("main-content")[0].innerHTML = `
                    <div class="main-content-user">
                            <div class="main-content-1">
                            <div class="header-content">QUẢN LÝ NGƯỜI DÙNG</div>
                            <div class="main-content-sort">
                                <div class="main-content-sort-filter">
                                    <input type="text" placeholder="Nhập từ khoá" id="searchElement">
                                    <button onclick="search()">Tìm kiếm</button>
                                </div>
                            </div>
                        </div>
                        <div class="main-content-2">
                            <table>
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên đăng nhập</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Thời gian tạo</th>
                                        <th>Tình trạng</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="table-body">
                                </tbody>
                            </table>
                            <div class="paginate">
                                <div class="paginate-info"></div>
                                <div id="paginate-page">
                                </div>
                            </div>
                        </div>
                    </div>
    `
}
userManage();
// render table user
function render(data) {
    totalPageUser = Math.ceil(data.length / itemsPerPage);
    start = (currentPageUser - 1) * itemsPerPage;
    end = currentPageUser * itemsPerPage;
    end = Math.min(end, data.length);
    let text = "";
    for (let i = start; i < end; i++) {
        text += `
            <tr>
                <td>${i + 1}</td>
                <td>${data[i].username}</td>
                <td>${data[i].email}</td>
                <td>${data[i].role == "admin" ? "Quản trị viên" : "Khách hàng"}</td>
                <td>${data[i].created || ""}</td>
                <td>
                    <div class="active-info">
                        <div id="status" class="${data[i].status == "active" ? 'active-icon' : 'unactive-icon'}"></div>
                        <div>${data[i].status == "active" ? "Đang hoạt động" : "Không hoạt động"}</div>
                    </div>
                </td>
                <td>
                    <button class="btn-edit" ${data[i].username == "ADMIN" ? 'disabled' : ''} onclick="editUser('${data[i].id}')">Xem</button>
                    <button class="btn-status" ${data[i].username == "ADMIN" ? 'disabled' : ''} onclick="changeStatus('${data[i].email}')">${data[i].status == "active" ? 'Ban' : 'Unban'}</button>
                </td>
            </tr>
        `
    }
    if (currentPageUser == 1) {
        // document.getElementsByClassName("btn-prev")[0].disabled = true;
    }
    document.getElementById("table-body").innerHTML = text;
    document.getElementsByClassName("paginate-info")[0].innerHTML = `Trang ${currentPageUser} /${totalPageUser}`;
    paginationUser();
}
render(users);

function changeStatus(value) {
    const acc = users.find((e) => e.email == value);
    acc.status == "active" ? acc.status = "unactive" : acc.status = "active";
    render(users);
    localStorage.setItem("array", JSON.stringify(users));
}
//  chinh sua user
let formEditUser;
function editUser(value) {
    const acc = users.find((e) => e.id == value);
    document.getElementsByClassName("main-content-user")[0].style.display = "none";
    formEditUser = document.createElement("div");
    formEditUser.innerHTML = `
        <div class="main-content-1">
            <div class="header-content">CHỈNH SỬA NGƯỜI DÙNG</div>
            <div class="form-edit-user">
                <form id="editUserForm" onsubmit="editForm(event,'${acc.id}')">
                    <label for="username">Tên đăng nhập:</label> <br>
                    <input type="text" id="username" disabled value="${acc.username}"><br>
                    <label for="email">Email:</label> <br>
                    <input type="email" id="email" disabled value="${acc.email}"><br>
                    <label for="role">Role:</label>
                    <select id="role" required>
                        <option value="admin" ${acc.role === 'admin' ? 'selected' : ''}>Quản trị viên</option>
                        <option value="user" ${acc.role === 'user' ? 'selected' : ''}>Khách hàng</option>
                    </select><br>
                    <label for="image">Avatar:</label> <br>
                    <img src="${acc.avatar ? acc.avatar : 'https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg'}" alt="" id="image"> <br>
                    <button type="submit">Confirm</button>
                </form>
            </div>
        </div>
    `;
    document.getElementsByClassName("main-content")[0].appendChild(formEditUser);
}
function editForm(e, val) {
    e.preventDefault();
    const index = users.findIndex((e) => e.id == val);
    users[index].role = document.getElementById("role").value;
    localStorage.setItem("array", JSON.stringify(users));
    render(users);
    document.getElementsByClassName("main-content-user")[0].style.display = "block";
    document.getElementsByClassName("main-content")[0].removeChild(formEditUser);
}

// tim kiem 
function search() {
    let input = document.getElementById("searchElement").value;
    let filterData = users.filter((val) => val.username.includes(input.toLowerCase()) || val.email.includes(input.toLowerCase()));
    render(filterData);
}

// product
let formProduct;
let imgDefault = "https://www.nettl.com/global/images/PublicShop/ProductSearch/prodgr_default_300.png";
function productsManage() {
    document.getElementsByClassName("main-content")[0].innerHTML = `
                    <div class="main-content-product">
                            <div class="main-content-1">
                            <div class="header-content">QUẢN LÝ SẢN PHẨM</div>
                            <div class="main-content-sort">
                                <div class="main-content-sort-filter">
                                    <input type="text" placeholder="Nhập từ khoá">
                                    <button>Tìm kiếm</button>
                                </div>
                                <button onclick="addCategory()">Thêm mới loại</button>
                                <button onclick="addNewProduct()">Thêm mới</button>
                            </div>
                        </div>
                        <div class="main-content-2">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Mã sản phẩm</th>
                                        <th>Ảnh sản phẩm</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Đơn giá</th>
                                        <th>Phân loại</th>
                                        <th>Số lượng</th>
                                        <th>Thời gian tạo</th>
                                        <th>Thời gian cập nhật</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="table-body">
                                </tbody>
                            </table>
                            <div class="paginate">
                                <div class="paginate-info"></div>
                                <div id="paginate-page">
                                </div>
                            </div>
                        </div>
                    </div>
    `
}
// them moi san pham
let flagProduct = true;
function addNewProduct() {
    document.getElementsByClassName("main-content-product")[0].style.display = "none";
    formProduct = document.createElement("div");
    formProduct.innerHTML = `
        <div class="main-content-1">
            <div class="header-content">THÊM MỚI SẢN PHẨM</div>
            <div class="form-add-product">
                <form id="newProductForm" onsubmit="product(event)">
                    <label for="productname">Tên sản phẩm:</label> <br>
                    <input type="text" id="productname" autocomplete="off"> <br>
                    <label for="producttype">Loại sản phẩm:</label> <br>
                    <select id="producttype">
                        <option value="">Chọn loại sản phẩm</option>
                    </select> <br>
                    <label for="image">Ảnh sản phẩm:</label> <br>
                    <img src="${imgDefault}" alt="" id="image"> <br>
                    <input type="file" name="image" onchange="changeImage(this,'')"> <br> 
                    <label for="productprice">Giá sản phẩm:</label> <br>
                    <input type="text" id="productprice" autocomplete="off"> <br>
                    <label for="productquantity">Số lượng:</label> <br>
                    <input type="text" id="productquantity" autocomplete="off"> <br>
                    <button type="submit">Confirm</button>
                </form>
            </div>
        </div>
    `;
    document.getElementsByClassName("main-content")[0].appendChild(formProduct);
    category.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        document.getElementById("producttype").appendChild(option);
    })
    flagProduct = true;
}
let idUp;
let timeCreated;
function product(e) {
    e.preventDefault();
    let productName = document.getElementById("productname").value;
    let productCate = document.getElementById("producttype").value;
    let productImg = document.getElementById("image").src;
    let productPrice = document.getElementById("productprice").value;
    let productQuantity = document.getElementById("productquantity").value;
    let oneProduct = {
        code: makeCode(),
        image: productImg,
        name: productName,
        price: productPrice,
        category: productCate,
        quantity: productQuantity,
        timeCreated: dateFormat(),
        timeChange: dateFormat(),
    }
    if (flagProduct) {
        checkExistProduct(oneProduct);
    } else {
        let oneProduct = {
            code: idUp,
            image: productImg,
            name: productName,
            price: productPrice,
            category: productCate,
            quantity: productQuantity,
            timeCreated: timeCreated,
            timeChange: dateFormat(),
        }
        checkEditProduct(oneProduct);
    }
}
function renderProducts() {
    totalPageProduct = Math.ceil(productsArr.length / itemsProductPerPage);
    start = (currentPageProduct - 1) * itemsProductPerPage;
    end = currentPageProduct * itemsProductPerPage;
    end = Math.min(end, productsArr.length);
    let text = "";
    for (let i = start; i < end; i++) {
        text += `
            <tr class="tr-product">
                <td>${productsArr[i].code}</td>
                <td>
                    <div class="img-product">
                        <img src="${productsArr[i].image}" alt="">
                    </div>
                </td>
                <td>${productsArr[i].name}</td>
                <td>${VND.format(productsArr[i].price)}</td>
                <td>${productsArr[i].category}</td>
                <td>${productsArr[i].quantity}</td>
                <td>${productsArr[i].timeCreated}</td>
                <td>${productsArr[i].timeChange}</td>
                <td>
                    <button onclick="editProduct('${productsArr[i].code}')">Sửa</button>
                    <button onclick="deleteProduct('${productsArr[i].code}')">Xóa</button>
                </td>
            </tr>
        `
    }
    document.getElementById("table-body").innerHTML = text;
    document.getElementsByClassName("paginate-info")[0].innerHTML = `Trang ${currentPageProduct} /${totalPageProduct}`;
    paginationProduct();
}
let formEditProduct;
function editProduct(id) {
    let product = productsArr.find(e => e.code == id);
    idUp = product.code;
    timeCreated = product.timeCreated;
    document.getElementsByClassName("main-content-product")[0].style.display = "none";
    formEditProduct = document.createElement("div");
    formEditProduct.innerHTML = `
        <div class="main-content-1">
            <div class="header-content">SỬA ĐỔI SẢN PHẨM</div>
            <div class="form-add-product">
                <form id="newProductForm" onsubmit="product(event)">
                    <label for="productname">Tên sản phẩm:</label> <br>
                    <input type="text" id="productname" autocomplete="off" value="${product.name}"> <br>
                    <label for="producttype">Loại sản phẩm:</label> <br>
                    <select id="producttype">
                        
                    </select> <br>
                    <label for="image">Ảnh sản phẩm:</label> <br>
                    <img src="${product.image}" alt="" id="image"> <br>
                    <input type="file" name="image" onchange="changeImage(this,'')"> <br> 
                    <label for="productprice">Giá sản phẩm:</label> <br>
                    <input type="text" id="productprice" autocomplete="off" value="${product.price}"> <br>
                    <label for="productquantity">Số lượng:</label> <br>
                    <input type="text" id="productquantity" autocomplete="off" value=${product.quantity}> <br>
                    <button type="submit">Confirm</button>
                </form>
            </div>
        </div>
    `;
    document.getElementsByClassName("main-content")[0].appendChild(formEditProduct);
    category.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        if (item.id === product.category) {
            option.selected = true;
        }
        document.getElementById("producttype").appendChild(option);
        document.getElementById("producttype").value = product.category;
    })
    flagProduct = false;
}
function deleteProduct(id) {
    let index = productsArr.findIndex(e => e.code == id);
    productsArr.splice(index, 1)
    localStorage.setItem("products", JSON.stringify(productsArr));
    renderProducts();
}
function checkEditProduct(value) {
    let index = productsArr.findIndex(e => e.code == value.code);
    let priceNum = value.price.match(/\d/g) != null && value.price.match(/\d/g).length == value.price.length;
    let quantityNum = value.quantity.match(/\d/g) != null && value.quantity.match(/\d/g).length == value.quantity.length;
    if (priceNum && quantityNum && value.category != "" && value.image != imgDefault) {
        notification("Thay đổi sản phẩm thành công", "success");
        productsArr.splice(index, 1, value);
        localStorage.setItem("products", JSON.stringify(productsArr));
        renderProducts();
        flagProduct = true;
        document.getElementsByClassName("main-content-product")[0].style.display = "block";
        document.getElementsByClassName("main-content")[0].removeChild(formEditProduct);
    } else if (!/^\d+$/.test(value.price) || !/^\d+$/.test(value.quantity) || value.price == "" || value.quantity == "" || value.name == "" || value.category == "" || value.image == imgDefault) {
        notification("Trường bị trống hoặc sai định dạng giá và số lượng", "warning");
    }
}
function checkExistProduct(value) {
    let priceNum = value.price.match(/\d/g) != null && value.price.match(/\d/g).length == value.price.length;
    let quantityNum = value.quantity.match(/\d/g) != null && value.quantity.match(/\d/g).length == value.quantity.length;
    if (productsArr.findIndex((e) => e.name == value.name) == -1 && priceNum && quantityNum && value.category != "" && value.image != imgDefault) {
        notification("Tạo mới thành công", "success");
        productsArr.unshift(value);
        localStorage.setItem("products", JSON.stringify(productsArr));
        renderProducts();
        document.getElementsByClassName("main-content-product")[0].style.display = "block";
        document.getElementsByClassName("main-content")[0].removeChild(formProduct);
    } else if (!/^\d+$/.test(value.price) || !/^\d+$/.test(value.quantity) || value.price == "" || value.quantity == "" || value.name == "" || value.category == "" || value.image == imgDefault) {
        notification("Trường bị trống hoặc sai định dạng giá và số lượng", "warning");
    } else if (productsArr.findIndex((e) => e.name == value.name) !== -1) {
        notification("Tên sản phẩm đã tồn tại", "warning");
    }
}
function makeCode() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = String(today.getFullYear());
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    if (dd < 10) {
        dd = "0" + dd;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    return (result = yyyy + mm + dd + h + m + s);
}
function dateFormat() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}
// them loai san pham (category)
let categoryForm;
function addCategory() {
    document.getElementsByClassName("main-content-product")[0].style.display = "none";
    categoryForm = document.createElement("div");
    categoryForm.innerHTML = `
        <div class="main-content-1">
            <div class="header-content">THÊM MỚI LOẠI SẢN PHẨM</div>
            <div class="form-add-category">
                <div>
                    <label for="category">Tên loại sản phẩm:</label> <br>
                    <input type="text" id="category" required ><br>
                    <div class="alert-category"></div>
                    <button onclick="newCategory()">Thêm</button>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="table-category">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    document.getElementsByClassName("main-content")[0].appendChild(categoryForm);
    tableCategory();
}
function tableCategory() {
    const categoryTable = document.getElementById("table-category");
    categoryTable.innerHTML = ''; // moi lan goi lai se reset bang cu va render bang moi
    category.map((e, i) => {
        categoryTable.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${e.name}</td>
                <td>
                    <button onclick="editCategory(${e.id})">Sửa</button>
                    <button onclick="deleteCategory(${e.id})">Xóa</button>
                </td>
            </tr>
        `
    })
}
function deleteCategory(id) {
    let index = category.findIndex((e) => e.id == id);
    category.splice(index, 1);
    localStorage.setItem("categories", JSON.stringify(category));
    tableCategory();
}
let flagCate = true;
let idCate;
function newCategory() {
    let value = document.getElementById("category").value;
    if (category.findIndex((e) => e.name.toLowerCase() == value.toLowerCase()) != -1) {
        document.getElementsByClassName("alert-category")[0].innerHTML = '<div class="false-alert">Loại sản phẩm này đã tồn tại</div>'
    } else if (value == "") {
        document.getElementsByClassName("alert-category")[0].innerHTML = '<div class="false-alert">Không được để trống</div>'
    } else {
        let oneCategory = {
            id: Math.floor(Math.random() * 99999),
            name: value
        }
        if (flagCate) {
            category.push(oneCategory);
            document.getElementById("category").value = "";
            document.getElementsByClassName("alert-category")[0].innerHTML = `<div class="true-alert">Thêm thành công!!</div>`;
        } else {
            oneCategory = {
                id: idCate,
                name: value
            };
            let index = category.findIndex((e) => e.id == idCate);
            category.splice(index, 1, oneCategory);
            flagCate = true;
            document.getElementById("category").value = "";
            document.getElementsByClassName("alert-category")[0].innerHTML = `<div class="true-alert">Sửa thành công!!</div>`;
        }
        localStorage.setItem("categories", JSON.stringify(category));
        setTimeout(() => {
            document.getElementsByClassName("alert-category")[0].innerHTML = '';
        }, 1000)
        tableCategory();
    }
}
function editCategory(id) {
    flagCate = false;
    let index = category.findIndex((e) => e.id == id);
    document.getElementById("category").value = category[index].name;
    idCate = category[index].id;
}

// render anh 
function changeImage(element, avatar) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        avatar = reader.result;
        readerImage(avatar)
    }
    reader.readAsDataURL(file);
}
function readerImage(avatar) {
    document.getElementById("image").src = avatar;
}

// quan li don hoang
function orderManage() {
    document.getElementsByClassName("main-content")[0].innerHTML = `
        <div class="main-content-order">
            <div class="main-content-1">
            <div class="header-content">QUẢN LÝ ĐƠN HÀNG</div>
            <div class="main-content-sort">
                <div class="main-content-sort-filter">
                    <input type="text" placeholder="Nhập từ khoá" id="searchElement">
                    <button onclick="search()">Tìm kiếm</button>
                </div>
            </div>
        </div>
        <div class="main-content-2">
            <table>
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Người mua</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Thanh toán</th>
                        <th>Sản phẩm</th>
                        <th>Ghi chú</th>
                        <th>Thời gian tạo</th>
                        <th>Tình trạng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
            <div class="paginate">
                <div class="paginate-info"></div>
                <div id="paginate-page">
                </div>
            </div>
        </div>
        </div>
    `
}
function renderOrder() {
    totalPageOrder = Math.ceil(bills.length / itemsOrderPerPage);
    start = (currentPageOrder - 1) * itemsOrderPerPage;
    end = currentPageOrder * itemsOrderPerPage;
    end = Math.min(end, bills.length);
    let text = "";
    for (let i = start; i < end; i++) {
        let arr = [];
        let status;
        if (bills[i].status == "waiting") {
            status = "Chờ duyệt";
        } else if (bills[i].status == "denied") {
            status = "Hủy đơn";
        } else if (bills[i].status == "accepted") {
            status = "Đã duyệt";
        }
        bills[i].cart.forEach((i) => arr.push(`${i.name} x${i.quantity}`));
        text += `
            <tr class="tr-product">
                <td>${bills[i].id}</td>
                <td>${bills[i].username}</td>
                <td>${bills[i].user}</td>
                <td>${bills[i].phone}</td>
                <td>${VND.format(bills[i].price)}</td>
                <td>${arr.join("<br>")}</td>
                <td>${bills[i].note}</td>
                <td>${bills[i].timeCreated}</td>
                <td>
                    <div class="active-info">
                        <div id="status" class="${bills[i].status}-icon"></div>
                        <div>${status}</div>
                    </div>
                </td>
                <td style="${bills[i].status != "waiting" ? "display: none" : ""}">
                    <button onclick="acptBill('${bills[i].id}')">Duyệt</button>
                    <button onclick="denyBill('${bills[i].id}')">Hủy</button>
                </td>
            </tr>
        `
    }
    document.getElementById("table-body").innerHTML = text;
    document.getElementsByClassName("paginate-info")[0].innerHTML = `Trang ${currentPageOrder} /${totalPageOrder}`;
    paginationOrder();
}
function acptBill(id) {
    let index = bills.findIndex(e => e.id == id);
    let confirmDn = confirm("Xác nhận duyệt đơn?");
    if (confirmDn) {
        bills[index].status = "accepted";
        localStorage.setItem("bills", JSON.stringify(bills));
        renderOrder();
    }
}
function denyBill(id) {
    let index = bills.findIndex(e => e.id == id);
    let confirmDn = confirm("Xác nhận hủy đơn?");
    if (confirmDn) {
        bills[index].status = "denied";
        localStorage.setItem("bills", JSON.stringify(bills));
        renderOrder();
    }
}
// phan trang
function paginationUser() {
    let str = `<button class="btn-prev" id="btn-user-prev" onclick="changePageUser(${currentPageUser == minPage ? currentPageUser : currentPageUser - 1})">Prev</button>`;
    for (let i = 1; i <= totalPageUser; i++) {
        str += `
                <button onclick="changePageUser(${i})">${i}</button>
            `
    }
    str += `<button class="btn-next" id="btn-user-next" onclick="changePageUser(${currentPageUser < totalPageUser ? currentPageUser + 1 : currentPageUser})">Next</button>`;
    document.getElementById("paginate-page").innerHTML = str;
}
function paginationProduct() {
    let str = `<button class="btn-prev" id="btn-prod-prev" onclick="changePageProduct(${currentPageProduct == minPage ? currentPageProduct : currentPageProduct - 1})">Prev</button>`;
    for (let i = 1; i <= totalPageProduct; i++) {
        str += `
                <button onclick="changePageProduct(${i})">${i}</button>
            `
    }
    str += `<button class="btn-next" id="btn-prod-next" onclick="changePageProduct(${currentPageProduct < totalPageProduct ? currentPageProduct + 1 : currentPageProduct})">Next</button>`;
    document.getElementById("paginate-page").innerHTML = str;
}
function paginationOrder() {
    let str = `<button class="btn-prev" id="btn-prod-prev" onclick="changePageOrder(${currentPageOrder == minPage ? currentPageOrder : currentPageOrder - 1})">Prev</button>`;
    for (let i = 1; i <= totalPageOrder; i++) {
        str += `
                <button onclick="changePageOrder(${i})">${i}</button>
            `
    }
    str += `<button class="btn-next" id="btn-prod-next" onclick="changePageOrder(${currentPageOrder < totalPageOrder ? currentPageOrder + 1 : currentPageOrder})">Next</button>`;
    document.getElementById("paginate-page").innerHTML = str;
}
function changePageUser(val) {
    currentPageUser = val;
    render(users);
}
function changePageProduct(val) {
    currentPageProduct = val;
    renderProducts();
}
function changePageOrder(val) {
    currentPageOrder = val;
    renderOrder();
}
// thong bao
function notification(text, type) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text;
    x.className = `show ${type}`;
    setTimeout(() => { x.className = x.className.replace("show", ""); }, 3000);
}