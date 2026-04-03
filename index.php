<?php
include "config.php";

$sql = "SELECT * FROM posts ORDER BY created_at DESC";
$result = $conn->query($sql);

while($row = $result->fetch_assoc()) {
    echo "<h2>" . $row['title'] . "</h2>";
    echo "<img src='" . $row['image'] . "' width='200'>";
    echo "<p>" . $row['content'] . "</p>";
}
?>