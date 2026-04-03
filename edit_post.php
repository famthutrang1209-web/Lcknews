<?php
include "config.php";

$id = $_POST['id'];
$title = $_POST['title'];
$content = $_POST['content'];

$sql = "UPDATE posts 
        SET title='$title', content='$content'
        WHERE id=$id";

$conn->query($sql);

header("Location: admin.php");
?>