// LẤY DỮ LIỆU
function getArticles() {
  return JSON.parse(localStorage.getItem("articles") || "[]");
}

// LƯU DỮ LIỆU
function saveArticles(data) {
  localStorage.setItem("articles", JSON.stringify(data));
}

// ================= USER =================

if (window.location.pathname.includes("news.html")) {

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  const articles = getArticles();
  const article = articles.find(a => a.id === id);

  if (article) {
    document.getElementById("title").innerText = article.title;
    document.getElementById("meta").innerText = article.author + " - " + article.date;
    document.getElementById("content").innerHTML = article.content;
    document.getElementById("banner").src = article.banner;
    document.getElementById("team").innerText = article.team;
    document.getElementById("team2").innerText = article.team;

    // RELATED
    const related = document.getElementById("related");
    articles.forEach(a => {
      if (a.id !== id && a.team === article.team) {
        const div = document.createElement("div");
        div.className = "related-item";
        div.innerText = a.title;
        div.onclick = () => {
          window.location.href = `news.html?id=${a.id}`;
        };
        related.appendChild(div);
      }
    });
  }
}

// ================= ADMIN =================

function addArticle() {
  const articles = getArticles();

  const newArticle = {
    id: Date.now(),
    title: document.getElementById("titleInput").value,
    team: document.getElementById("teamInput").value,
    banner: document.getElementById("bannerInput").value,
    content: document.getElementById("contentInput").innerHTML,
    author: "Admin",
    date: new Date().toLocaleDateString()
  };

  articles.push(newArticle);
  saveArticles(articles);

  alert("Đã đăng bài!");
  renderAdmin();
}

function renderAdmin() {
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";
  const articles = getArticles();

  articles.forEach(a => {
    const div = document.createElement("div");
    div.innerHTML = `
      <b>${a.title}</b>
      <button onclick="deleteArticle(${a.id})">Xoá</button>
      <button onclick="editArticle(${a.id})">Sửa</button>
    `;
    list.appendChild(div);
  });
}

function deleteArticle(id) {
  let articles = getArticles();
  articles = articles.filter(a => a.id !== id);
  saveArticles(articles);
  renderAdmin();
}

function editArticle(id) {
  const articles = getArticles();
  const a = articles.find(x => x.id === id);

  document.getElementById("titleInput").value = a.title;
  document.getElementById("teamInput").value = a.team;
  document.getElementById("bannerInput").value = a.banner;
  document.getElementById("contentInput").innerHTML = a.content;

  deleteArticle(id);
}

// ================= RELATED EDITOR FIX =================

// Tạo block bài liên quan mới với nút xoá
function addRelatedBlock() {
  const container = document.getElementById("related-container");

  const block = document.createElement("div");
  block.className = "related-block";
  block.style.position = "relative";

  // Nút xoá (ô tròn nhỏ, nằm ngoài cùng bên phải)
  const removeBtn = document.createElement("div");
  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = "×";
  removeBtn.style.position = "absolute";
  removeBtn.style.top = "5px";
  removeBtn.style.right = "5px";
  removeBtn.style.width = "20px";
  removeBtn.style.height = "20px";
  removeBtn.style.background = "#ff4d4f";
  removeBtn.style.color = "white";
  removeBtn.style.borderRadius = "50%";
  removeBtn.style.display = "flex";
  removeBtn.style.alignItems = "center";
  removeBtn.style.justifyContent = "center";
  removeBtn.style.cursor = "pointer";
  removeBtn.style.fontWeight = "bold";
  removeBtn.onclick = () => block.remove();

  block.appendChild(removeBtn);

  const editor = document.createElement("div");
  editor.className = "related-editor";
  editor.contentEditable = true;
  editor.setAttribute("placeholder", "Nhập mô tả hoặc dán ảnh...");
  editor.style.padding = "10px 10px 10px 10px";
  editor.style.border = "1px solid rgba(255,255,255,0.2)";
  editor.style.borderRadius = "10px";
  editor.style.minHeight = "60px";
  editor.style.marginBottom = "10px";

  block.appendChild(editor);
  container.appendChild(block);

  editor.focus();
}

// Paste ảnh vào block hiện tại
document.getElementById("related-container").addEventListener("paste", function(e) {
  if (!e.target.classList.contains("related-editor")) return;

  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf("image") !== -1) {
      const file = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.maxWidth = "100%";
        img.style.display = "block";
        img.style.marginBottom = "5px";

        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);

        const br = document.createElement('br');
        img.after(br);

        range.setStartAfter(br);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      reader.readAsDataURL(file);
      e.preventDefault();
    }
  }
});

// Enter xuống dòng trong block, không tạo block mới
document.getElementById("related-container").addEventListener("keydown", function(e) {
  if (e.target.classList.contains("related-editor") && e.key === 'Enter') {
    e.preventDefault();
    const br = document.createElement('br');
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(br);
    range.setStartAfter(br);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
});

// Lấy dữ liệu tất cả block liên quan
function getRelatedData() {
  const blocks = document.querySelectorAll('.related-editor');
  const data = [];
  blocks.forEach(block => {
    // Chỉ lưu nếu có nội dung
    if (block.innerHTML.trim() !== "") {
      data.push(block.innerHTML);
    }
  });
  return JSON.stringify(data);
}

// Submit: lưu nội dung các block liên quan vào input ẩn
function getRelatedData() {
  const blocks = document.querySelectorAll('.related-editor');
  const data = [];
  blocks.forEach(block => {
    data.push(block.innerHTML);
  });
  return JSON.stringify(data);
}

// SUBSCRIBE
function subscribe() {
  alert("Bạn đã theo dõi đội!");
}