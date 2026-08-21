RAKHA HAYYA PORTFOLIO — VERCEL CMS

Struktur:
- index.html              = website publik
- content/certificates.json = daftar sertifikat
- content/news.json         = daftar berita
- admin/index.html        = panel admin
- api/*                   = login + API untuk update JSON ke GitHub

KONTAK TIDAK DIUBAH:
Form "Hubungi Saya" tetap menggunakan Formspree yang ada di index.html.

SETUP VERCEL (Windows):
1. Upload folder ini ke repository GitHub BARU, misalnya rakha-portfolio.
2. Di Vercel pilih Add New Project -> import repository tersebut.
3. Framework Preset: Other.
4. Build Command: kosongkan.
5. Output Directory: . (root).
6. Deploy.
7. Project -> Settings -> Environment Variables, buat:
   ADMIN_PASSWORD = password admin yang kuat
   GITHUB_TOKEN  = GitHub Fine-grained PAT dengan akses Contents: Read and write
   GITHUB_OWNER  = RakhaHayyaIlhamsyah
   GITHUB_REPO   = nama repository WEBSITE ini (bukan repo gambar)
   GITHUB_BRANCH = main
8. Redeploy setelah environment variables dibuat.

ADMIN:
Buka https://DOMAIN-KAMU.vercel.app/admin/
Login dengan ADMIN_PASSWORD.
Tambah/edit/hapus sertifikat dan berita lalu klik "Simpan Semua".
Sistem akan membuat commit ke repository website melalui GitHub API. Vercel kemudian otomatis melakukan deployment dari commit baru.

SUMBER GAMBAR:
Sertifikat awal memakai gambar dari repository:
https://github.com/RakhaHayyaIlhamsyah/gambar
Untuk sertifikat baru, masukkan URL gambar raw GitHub, misalnya:
https://raw.githubusercontent.com/RakhaHayyaIlhamsyah/gambar/main/NAMA%20FILE.jpg

CATATAN:
- Jangan pernah memasukkan GITHUB_TOKEN ke index.html atau admin JavaScript.
- Token hanya disimpan sebagai Environment Variable Vercel dan dipakai oleh /api.
- Jika repository website private, Vercel tetap dapat deploy setelah akun GitHub terhubung.
