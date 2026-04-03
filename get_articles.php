<?php
// 1. Khai báo kiểu dữ liệu JSON
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 2. Kết nối tới database
include "config.php";

// 3. Truy vấn lấy tất cả bài viết, sắp xếp bài mới nhất lên đầu
// Nếu bạn chưa có cột created_at, có thể dùng ORDER BY id DESC
$sql = "SELECT * FROM articles ORDER BY id DESC";
$result = $conn->query($sql);

$articles = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Giải mã tags từ JSON string trong DB thành mảng để JS dễ dùng
        if (!empty($row["tags"])) {
            $row["tags"] = json_decode($row["tags"]);
        } else {
            $row["tags"] = [];
        }
        
        $articles[] = $row;
    }
}

// 4. Trả về mảng danh sách bài viết (Nếu trống sẽ trả về [])
echo json_encode($articles);

// 5. Đóng kết nối
$conn->close();
?>