<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . "/config.php";

if ($conn->connect_error) {
    echo json_encode(["status"=>"error","message"=>"DB lỗi"]);
    exit();
}

$title   = $_POST['title'] ?? '';
$content = $_POST['content'] ?? '';
$image   = $_POST['image'] ?? '';
$author  = $_POST['author'] ?? 'Admin';
$date    = $_POST['date'] ?? date("Y-m-d");

$sql = "INSERT INTO articles (title, content, banner, author, date) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status"=>"error","message"=>$conn->error]);
    exit();
}

$stmt->bind_param("sssss", $title, $content, $image, $author, $date);

if ($stmt->execute()) {
    $id = $conn->insert_id;

    echo json_encode([
        "status" => "success",
        "id" => $id
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $stmt->error
    ]);
}

$conn->close();
?>