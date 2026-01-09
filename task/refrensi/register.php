<?php
$conn = mysqli_connect("localhost", "root", "", "barkasiwa");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nama        = $_POST['nama'];
    $asal_kampus = $_POST['asal_kampus'];
    $email       = $_POST['email'];
    $password    = password_hash($_POST['password'], PASSWORD_DEFAULT);

    mysqli_query($conn, "
        INSERT INTO users (nama, asal_kampus, email, password)
        VALUES ('$nama', '$asal_kampus', '$email', '$password')
    ");

    header("Location: login.html");
    exit;
}
