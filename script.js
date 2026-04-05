// ===== LOGIN =====
async function submitLogin(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    try {
        // Gọi đến file xử lý login PHP (nếu bạn có tạo file login.php)
        // Tạm thời có thể dùng logic cũ hoặc gọi API thực tế
        const res = await fetch("login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if(data.success){
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Đăng nhập thành công");

            let redirect = localStorage.getItem("redirect");
            if(redirect){
                localStorage.removeItem("redirect");
                window.location.href = redirect;
            } else {
                window.location.reload();
            }
        } else {
            alert("Sai tài khoản hoặc mật khẩu");
        }
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        alert("Chưa có file xử lý login.php hoặc lỗi kết nối!");
    }
}

// ===== KIỂM TRA UI ĐĂNG NHẬP =====
function checkLoginUI(){
    const user = JSON.parse(localStorage.getItem("user"));

    if(user){
        const loginBtn = document.querySelector(".login-btn");
        if(loginBtn){
            loginBtn.innerText = "Đăng xuất";
            loginBtn.onclick = logout;
        }

        // Đổi link từ admin.html sang admin.php của bạn
        if(user.role === "admin"){
            const nav = document.querySelector("nav .navbar-nav");
            if(nav) {
                nav.innerHTML += `<li class="nav-item"><a class="nav-link" style="color:#ffc94d;" href="admin.php">ADMIN MODE</a></li>`;
            }
        }
    }
}

function watch(){
    window.location.href="T1.html"; // Chuyển đến trang đội tuyển nếu có
}

function logout(){
    localStorage.removeItem("user");
    window.location.href = "login.html"; // Hoặc index.php
}

// ===== MỞ BÀI VIẾT CHI TIẾT =====
function openArticle(id){
    // Đổi từ tintuc1.html sang hệ thống news.html / preview.php của bạn
    window.location.href = "news.html?id=" + id;
}

// ===== LOAD NEWS TỪ MYSQL =====
async function loadNews(){
    try {
        // Đổi từ localhost:3000/news sang file PHP của bạn
        const res = await fetch("get_articles.php");
        const data = await res.json();

        let html = "";
        const user = JSON.parse(localStorage.getItem("user"));
        const isAdmin = user && user.role === "admin";

        data.forEach(news => {
            html += `
            <div class="col-md-4 mt-4">
                <div class="news-card">
                    <a href="news.html?id=${news.id}">
                        <img src="${news.banner}" alt="Banner" style="width:100%; height:220px; object-fit:cover;">
                    </a>

                    <div class="news-content" onclick="openArticle(${news.id})" style="cursor:pointer;">
                        <h4 style="color:#ffc94d; margin-top:10px;">${news.title}</h4>
                        <p style="color:#bbb; font-size:14px;">${news.date}</p>
                    </div>

                    ${isAdmin ? `
                    <div class="admin-actions" style="padding: 10px; text-align: center;">
                        <button class="btn btn-danger btn-sm" onclick="deleteNews(${news.id})">Xóa bài</button>
                    </div>
                    ` : ""}
                </div>
            </div>
            `;
        });

        const container = document.getElementById("newsContainer");
        if(container) {
            container.innerHTML = html;
        }
    } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
    }
}

// ===== XOÁ NEWS (ADMIN) =====
async function deleteNews(id){
    if(!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;

    try {
        // Trỏ về file delete_post.php của bạn
        await fetch(`delete_post.php?id=${id}`, {
            method: "GET" // Tùy thuộc vào việc file delete_post.php của bạn dùng GET hay POST
        });
        
        alert("Đã xóa bài viết thành công!");
        loadNews(); // Tải lại danh sách
    } catch (error) {
        alert("Có lỗi xảy ra khi xóa!");
    }
}

// ===== AUTO LOAD KHI VÀO TRANG (ĐÃ GỘP) =====
window.onload = function(){
    checkLoginUI();
    
    // Chỉ load news bằng JS nếu tìm thấy container
    if(document.getElementById("newsContainer")){
        loadNews();
    }
};