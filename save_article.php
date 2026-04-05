<?php
include "db.php";

// Lấy dữ liệu JSON từ request
$data = json_decode(file_get_contents("php://input"), true);

$id      = $data["id"] ?? null;      // ID nếu có, dùng để sửa
$title   = $data["title"];
$content = $data["content"];
$banner  = $data["banner"];
$author  = $data["author"];
$date    = $data["date"];
$tags    = json_encode($data["tags"]);

// Nếu có ID => UPDATE, không có ID => INSERT
if($id){
    // UPDATE bài viết
    $sql = "UPDATE articles 
            SET title='$title', content='$content', banner='$banner', author='$author', date='$date', tags='$tags' 
            WHERE id=$id";
} else {
    // Thêm bài mới
    $sql = "INSERT INTO articles (title, content, banner, author, date, tags) 
            VALUES ('$title', '$content', '$banner', '$author', '$date', '$tags')";
}

if($conn->query($sql)){
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>