# Galaxy BookStore
Website statis elegan bernuansa galaksi. Termasuk: slider, keranjang belanja (localStorage), checkout (mock), formulir kontak, dan peta embed.

## Struktur
- `index.html`
- `styles.css`
- `script.js`
- `assets/` (ikon & slide svg)

## Cara Jalankan Lokal
Cukup buka `index.html` di browser modern.

## Deploy ke GitHub Pages
1. Buat repo baru di GitHub bernama `galaxy-bookstore` (atau apa pun).
2. Upload semua file/folder di direktori ini ke repo tersebut (root).
3. Buka **Settings → Pages**.
4. Pilih **Source: Deploy from a branch**. Branch: `main`, Folder: `/ (root)` → **Save**.
5. Tunggu proses build selesai, lalu akses URL GitHub Pages yang diberikan.

Catatan:
- Keranjang & checkout menggunakan `localStorage` sehingga data tersimpan di perangkat pengunjung.
- Peta menggunakan embed Google Maps; ganti `src` pada `<iframe>` dengan alamat toko yang akurat.
