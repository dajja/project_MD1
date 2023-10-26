function createAdmin() {
    let users = JSON.parse(localStorage.getItem("array")) || [];
    let admin = {
        id: 1,
        username: "ADMIN",
        email: "admin@gmail.com",
        password: "1",
        role: "admin",
        status: "active"
    }
    let userAll = [admin,...users];
    let userAdminExit = users.find(item => item.role === 'admin');
    if(!userAdminExit) {
        localStorage.setItem('array', JSON.stringify(userAll));
    }
}
createAdmin();