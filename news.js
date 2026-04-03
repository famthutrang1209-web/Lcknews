const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`http://localhost/esport/get_article.php?id=${id}`)
  .then(res => res.json())
  .then(article => {

    document.getElementById("title").innerText = article.title;
    document.getElementById("author").innerText = article.author;
    document.getElementById("date").innerText = article.date;
    document.getElementById("content").innerHTML = article.content;
    document.getElementById("banner").innerHTML = article.banner;

    if (article.tags && article.tags.length > 0) {
      document.getElementById("teamName").innerText = article.tags[0];
      document.getElementById("teamName2").innerText = article.tags[0];
    }
  });

// RELATED
fetch("http://localhost/esport/get_articles.php")
  .then(res => res.json())
  .then(articles => {
    const relatedDiv = document.getElementById("related");

    articles.forEach(a => {
      if (a.id != id) {
        const div = document.createElement("div");
        div.className = "related-item";
        div.innerText = a.title;

        div.onclick = () => {
          window.location.href = `news.html?id=${a.id}`;
        };

        relatedDiv.appendChild(div);
      }
    });
  });

function subscribe() {
  alert("Đã theo dõi!");
}