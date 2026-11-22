# ChronoTherapy AI

Prototipe aplikasi penelitian — versi tampilan premium v2 untuk pengembangan model prediksi kronoterapi dalam penentuan waktu pemberian obat antihipertensi.

**Pengembang:** apt. Fendy Prasetyawan, S.Farm., M.Farm.

**Judul disertasi:** Pengembangan Model Prediksi Kronoterapi Berbasis Machine Learning untuk Penentuan Waktu Pemberian Obat Antihipertensi.

## Isi proyek
- `index.html` — struktur halaman dan formulir empat tahap.
- `styles.css` — tampilan responsif.
- `app.js` — navigasi formulir, validasi input, dan keluaran prototipe.
- `manifest.webmanifest` dan `sw.js` — dukungan Progressive Web App (PWA).
- `assets/` — ikon aplikasi.

## Penting mengenai status model
Keluaran saat ini adalah **alur analisis prototipe berbasis aturan sederhana**, bukan model Machine Learning yang telah dilatih atau divalidasi secara klinis. Grafik merupakan kurva konseptual, bukan pengukuran pasien. Jangan gunakan keluaran untuk mengubah waktu atau dosis obat. Integrasi Random Forest dan validasi membutuhkan dataset penelitian yang sah, proses pelatihan, pengujian, dan validasi eksternal.

## Menjalankan melalui GitHub Pages
1. Buat repository baru di GitHub, misalnya `chronotherapy-ai`.
2. Unggah seluruh isi folder proyek ini ke root repository (pastikan `index.html` berada di root).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
6. Tunggu proses publikasi. GitHub akan menampilkan alamat website pada bagian Pages.

## Memasang di perangkat
- Android: buka alamat website menggunakan Chrome, pilih menu browser, lalu **Install app** atau **Tambahkan ke layar utama**.
- Windows/macOS: buka alamat website menggunakan Chrome atau Edge, lalu pilih ikon **Install** di bilah alamat atau menu browser.
- PWA memerlukan HTTPS; GitHub Pages menyediakan HTTPS.

## Catatan teknis
Aplikasi ini merupakan frontend statis. Belum memiliki login, database, API, atau backend Python. Jangan memasukkan identitas pasien atau data rekam medis yang dapat mengidentifikasi seseorang.
