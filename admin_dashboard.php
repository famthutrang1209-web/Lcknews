<?php
include "config.php";
?>

<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Admin - LCK</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="style_bch.css">
</head>

<body>

<!-- NAVBAR -->
<nav class="navbar navbar-expand-lg navbar-dark">
<div class="container">

<a class="navbar-brand">
    <img src="images/lck-logo.png" class="logo">
</a>

<ul class="navbar-nav">
<li class="nav-item"><a class="nav-link" href="admin_dashboard.php">TRANG CHỦ</a></li>
<li class="nav-item"><a class="nav-link" href="#">LỊCH THI ĐẤU</a></li>
<li class="nav-item"><a class="nav-link" href="#">BẢNG XẾP HẠNG</a></li>
<li class="nav-item"><a class="nav-link" href="#">DANH SÁCH</a></li>
</ul>

<div>
<span id="usernameDisplay"></span>
<button class="login-btn" onclick="logout()">ĐĂNG XUẤT</button>
</div>

</div>
</nav>

<!-- HERO FULL BANNER -->
<?php
$headline_sql = "SELECT * FROM articles WHERE is_headline = 1 LIMIT 1";
$headline_result = $conn->query($headline_sql);
$headline = $headline_result->fetch_assoc();
?>

<?php if($headline): ?>
<section class="hero">
    <img src="<?php echo $headline['banner']; ?>" alt="Banner">

    <div class="headline-text">
        <?php echo htmlspecialchars($headline['title']); ?>
    </div>

    <div class="hero-bottom">
        <button class="watch-btn" onclick="openArticle(<?php echo $headline['id']; ?>)">
            XEM NGAY
        </button>
        <h3><?php echo $headline['date']; ?></h3>
    </div>
</section>
<?php else: ?>
<h1 style="padding:100px; color:white;">Chưa có headline</h1>
<?php endif; ?>

<div class="row">

<?php
$sql = "SELECT * FROM articles ORDER BY id DESC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0):
while($row = $result->fetch_assoc()):
?>

<div class="col-md-4">
  <div class="news-card">
    
    <!-- Hình click được -->
    <a href="news.php?id=<?php echo $row['id']; ?>">
        <img src="<?php echo $row['banner']; ?>" alt="<?php echo htmlspecialchars($row['title']); ?>">
    </a>

    <div class="news-content">
      <!-- Tiêu đề click được -->
      <h4>
        <a href="news.php?id=<?php echo $row['id']; ?>" class="news-link">
            <?php echo htmlspecialchars($row['title']); ?>
        </a>
      </h4>

      <p><?php echo $row['date']; ?></p>

      <div class="admin-actions">
        <button onclick="editArticle(<?php echo $row['id']; ?>)">Sửa</button>
        <button onclick="deleteArticle(<?php echo $row['id']; ?>)">Xóa</button>
        <button onclick="setHeadline(<?php echo $row['id']; ?>)">⭐ Headline</button>
      </div>
    </div>
  </div>
</div>

<?php
endwhile;
else:
echo "<p style='color:white'>Chưa có bài viết nào</p>";
endif;
?>
<!-- JS ĐÚNG -->
<script src="admin_dashboard.js"></script>

</body>
</html>
