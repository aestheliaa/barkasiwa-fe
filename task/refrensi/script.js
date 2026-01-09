function waktuPosting(menit) {
    if (menit < 60) return menit + " menit lalu";
    if (menit < 1440) return Math.floor(menit / 60) + " jam lalu";
    return Math.floor(menit / 1440) + " hari lalu";
}

document.addEventListener('DOMContentLoaded', () => {

    fetch('/final_project/get_produk.php')
        .then(res => res.json())
        .then(data => {

            const productList = document.getElementById('productList');
            const emptyState = document.getElementById('emptyState');

            let html = '';

            if (data.length === 0) {
                emptyState.style.display = 'block';
                productList.innerHTML = '';
                return;
            }

            emptyState.style.display = 'none';

            data.forEach(p => {
                html += `
                <a href="/final_project/detail.php?id=${p.id}" class="product-link">
                    <div class="product-card">

                        <div class="seller-info">
                            <span class="seller-name">
                                ${p.nama} • ${p.asal_kampus}
                            </span>
                            <span class="post-time">
                                ${waktuPosting(p.menit_lalu)}
                            </span>
                        </div>

                        <img src="/final_project/uploads/${p.foto}" class="product-image">

                        <div class="product-body">
                            <p class="product-name">${p.nama_barang}</p>
                            <p class="product-price">Rp ${p.harga}</p>
                        </div>

                    </div>
                </a>
                `;
            });

            // 🔥 PINDAHKAN KE SINI
            productList.innerHTML = html;

        })
        .catch(err => {
            console.error(err);
        });

});
