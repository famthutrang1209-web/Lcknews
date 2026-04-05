<?php
include "config.php";

// ===== LẤY BÀI VIẾT THEO ID =====
if(isset($_GET['id'])){
    $id = intval($_GET['id']);
    $sql = "SELECT * FROM articles WHERE id = $id LIMIT 1";
    $result = $conn->query($sql);

    if($result && $result->num_rows > 0){
        $article = $result->fetch_assoc();
    } else {
        die("Bài viết không tồn tại.");
    }
} else {
    die("Chưa có ID bài viết.");
}

// ===== LẤY BÀI LIÊN QUAN =====
// Lấy theo tag của bài này nếu có, ưu tiên hiển thị cùng tag
$related_posts = [];
if(!empty($article['team'])){
    $teams = json_decode($article['team'], true);
    $team_condition = [];
    foreach($teams as $t){
        $team_condition[] = "team LIKE '%$t%'";
    }
    $team_sql = implode(" OR ", $team_condition);
    $related_sql = "SELECT id, title, banner, date FROM articles WHERE id != $id AND ($team_sql) ORDER BY id DESC LIMIT 5";
    $related_result = $conn->query($related_sql);
    if($related_result && $related_result->num_rows > 0){
        while($row = $related_result->fetch_assoc()){
            $related_posts[] = $row;
        }
    }
}

// Nếu chưa đủ 5 bài liên quan, bổ sung bài mới nhất
if(count($related_posts) < 5){
    $left = 5 - count($related_posts);
    $fallback_sql = "SELECT id, title, banner, date FROM articles WHERE id != $id ORDER BY id DESC LIMIT $left";
    $fallback_result = $conn->query($fallback_sql);
    if($fallback_result && $fallback_result->num_rows > 0){
        while($row = $fallback_result->fetch_assoc()){
            $related_posts[] = $row;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($article['title']); ?> | LCK Tiếng Việt</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style_news.css">
</head>
<body>

<header class="navbar">
  <div class="nav-container">
    <div class="logo">
      <a href="index.php"><img src="./assets/LCK.png" alt="LCK Logo"></a>
    </div>
    <nav class="nav-menu">
      <a href="index.php">Trang chủ</a>
      <a href="#">Lịch thi đấu</a>
      <a href="#">Bảng xếp hạng</a>
      <div class="dropdown">
        <span class="dropdown-toggle">Giải đấu <i class="arrow">▼</i></span>
        <ul class="dropdown-menu">
          <li><a href="#">LCK Mùa Xuân</a></li>
          <li><a href="#">MSI 2026</a></li>
        </ul>
      </div>
    </nav>
    <div class="nav-right">
      <button class="btn-login">Đăng nhập</button>
    </div>
  </div>
</header>

<div class="main-wrapper">
  <div class="container-news">
    <main class="article">

      <!-- BANNER TRƯỚC TITLE -->
      <div id="banner-container">
        <?php if(!empty($article['banner'])): ?>
          <img src="<?php echo $article['banner']; ?>" alt="Banner bài viết">
        <?php endif; ?>
      </div>

      <header class="article-header">
        <div class="category-tag">LCK News</div>
        <h1 id="title"><?php echo htmlspecialchars($article['title']); ?></h1>
        
        <div class="article-meta">
          <div class="author-info">
            <img src="https://ui-avatars.com/api/?name=<?php echo urlencode($article['author']); ?>&background=random" alt="avatar">
            <div>
              <span id="author" class="author-name"><?php echo htmlspecialchars($article['author']); ?></span>
              <span id="date" class="post-date"><?php echo htmlspecialchars($article['date']); ?></span>
            </div>
          </div>
        </div>
      </header>

      <article id="content" class="entry-content">
        <?php echo $article['content']; ?>
      </article>

      <div class="subscribe-card">
        <div class="sub-icon">🔔</div>
        <div class="sub-text">
          <h3>Đừng bỏ lỡ tin tức về 
            <span id="teamName"><?php 
                if(!empty($article['team'])){
                    $teams = json_decode($article['team'], true);
                    echo htmlspecialchars(implode(", ", $teams));
                } else {
                    echo "Đội tuyển";
                }
            ?></span>
          </h3>
          <p>Nhận thông báo mới nhất về đội tuyển này ngay lập tức.</p>
        </div>
        <button onclick="subscribe()" class="btn-sub">Theo dõi</button>
      </div>
    </main>

    <aside class="sidebar">
      <div class="widget">
        <h3 class="widget-title">Bài liên quan</h3>
        <div id="related" class="related-posts">
          <?php foreach($related_posts as $post): ?>
            <div class="related-item" onclick="window.location.href='news.php?id=<?php echo $post['id']; ?>'">
              <?php if(!empty($post['banner'])): ?>
                <img src="<?php echo $post['banner']; ?>" alt="Hình bài liên quan" class="related-img">
              <?php endif; ?>
              <h4><?php echo htmlspecialchars($post['title']); ?></h4>
              <small><?php echo htmlspecialchars($post['date']); ?></small>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
      
      <div class="widget sticky-ad">
        <div class="ad-placeholder">Quảng cáo / Banner giải đấu</div>
      </div>
    </aside>
  </div>
</div>

<script>
// ===== DROPDOWN =====
const dropdown = document.querySelector(".dropdown");
if(dropdown){
  dropdown.addEventListener("click", () => {
    dropdown.classList.toggle("active");
  });
}

// ===== SUBSCRIBE =====
function subscribe(){
  const team = document.getElementById("teamName").innerText;
  alert("Đã theo dõi đội: " + team);
}
</script>

</body>
</html>