const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) console.log("Không có ID → đang dùng ID mặc định = 1");

fetch(`get_article.php?id=${id}`)
  .then(res => res.json())
  .then(article => {
    document.getElementById("title").innerText = article.title;
    document.getElementById("author").innerText = article.author;
    document.getElementById("date").innerText = article.date;
    document.getElementById("content").innerHTML = article.content;

    const bannerContainer = document.getElementById("banner-container");
    if(article.banner){
        bannerContainer.innerHTML = `<img src="${article.banner}" alt="Banner">`;
    }

    if(article.tags){
        try {
            const tags = JSON.parse(article.tags);
            document.getElementById("teamName").innerText = tags.join(", ");
        } catch(e){
            document.getElementById("teamName").innerText = article.tags;
        }
    }
  })
  .catch(err => console.error("Lỗi:", err));

// FETCH BÀI LIÊN QUAN
fetch("get_articles.php")
  .then(res => res.json())
  .then(articles => {
    const relatedDiv = document.getElementById("related");
    const filtered = articles.filter(a => a.id != id).slice(0, 5);

    filtered.forEach(a => {
      const item = document.createElement("div");
      item.className = "related-item";
      item.innerHTML = `
        ${a.banner ? `<img src="${a.banner}" alt="Hình bài liên quan" class="related-img">` : ''}
        <h4>${a.title}</h4>
        <small>${a.date}</small>
      `;
      item.onclick = () => {
        window.location.href = `news.php?id=${a.id}`;
      };
      relatedDiv.appendChild(item);
    });
  });