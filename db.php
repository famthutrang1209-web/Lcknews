<?php
$conn = new mysqli("localhost", "root", "", "esport_db");

if ($conn->connect_error) {
  die("Kết nối thất bại");
}
?>