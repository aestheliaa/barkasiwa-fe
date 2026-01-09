<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit;
}

$conn = mysqli_connect("localhost", "root", "", "barkasiwa");
if (!$conn) die("Koneksi gagal");

$user_id     = $_SESSION['user_id'];
$nama_barang = mysqli_real_escape_string($conn, $_POST['nama_barang']);
$kategori    = mysqli_real_escape_string($conn, $_POST['kategori']);
$harga       = (int) $_POST['harga'];
$deskripsi   = mysqli_real_escape_string($conn, $_POST['deskripsi']);

$foto_name = time() . "_" . $_FILES['foto']['name'];
$tmp       = $_FILES['foto']['tmp_name'];

$folder = "uploads/";
if (!is_dir($folder)) mkdir($folder, 0777, true);

move_uploaded_file($tmp, $folder . $foto_name);

$query = "
    INSERT INTO barang 
    (user_id, nama_barang, kategori, harga, deskripsi, foto)
    VALUES
    ($user_id, '$nama_barang', '$kategori', $harga, '$deskripsi', '$foto_name')
";

mysqli_query($conn, $query);

header("Location: index.php?upload=success");
exit;

