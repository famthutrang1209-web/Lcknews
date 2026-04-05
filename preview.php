<?php
include "config.php";

// 1. Lấy ID từ URL
$id = $_GET['id'] ?? 0;

// 2. Truy vấn dữ liệu bài viết
$sql = "SELECT * FROM articles WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$article = $result->fetch_assoc();

// Nếu không thấy bài viết, báo lỗi
if (!$article) {
    die("<center><h1>Lỗi: Không tìm thấy bài viết để xem trước!</h1></center>");
}

// Xử lý Tags/Team Name (Giả sử tags lưu dạng JSON hoặc chuỗi)
$teamName = "Đội tuyển";
if (!empty($article['tags'])) {
    $tags = json_decode($article['tags'], true);
    $teamName = is_array($tags) ? ($tags[0] ?? 'Đội tuyển') : $article['tags'];
}
?>

<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xem trước: <?php echo htmlspecialchars($article['title']); ?></title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style_trg.css">
</head>
<body>

<header class="navbar">
  <div class="nav-container">
    <div class="logo">
      <a href="index.php"><img src="./assets/LCK.png" alt="LCK Logo"></a>
    </div>
    <nav class="nav-menu">
      <a href="index.php" class="active">Trang chủ</a>
      <a href="#">Lịch thi đấu</a>
      <a href="#">Bảng xếp hạng</a>
      <div class="dropdown">
        <span class="dropdown-toggle">Giải đấu <i class="arrow">▼</i></span>
        <ul class="dropdown-content">
          <li><a href="#">LCK Mùa Xuân</a></li>
          <li><a href="#">MSI 2026</a></li>
        </ul>
      </div>
    </nav>
    <div class="nav-right">
      <span style="color: #c39953; font-weight: bold; margin-right: 15px;">[ CHẾ ĐỘ XEM TRƯỚC ]</span>
      <button class="btn-login">Đăng nhập</button>
    </div>
  </div>
</header>

<div class="main-wrapper">
  <div class="container">
    <main class="article-content">
      <header class="article-header">
        <div class="category-tag">LCK News</div>
        <h1><?php echo htmlspecialchars($article['title']); ?></h1>
        
        <div class="article-meta">
          <div class="author-info">
            <img src="https://ui-avatars.com/api/?name=<?php echo urlencode($article['author']); ?>&background=random" alt="avatar">
            <div>
              <span class="author-name"><?php echo htmlspecialchars($article['author']); ?></span>
              <span class="post-date"><?php echo htmlspecialchars($article['date']); ?></span>
            </div>
          </div>
          <div class="social-share">
            <span>Chia sẻ:</span>
            <button>FB</button> <button>X</button>
          </div>
        </div>
      </header>

      <div class="featured-image">
        <?php if (!empty($article['banner'])): ?>
            <img src="<?php echo $article['banner']; ?>" alt="Banner">
        <?php endif; ?>
      </div>

      <article class="entry-content">
        <?php echo $article['content']; ?>
      </article>

      <div class="subscribe-card">
        <div class="sub-icon">🔔</div>
        <div class="sub-text">
          <h3>Đừng bỏ lỡ tin tức về <span><?php echo htmlspecialchars($teamName); ?></span></h3>
          <p>Nhận thông báo mới nhất về đội tuyển này ngay lập tức.</p>
        </div>
        <button class="btn-sub">Theo dõi</button>
      </div>
    </main>

    <aside class="sidebar">
      <div class="widget">
        <h3 class="widget-title">Bài liên quan</h3>
        <div id="related" class="related-posts">
          </div>
      </div>
      
      <div class="widget sticky-ad">
        <div class="ad-placeholder">Quảng cáo / Banner giải đấu</div>
      </div>
    </aside>
  </div>
</div>

<script>
// Load bài liên quan (giống news.js nhưng bỏ phần load bài chính)
fetch("get_articles.php")
  .then(res => res.json())
  .then(articles => {
    const relatedDiv = document.getElementById("related");
    const currentId = <?php echo $id; ?>;
    
    const filtered = articles.filter(a => a.id != currentId).slice(0, 5);

    filtered.forEach(a => {
      const item = document.createElement("div");
      item.className = "related-item";
      item.innerHTML = `
        <div class="related-info">
          <h4 style="margin:0; font-size:15px">${a.title}</h4>
          <small style="color:#888">${a.date}</small>
        </div>
      `;
      item.onclick = () => window.location.href = `news.html?id=${a.id}`;
      relatedDiv.appendChild(item);
    });
  });

// Xử lý Dropdown
document.querySelector('.dropdown-toggle').addEventListener('click', function() {
    this.parentElement.classList.toggle('active');
});
</script>

</body>
</html>