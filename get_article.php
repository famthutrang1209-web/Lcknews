<?php
// 1. Khai báo cho trình duyệt biết đây là dữ liệu dạng JSON
header('Content-Type: application/json');
// Cho phép các trang web khác (nếu có) truy cập API này (CORS)
header("Access-Control-Allow-Origin: *");

// 2. Kết nối tới database (Sử dụng file config chung)
include "config.php";

// 3. Lấy ID từ URL và kiểm tra tính hợp lệ
// intval() biến mọi thứ thành số nguyên, nếu là chữ sẽ thành 0
$id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

if ($id <= 0) {
    echo json_encode(["error" => "ID bài viết không hợp lệ."]);
    exit; // Dừng chương trình nếu ID sai
}

// 4. Truy vấn dữ liệu sử dụng Prepared Statement (An toàn tuyệt đối)
$stmt = $conn->prepare("SELECT * FROM articles WHERE id = ?");
$stmt->bind_param("i", $id); // "i" nghĩa là integer (số nguyên)
$stmt->execute();
$result = $stmt->get_result();

// 5. Kiểm tra xem bài viết có tồn tại trong Database không
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Giải mã chuỗi JSON của tags (nếu có) để Javascript dễ xử lý
    // Nếu tags trong DB là '["T1", "GEN"]', nó sẽ thành mảng Array trong PHP
    if (!empty($row["tags"])) {
        $row["tags"] = json_decode($row["tags"]);
    } else {
        $row["tags"] = []; // Trả về mảng rỗng nếu không có tag nào
    }

    // Trả về dữ liệu bài viết thành công
    echo json_encode($row);
} else {
    // Trường hợp ID đúng định dạng số nhưng không tìm thấy trong DB
    echo json_encode(["error" => "Không tìm thấy bài viết với ID: " . $id]);
}

// 6. Đóng kết nối để tiết kiệm tài nguyên hệ thống
$stmt->close();
$conn->close();
?>