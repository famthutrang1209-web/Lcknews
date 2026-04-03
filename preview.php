<?php
include "config.php";

$id = $_GET['id'] ?? 0;

$sql = "SELECT * FROM articles WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$article = $result->fetch_assoc();

if (!$article) {
    die("Không tìm thấy bài viết");
}
?>

<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title><?php echo $article['title']; ?></title>
<link rel="stylesheet" href="style.css">
</head>

<body>

<header class="navbar">
  <div class="nav-left">
    <div class="logo">LCK Admin</div>

    <nav class="nav-menu">
      <a href="#">Trang chủ</a>
      <a href="#">Lịch thi đấu</a>
      <a href="#">Bảng xếp hạng</a>

      <div class="dropdown">
        <div class="dropdown-toggle">
          Danh sách <span class="arrow">▼</span>
        </div>

        <div class="dropdown-menu">
          <div class="dropdown-item">Đội tuyển</div>
          <div class="dropdown-item">Tuyển thủ</div>
        </div>
      </div>

    </nav>
  </div>
</header>

<div class="container">

  <div class="article">

    <img class="banner" src="<?php echo $article['banner']; ?>">

    <h1><?php echo $article['title']; ?></h1>

    <div class="meta">
      <?php echo $article['author']; ?> - <?php echo $article['date']; ?>
    </div>

    <div id="content">
      <?php echo $article['content']; ?>
    </div>

  </div>

</div>

<script>
document.addEventListener("DOMContentLoaded", () => {

  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(drop => {
    const toggle = drop.querySelector('.dropdown-toggle');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      drop.classList.toggle('active');
    });
  });

  document.addEventListener('click', () => {
    dropdowns.forEach(d => d.classList.remove('active'));
  });

});
</script>

</body>

</html>