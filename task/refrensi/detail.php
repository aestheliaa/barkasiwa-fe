<?php
$conn = mysqli_connect("localhost", "root", "", "barkasiwa");

if (!isset($_GET['id'])) {
    echo "Produk tidak ditemukan";
    exit;
}

$id = (int) $_GET['id'];

$query = mysqli_query($conn, "SELECT * FROM barang WHERE id = $id");
$data = mysqli_fetch_assoc($query);

if (!$data) {
    echo "Produk tidak ditemukan";
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title><?= $data['nama_barang']; ?> | Barkasiwa</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header class="navbar">
    <h1 class="logo">Barkasiwa</h1>
</header>

<main class="detail-container">
    <img src="uploads/<?= $data['foto']; ?>" class="detail-image">

    <div class="detail-info">
        <h2><?= $data['nama_barang']; ?></h2>
        <p class="detail-price">Rp <?= number_format($data['harga']); ?></p>
        <p><strong>Kategori:</strong> <?= $data['kategori']; ?></p>
        <p class="detail-desc"><?= $data['deskripsi']; ?></p>

        <button class="btn-primary">Hubungi Penjual</button>
    </div>
</main>

</body>
</html>
