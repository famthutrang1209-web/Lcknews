<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$title = $data["title"];
$content = $data["content"];
$banner = $data["banner"];
$author = $data["author"];
$date = $data["date"];
$tags = json_encode($data["tags"]);

$sql = "INSERT INTO articles (title, content, banner, author, date, tags)
VALUES ('$title', '$content', '$banner', '$author', '$date', '$tags')";

$conn->query($sql);

echo json_encode(["status" => "success"]);
?>