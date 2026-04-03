<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . "/config.php";

if ($conn->connect_error) {
    die("Lỗi kết nối DB: " . $conn->connect_error);
}

$title   = $_POST['title'] ?? '';
$content = $_POST['content'] ?? '';
$image   = $_POST['image'] ?? '';
$author  = $_POST['author'] ?? 'Admin';
$date    = $_POST['date'] ?? date("Y-m-d");

// chuẩn bị câu lệnh
$sql = "INSERT INTO articles (title, content, banner, author, date) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Lỗi prepare: " . $conn->error);
}

$stmt->bind_param("sssss", $title, $content, $image, $author, $date);

if ($stmt->execute()) {

    // 🔥 LẤY ID BÀI VỪA TẠO
    $id = $conn->insert_id;

    // 🔥 CHUYỂN SANG TRANG PREVIEW
    header("Location: preview.php?id=" . $id);
    exit();

} else {
    echo "Lỗi khi insert: " . $stmt->error;
}

$conn->close();
?>