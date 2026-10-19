# Pemesanan Menu Kantin Sanata Dharma

Aplikasi web untuk memesan makanan dan minuman Kantin Sanata Dharma. Dibuat dengan React.js, React Router, dan Vite. Data keranjang, pesanan, dan pesan kontak disimpan di localStorage browser, sehingga tidak memakai backend atau database.

## Cara menjalankan

Prasyarat: Node.js 20.19 atau lebih baru (disarankan 22 LTS). Cek dengan `node -v`.

```bash
npm install
npm run dev
```

Buka alamat yang tampil di terminal (biasanya http://localhost:5173). Jangan dibuka lewat Live Server, karena JSX harus diproses Vite terlebih dahulu.

Build produksi: `npm run build`, lalu `npm run preview`.

## Halaman

| Rute | Halaman | Fungsi |
|---|---|---|
| / | Beranda | Pengantar, menu andalan, cara memesan |
| /menu | Menu | Daftar menu, pencarian, filter kategori, tambah ke pesanan |
| /pesanan | Pesanan | Ubah jumlah, form data pemesan dengan validasi |
| /ringkasan, /ringkasan/:id | Ringkasan Pemesanan | Struk, status otomatis, batal, cetak, hapus, riwayat |
| /kontak | Kontak | Info kantin dan form kirim pesan |

Alamat lain dialihkan ke Beranda.

## Fitur

- Keranjang dengan jumlah per item (maks 20), total otomatis, badge jumlah di navbar
- Pencarian menu dan filter kategori; menu yang habis tidak bisa dipesan
- Validasi form: nama, nomor WhatsApp, nomor meja (wajib bila diantar), waktu ambil yang sudah lewat, catatan, email, dan pesan
- Status pesanan otomatis Diproses → Siap diambil (simulasi dapur 20 detik dengan useEffect)
- Data tersimpan di localStorage dan tetap ada setelah refresh
- Tampilan responsif dan dapat dioperasikan dengan keyboard

## Struktur folder

```
src/
  components/   Navbar, Footer, Card, FormField, EmptyState, StatusBadge,
                AddButton, MenuRow, MenuThumb, QtyStepper
  pages/        Beranda, Menu, Pesanan, Ringkasan, Kontak
  context/      KantinContext (keranjang, pesanan, pesan kontak)
  hooks/        useLocalStorage, usePageTitle, useNow
  data/         menu.js (data contoh)
  utils/        format.js, jam.js
```

## Skenario pengujian

Diuji di Google Chrome pada localhost (`npm run dev`), tampilan desktop dan mode ponsel 375 px di DevTools.

| No | Skenario | Hasil yang diharapkan | Status uji |
|---|---|---|---|
| 1 | Klik "Menu" di navbar dari Beranda | Tampil halaman Menu | sesuai |
| 2 | Klik "Beranda" di navbar dari halaman Ringkasan Pemesanan | Tampil halaman Beranda | sesuai |
| 3 | Buka alamat yang tidak terdaftar, misalnya /menu/ayam-geprek | Dialihkan ke Beranda | sesuai |
| 4 | Klik Tambah pada Ayam Geprek dua kali | Badge navbar 2, tombol "Tambah (2)", total di Pesanan Rp 30.000 | sesuai |
| 5 | Cari "xyz" di Menu, lalu klik Reset pencarian | Tampil pesan tidak ada yang cocok; setelah reset 14 menu tampil lagi | sesuai |
| 6 | Klik filter kategori Minuman | Hanya 5 menu minuman yang tampil | sesuai |
| 7 | Lihat baris Nasi Pecel (stok habis) | Label Habis, tidak ada tombol Tambah | sesuai |
| 8 | Klik Tambah pada Es Teh Manis 20 kali | Tombol berubah "Maks 20" dan nonaktif; tombol + di Pesanan nonaktif | sesuai |
| 9 | Klik Kosongkan di halaman Pesanan | Tampil pesan pesanan kosong dan tombol Buka menu | sesuai |
| 10 | Klik Buat pesanan dengan nama dan WhatsApp kosong | Error di kedua kolom, kursor pindah ke kolom Nama, pesanan tidak dibuat | sesuai |
| 11 | Isi WhatsApp "12345" lalu pindah kolom | Muncul error "Format nomor tidak valid" | sesuai |
| 12 | Pilih Antar ke meja tanpa nomor meja, lalu isi 41 | Error "wajib diisi", lalu error "antara 1 sampai 40" | sesuai |
| 13 | Buka Pesanan setelah pukul 13.00 | Slot waktu yang sudah lewat nonaktif dan bertanda "(sudah lewat)"; Secepatnya tetap bisa dipilih | sesuai |
| 14 | Isi form dengan data valid lalu klik Buat pesanan | Pindah ke Ringkasan, tampil kode KNT-..., status Diproses, keranjang kosong | sesuai |
| 15 | Refresh halaman Ringkasan Pemesanan | Pesanan tetap tampil (tersimpan di localStorage) | sesuai |
| 16 | Tunggu 20 detik, lalu klik Tandai sudah diambil dan refresh | Status Diproses → Siap diambil → Selesai, tetap setelah refresh | sesuai |
| 17 | Buat pesanan kedua lalu klik Batalkan pesanan | Status Dibatalkan, pesanan pertama tampil di riwayat | sesuai |
| 18 | Kirim form Kontak dengan email "abc" | Error format email, kursor pindah ke kolom Email | sesuai |
| 19 | Kirim form Kontak dengan data valid | Pesan sukses tampil, form kosong lagi, "1 pesan tersimpan" | sesuai |
| 20 | Layar 375 px: buka kelima halaman dan pakai tombol Menu di navbar | Navbar jadi tombol Menu, tidak ada scroll horizontal, navigasi berfungsi | sesuai |
| 21 | Layar 1280 px: buka Pesanan | Navbar mendatar, form data pemesan di samping daftar item | sesuai |
