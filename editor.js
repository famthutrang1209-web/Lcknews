console.log("editor.js loaded");

// Khai báo biến toàn cục để lưu danh sách team đã chọn
let selectedTeams = [];

document.addEventListener("DOMContentLoaded", () => {
  /* ================= 1. XỬ LÝ DROPDOWN (FIX) ================= */
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(drop => {
    const toggle = drop.querySelector(".dropdown-toggle");

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      
      dropdowns.forEach(otherDrop => {
        if (otherDrop !== drop) otherDrop.classList.remove("active");
      });

      drop.classList.toggle("active");
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach(d => d.classList.remove("active"));
  });

  /* ================= 2. XỬ LÝ SOẠN THẢO (EDITOR) ================= */
  function addEvents(block) {

    // ENTER
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

    // 🔥 FIX ẢNH
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

            if (block.id === "bannerBlock") {
              block.innerHTML = "";
              block.appendChild(img);
              return;
            }

            const sel = window.getSelection();
            const range = sel.getRangeAt(0);

            range.deleteContents();
            range.insertNode(img);

            const br = document.createElement("br");
            img.after(br);

            range.setStartAfter(br);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
          };

          reader.readAsDataURL(file);
        }
      }

      // paste link ảnh
      const text = clipboard.getData("text");
      if (!handled && text.startsWith("http") && (text.endsWith(".jpg") || text.endsWith(".png") || text.endsWith(".jpeg"))) {
        e.preventDefault();

        const img = document.createElement("img");
        img.src = text;

        if (block.id === "bannerBlock") {
          block.innerHTML = "";
          block.appendChild(img);
          return;
        }

        const sel = window.getSelection();
        const range = sel.getRangeAt(0);

        range.deleteContents();
        range.insertNode(img);

        const br = document.createElement("br");
        img.after(br);

        range.setStartAfter(br);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
      }
    });
  }

  document.querySelectorAll(".editor .block").forEach(block => {
    addEvents(block);
  });

  /* ================= 3. DANH SÁCH TEAM (GIỮ NGUYÊN) ================= */
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

  /* ================= 4. RELATED (GIỮ NGUYÊN) ================= */
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

  /* ================= 5. GOM DỮ LIỆU (GIỮ NGUYÊN) ================= */
  window.submitForm = function() {
    const titleInput = document.getElementById("titleInput").value;
    if (titleInput.trim() === "") {
      alert("Vui lòng nhập tiêu đề bài viết!");
      return false;
    }

    const authorInput = document.getElementById("authorInput").value || "Admin";
    const dateInput = document.getElementById("dateInput").value || new Date().toLocaleDateString('vi-VN');
    
    const bannerBlock = document.getElementById("bannerBlock");
    let bannerUrl = "";
    if (bannerBlock.querySelector("img")) {
      bannerUrl = bannerBlock.querySelector("img").src;
    }

    const contentBlocks = document.querySelectorAll(".editor .block:not(.banner-block):not(.title)");
    let contentArr = [];
    contentBlocks.forEach(b => {
      if (b.innerHTML.trim() !== "" && !b.closest(".meta-block") && !b.closest(".tag-box")) {
        contentArr.push(b.innerHTML);
      }
    });

    document.getElementById("hiddenTitle").value = titleInput;
    document.getElementById("hiddenContent").value = contentArr.join("<br><br>");
    document.getElementById("hiddenImage").value = bannerUrl; 
    document.getElementById("hiddenTags").value = JSON.stringify(selectedTeams);
    document.getElementById("hiddenAuthor").value = authorInput;
    document.getElementById("hiddenDate").value = dateInput;

    return true;
  };

  /* ================= 6. SUBMIT (CHỈNH SỬA) ================= */
  const postForm = document.getElementById("postForm");
  
  if (postForm) {
    postForm.addEventListener("submit", async function(event) {
      event.preventDefault(); 

      if (!window.submitForm()) return; 

      const formData = new FormData(postForm);

      try {
        const response = await fetch("add_post.php", {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (result.status === "success") {
          alert("🎉 Bài viết đã được đăng thành công!");
          // Chuyển thẳng sang news.php?id=... của bài vừa đăng
          window.location.href = `news.php?id=${result.id}`;
        } else {
          alert("Lỗi từ Server: " + result.message);
        }
      } catch (error) {
        console.error("Lỗi gửi dữ liệu:", error);
        alert("Phát hiện lỗi! Hãy nhấn F12, mở tab 'Console' để xem chi tiết.");
      }
    });
  }

});

/* ================= SUBSCRIBE ================= */
function subscribe() {
  alert("Bạn đã theo dõi đội!");
}