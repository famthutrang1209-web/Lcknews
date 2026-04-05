<?php
include "config.php";

if(isset($_GET['id'])){
    $id = intval($_GET['id']);

    // reset toàn bộ về 0
    $conn->query("UPDATE articles SET is_headline = 0");

    // set bài mới
    $conn->query("UPDATE articles SET is_headline = 1 WHERE id = $id");
}

header("Location: admin_dashboard.php");
exit();