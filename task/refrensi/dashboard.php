<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit;
}

$conn = mysqli_connect("localhost", "root", "", "barkasiwa");
$user_id = $_SESSION['user_id'];
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard | Barkasiwa</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header class="navbar">
    <h1 class="logo">Barkasiwa</h1>
    <a href="index.php">Beranda</a>
    <a href="logout.php">Logout</a>
</header>

<main class="dashboard">

    <h2>Halo, <?= $_SESSION['user_nama']; ?></h2>
    <p>Selamat datang di dashboard penjual kamu</p>

    <h3>Barang yang Kamu Jual</h3>

    <div class="product-list">
        <?php
        $query = mysqli_query($conn, "
            SELECT * FROM barang
            WHERE user_id = $user_id
            ORDER BY id DESC
        ");

        if (mysqli_num_rows($query) === 0) {
            echo "<p>Kamu belum mengunggah barang.</p>";
        }

        while ($b = mysqli_fetch_assoc($query)):
        ?>
            <div class="product-card">
                <img src="uploads/<?= $b['foto']; ?>" width="150">
                <p><?= $b['nama_barang']; ?></p>
                <p>Rp <?= $b['harga']; ?></p>

                <a href="edit_barang.php?id=<?= $b['id']; ?>">Edit</a> |
                <a href="hapus_barang.php?id=<?= $b['id']; ?>"
                   onclick="return confirm('Yakin hapus barang ini?')">
                   Hapus
                </a>
            </div>
        <?php endwhile; ?>
    </div>

</main>

</body>
</html>
