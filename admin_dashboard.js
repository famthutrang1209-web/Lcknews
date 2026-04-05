// // ===== CHECK ADMIN =====
// const user = JSON.parse(localStorage.getItem("user"));

// if (!user || user.role !== "admin") {
//     window.location.href = "login.html";
// }

// // Hiển thị tên admin
// const usernameDisplay = document.getElementById("usernameDisplay");
// if (usernameDisplay) {
//     usernameDisplay.innerText = "ADMIN: " + user.username;
// }


// ===== NAVIGATION =====

// Nút thêm bài
function goToEditor() {
    window.location.href = "admin.php";
}

// Sửa bài
function editArticle(id) {
    window.location.href = "admin.php?id=" + id;
}

// Xóa bài (gọi PHP)
function deleteArticle(id) {
    if (confirm("Bạn có chắc muốn xóa bài này?")) {
        window.location.href = "delete.php?id=" + id;
    }
}


// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

function setHeadline(id){
    if(confirm("Đặt bài này làm headline?")){
        window.location.href = "set_headline.php?id=" + id;
    }
}

function openArticle(id) {
    window.location.href = "news.php?id=" + id;
}
