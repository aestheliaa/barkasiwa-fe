<?php
session_start();

$conn = mysqli_connect("localhost", "root", "", "barkasiwa");
if (!$conn) {
    die("Koneksi gagal");
}

// HITUNG JUMLAH PRODUK
$result = mysqli_query($conn, "SELECT COUNT(*) AS total FROM barang");
$data   = mysqli_fetch_assoc($result);
$total_produk = $data['total'];
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barkasiwa | Marketplace Mahasiswa</title>

    <!-- CSS -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- ================= HEADER / NAVBAR ================= -->
    <header class="navbar">
        <div class="navbar-left">
            <h1 class="logo">Barkasiwa</h1>

            <nav class="nav-menu">
                <a href="#">Elektronik</a>
                <a href="#">Pakaian</a>
                <a href="#">Kesehatan</a>
                <a href="#">Perlengkapan Kos</a>
                <a href="#">Alat Tulis</a>
                <a href="#">All Categories</a>
            </nav>
        </div>

        <div class="navbar-right">
                <?php if (isset($_SESSION['user_id'])): ?>

                <span>Halo, <?= htmlspecialchars($_SESSION['user_nama']) ?></span>

                <a href="dashboard.php">Dashboard</a>

                <a href="upload.html" class="sell-btn">Jual</a>

                <a href="logout.php">Logout</a>

            <?php else: ?>

                <a href="register.html">Register</a>
                <a href="login.html">Login</a>
                <a href="login.html" class="sell-btn">Jual</a>

            <?php endif; ?>

        </div>
    </header>

    <!-- ================= MAIN CONTENT ================= -->
    <main>

        <!-- SEARCH BAR -->
        <section class="search-bar">
            <form id="searchForm">
                <input 
                    type="text" 
                    id="searchInput"
                    placeholder="Search for an item"
                >

                <select id="searchLocation">
                    <option value="indonesia">Indonesia</option>
                </select>

                <button type="submit">Search</button>
            </form>
        </section>

        <!-- BANNER / PROMO -->
        <section class="banner">
            <div class="banner-item">
                <h2>Baru untuk Anda</h2>
                <p><?= $total_produk ?> produk baru saja ditambahkan</p>
            </div>
        </section>

        <!-- EXPLORE CATEGORIES -->
        <section class="explore">
            <h2>Explore</h2>

            <div class="category-list">
                <div class="category-item">Pakaian Wanita</div>
                <div class="category-item">Pakaian Pria</div>
                <div class="category-item">Kecantikan & Kesehatan</div>
                <div class="category-item">Elektronik</div>
                <div class="category-item">Buku & Alat Tulis</div>
                <div class="category-item">Perlengkapan Kos</div>
                <div class="category-item">Lain-lain</div>
            </div>
        </section>

        <!-- RECOMMENDED PRODUCTS -->
        <section class="recommended">
            <h2>Recommended For You</h2>

            <!-- 
                WADAH PRODUK
                Data akan diisi secara dinamis oleh PHP / JavaScript
            -->
            <div class="product-list" id="productList">

                <!-- 
                    KOSONG DENGAN SENGAJA
                    Backend akan mengisi card produk di sini
                -->

            </div>

            <!-- OPTIONAL EMPTY STATE -->
                <p class="empty-state" id="emptyState">
                    Produk akan muncul setelah pengguna mengunggah barang.
                </p>
        </section>

    </main>

    <!-- ================= FOOTER ================= -->
    <footer class="footer">
        <p>&copy; 2025 Barkasiwa. All rights reserved.</p>
    </footer>

        <!-- JS -->
    <script src="script.js"></script>
</body>
</html>
