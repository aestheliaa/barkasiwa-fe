<?php
session_start();

$conn = mysqli_connect("localhost", "root", "", "barkasiwa");

$email    = $_POST['email'];
$password = $_POST['password'];

// 1️⃣ QUERY DULU
$query = mysqli_query($conn, "SELECT * FROM users WHERE email='$email'");

// 2️⃣ AMBIL DATA USER
$user  = mysqli_fetch_assoc($query);

// 3️⃣ BARU CEK PASSWORD
if ($user && password_verify($password, $user['password'])) {

    $_SESSION['user_id']   = $user['id'];
    $_SESSION['user_nama'] = $user['nama'];

    header("Location: index.php");
    exit;
} else {
    echo "Login gagal";
}
