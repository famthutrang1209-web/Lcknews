<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Admin Editor - LCK News</title>
  <link rel="stylesheet" href="style_trg.css">
</head>
<body>

<?php
include "config.php";

// Khởi tạo biến rỗng cho form
$editMode = false;
$title = '';
$author = '';
$date = '';
$banner = '';
$content = '';
$tags = '';

// Kiểm tra có id truyền từ admin_dashboard không
if (isset($_GET['id'])) {
    $editMode = true;
    $id = intval($_GET['id']); // bảo vệ SQL injection

    $sql = "SELECT * FROM articles WHERE id = $id LIMIT 1";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $title = $row['title'];
        $author = $row['author'];
        $date = $row['date'];
        $banner = $row['banner'];
        $content = $row['content'];
        $tags = $row['tags'];
    } else {
        // Nếu id không tồn tại, chuyển về trang tạo mới
        header("Location: admin.php");
        exit();
    }
}
?>

<header class="navbar">
  <div class="nav-left">
    <div class="logo">LCK Admin</div>
    <nav class="nav-menu">
      <a href="index.php">Trang chủ</a>
      <a href="#">Lịch thi đấu</a>
      <a href="#">Bảng xếp hạng</a>

      <div class="dropdown">
        <div class="dropdown-toggle">
          Danh sách <span class="arrow">▼</span>
        </div>
        <ul class="dropdown-menu">
          <li><a href="teams.php">Đội tuyển</a></li>
          <li><a href="players.php">Tuyển thủ</a></li>
        </ul>
      </div>
    </nav>
  </div>
</header>

<form id="postForm" method="POST" action="add_post.php">

  <div class="editor-container">

    <div class="editor" id="editor">

      <div class="block banner-block" id="bannerBlock" contenteditable="true">
        Thêm ảnh banner...
      </div>

      <input type="text" id="titleInput" class="block title" placeholder="Thêm tiêu đề...">

      <div class="meta-block">
        <input type="text" id="authorInput" placeholder="Tác giả (Ví dụ: Admin LCK)..." />
        <input type="text" id="dateInput" placeholder="Thời gian (Ngày/Tháng/Năm)..." />
      </div>

      <div class="tag-box">
        <p>Phân loại nội dung theo Đội tuyển</p>
        <div class="team-list" id="teamList"></div>
      </div>

      <div class="block" contenteditable="true" id="mainContentBlock">
        Thêm nội dung bài viết tại đây...
      </div>

    </div>

    <div class="sidebar">
      <h3>Bài liên quan</h3>
      <div class="side-block" onclick="addRelated()">+ Thêm bài liên quan</div>
      <div id="related-list"></div>
    </div>

  </div>

  <div class="block" style="text-align:right; background: none; border: none;">
    <button type="submit" class="post-btn">Đăng bài ngay</button>
  </div>

  <input type="hidden" name="title" id="hiddenTitle">
  <input type="hidden" name="content" id="hiddenContent">
  <input type="hidden" name="image" id="hiddenImage"> 
  <input type="hidden" name="tags" id="hiddenTags">
  <input type="hidden" name="author" id="hiddenAuthor">
  <input type="hidden" name="date" id="hiddenDate">

</form>

<script src="editor.js?v=<?php echo time(); ?>"></script>

</body>
</html>


