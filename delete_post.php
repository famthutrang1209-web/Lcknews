<?php
include "config.php";

$id = $_GET['id'];

$sql = "DELETE FROM posts WHERE id=$id";
$conn->query($sql);

header("Location: admin.php");
?>