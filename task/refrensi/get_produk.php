<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$conn = mysqli_connect("localhost", "root", "", "barkasiwa");
if (!$conn) {
    echo json_encode([]);
    exit;
}

$query = "
    SELECT 
        barang.id,
        barang.nama_barang,
        barang.harga,
        barang.foto,
        barang.created_at,
        users.nama,
        users.asal_kampus,
        TIMESTAMPDIFF(MINUTE, barang.created_at, NOW()) AS menit_lalu
    FROM barang
    JOIN users ON barang.user_id = users.id
    ORDER BY barang.created_at DESC
";

$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode([
        "error" => mysqli_error($conn)
    ]);
    exit;
}

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

// KIRIM KE JS
echo json_encode($data);
