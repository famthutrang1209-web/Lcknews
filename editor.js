console.log("editor.js loaded");

// Khai báo biến toàn cục để lưu danh sách team đã chọn
let selectedTeams = [];

document.addEventListener("DOMContentLoaded", () => {
  /* ================= 1. XỬ LÝ DROPDOWN (FIX) ================= */
  // Tìm tất cả các dropdown trên navbar
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(drop => {
    const toggle = drop.querySelector(".dropdown-toggle");

    toggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài document
      
      // Đóng các dropdown khác trước khi mở cái hiện tại
      dropdowns.forEach(otherDrop => {
        if (otherDrop !== drop) otherDrop.classList.remove("active");
      });

      // Bật/Tắt menu hiện tại
      drop.classList.toggle("active");
    });
  });

  // Click ra ngoài bất kỳ đâu để đóng menu
  document.addEventListener("click", () => {
    dropdowns.forEach(d => d.classList.remove("active"));
  });

  /* ================= 2. XỬ LÝ SOẠN THẢO (EDITOR) ================= */
  function addEvents(block) {
    // Xử lý phím Enter trong các khối contenteditable
    block.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const br = document.createElement("br");
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        range.insertNode(br);
        range.setStartAfter(br);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    });

    // Xử lý Paste (Dán) ảnh
    block.addEventListener("paste", (e) => {
      const clipboard = e.clipboardData;
      if (!clipboard) return;

      let handled = false;
      const items = clipboard.items;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.includes("image")) {
          e.preventDefault();
          handled = true;
          const file = items[i].getAsFile();
          const reader = new FileReader();

          reader.onload = function(event) {
            const img = document.createElement("img");
            img.src = event.target.result;
            if (block.id === "bannerBlock") block.innerHTML = "";
            block.appendChild(img);
          };
          reader.readAsDataURL(file);
        }
      }

      // Xử lý Paste link ảnh trực tiếp
      const text = clipboard.getData("text");
      if (!handled && text.startsWith("http") && (text.endsWith(".jpg") || text.endsWith(".png") || text.endsWith(".jpeg"))) {
        e.preventDefault();
        const img = document.createElement("img");
        img.src = text;
        if (block.id === "bannerBlock") block.innerHTML = "";
        block.appendChild(img);
      }
    });
  }

  // Gán sự kiện cho các khối block có sẵn
  document.querySelectorAll(".editor .block").forEach(block => {
    addEvents(block);
  });

  /* ================= 3. DANH SÁCH TEAM (TAGS) ================= */
  const teamList = document.getElementById("teamList");
  const teams = [
    { name: "T1", logo: "./assets/teams/T1.png" },
    { name: "GEN", logo: "./assets/teams/GENG.png" },
    { name: "DK", logo: "./assets/teams/DK.png" },
    { name: "KT", logo: "./assets/teams/KT.png" },
    { name: "HLE", logo: "./assets/teams/HLE.png" },
    { name: "DRX", logo: "./assets/teams/DRX.png" },
    { name: "NS", logo: "./assets/teams/NS.png" },
    { name: "BRO", logo: "./assets/teams/BRION.png" },
    { name: "BFX", logo: "./assets/teams/FEAX.png" },
    { name: "DNS", logo: "./assets/teams/DNS.png" }
  ];

  if (teamList) {
    teams.forEach(team => {
      const div = document.createElement("div");
      div.className = "team-item";
      div.innerHTML = `<img src="${team.logo}"> <span>${team.name}</span>`;

      div.addEventListener("click", () => {
        if (selectedTeams.includes(team.name)) {
          selectedTeams = selectedTeams.filter(t => t !== team.name);
          div.classList.remove("active");
        } else {
          selectedTeams.push(team.name);
          div.classList.add("active");
        }
      });
      teamList.appendChild(div);
    });
  }

  /* ================= 4. THÊM BÀI LIÊN QUAN ================= */
  window.addRelated = function() {
    const container = document.getElementById("related-list");
    const div = document.createElement("div");
    div.className = "block";
    div.contentEditable = "true";
    div.innerHTML = "Dán link bài liên quan...";
    container.appendChild(div);
    div.focus();
    addEvents(div);
  };

  /* ================= 5. GOM DỮ LIỆU FORM ================= */
  window.submitForm = function() {
    // 1. Kiểm tra Tiêu đề
    const titleInput = document.getElementById("titleInput").value;
    if (titleInput.trim() === "") {
      alert("Vui lòng nhập tiêu đề bài viết!");
      return false; // Dừng lại nếu chưa có tiêu đề
    }

    // 2. Lấy các giá trị khác
    const authorInput = document.getElementById("authorInput").value || "Admin";
    const dateInput = document.getElementById("dateInput").value || new Date().toLocaleDateString('vi-VN');
    
    // 3. Lấy ảnh banner
    const bannerBlock = document.getElementById("bannerBlock");
    let bannerUrl = "";
    if (bannerBlock.querySelector("img")) {
      bannerUrl = bannerBlock.querySelector("img").src;
    }

    // 4. Lấy nội dung (tất cả block trừ title/meta/banner)
    const contentBlocks = document.querySelectorAll(".editor .block:not(.banner-block):not(.title)");
    let contentArr = [];
    contentBlocks.forEach(b => {
      if (b.innerHTML.trim() !== "" && !b.closest(".meta-block") && !b.closest(".tag-box")) {
        contentArr.push(b.innerHTML);
      }
    });

    // 5. Gán vào các input ẩn
    document.getElementById("hiddenTitle").value = titleInput;
    document.getElementById("hiddenContent").value = contentArr.join("<br><br>");
    document.getElementById("hiddenImage").value = bannerUrl; 
    document.getElementById("hiddenTags").value = JSON.stringify(selectedTeams);
    document.getElementById("hiddenAuthor").value = authorInput;
    document.getElementById("hiddenDate").value = dateInput;

    return true; // Cho phép đi tiếp
  };

  /* ================= 6. XỬ LÝ ĐĂNG BÀI (CHẶN CHUYỂN TRANG TUYỆT ĐỐI) ================= */
  const postForm = document.getElementById("postForm");
  
  if (postForm) {
    postForm.addEventListener("submit", async function(event) {
      // DÒNG NÀY LÀ QUAN TRỌNG NHẤT: Chặn form tự động chuyển sang trang khác
      event.preventDefault(); 

      // Kiểm tra tiêu đề và gom dữ liệu
      if (!window.submitForm()) return; 

      const formData = new FormData(postForm);

      try {
        const response = await fetch("add_post.php", {
          method: "POST",
          body: formData
        });

        // Đọc dữ liệu JSON trả về (Bao gồm cả lỗi PHP nếu có)
        const result = await response.json();

        if (result.status === "success") {
          alert("🎉 Chúc mừng! Bài viết đã được đăng thành công.");
          
          const previewUrl = `news.html?id=${result.id}`;
          if (confirm("Bạn có muốn xem trước bài viết vừa đăng không?")) {
            window.open(previewUrl, "_blank"); 
          }
        } else {
          // Nếu PHP báo lỗi (ví dụ: thiếu cột trong DB), nó sẽ hiện ở đây
          alert("Lỗi từ Server: " + result.message);
        }
      } catch (error) {
        console.error("Lỗi gửi dữ liệu:", error);
        alert("Phát hiện lỗi! Hãy nhấn F12, mở tab 'Console' để xem chi tiết.");
      }
    });
  }

});

