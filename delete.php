<?php
include "config.php";

if(isset($_GET['id'])){
    $id = intval($_GET['id']);

    $sql = "DELETE FROM articles WHERE id = $id";
    $conn->query($sql);
}

header("Location: admin_dashboard.php");
exit();