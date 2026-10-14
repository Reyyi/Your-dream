# Your Dream | by rayvelione

> Sebuah ruang digital meneduhkan untuk memberi jeda pada pikiran, merawat mimpi, menjelajahi keajaiban sains kosmik, dan bermain santai tanpa terburu-buru.

---

## ✨ Ikhtisar Proyek

**Your Dream** adalah aplikasi web atmosferik interaktif yang dirancang sebagai tempat peristirahatan digital sebelum tidur atau di tengah hiruk-pikuk kesibukan harian. Dibangun dengan memadukan visual 3D sinematik, sintesis audio prosedural alami, kisah-kisah sains kosmik, serta permainan logika yang melatih ketenangan berpikir.

Seluruh pengalaman dirancang untuk berjalan ringan pada **60 FPS tanpa beban lag**, responsif di segala ukuran layar, serta ramah kuota tanpa perlu mengunduh berkas audio berukuran besar.

---

## 🌌 Fitur Unggulan

### 1. Kanvas Langit 3D & Cuaca Dinamis
- **Siklus Waktu 24 Jam**: Geser slider waktu untuk menyaksikan transisi atmosfer dari fajar hangat, siang cerah, senja keemasan, hingga malam bertabur bintang.
- **4 Suasana Cuaca Dinamis (GPU Shaders)**:
  - **✧ Cerah Bintang**: Langit jernih dengan jutaan kerlip bintang dan kilasan komet.
  - **🌧️ Rintik Hujan**: Gerimis butir air lembut diagonal yang menenangkan.
  - **🌫️ Kabut Senyap**: Arak-arakan asap kabut volumetrik bergulung dengan simulasi *Fractal Brownian Motion (fBm)*.
  - **✨ Tirai Aurora**: Undulasi tirai cahaya kosmik realistis dengan berkas garis geomagnetik vertikal di lapisan ionosfer.
- **Partikel Hidup**: Sekelebat bintang jatuh berkecepatan tinggi dan kunang-kunang nokturnal bercahaya lembut.

### 2. Lanskap Suara Prosedural (Web Audio API)
- Menggunakan synthesizer murni peramban tanpa berkas MP3 eksternal.
- Saluran suara alam yang dapat diatur volumenya secara mandiri:
  - Rintik hujan menenangkan
  - Gemeretak hangat api unggun kayu
  - Desir semilir angin gunung
  - Suara jangkrik malam pedesaan
- Preset relaksasi sekali sentuh (*Malam Hujan, Api Unggun, Angin Gunung, Tidur Lepas*).

### 3. Ruang Bermain (7 Mini-Games Santai & Logika)
1. **01. Napas Awan**: Panduan ritme pernapasan lambat untuk meredakan ketegangan dada dan pikiran.
2. **02. Pasang Ingatan**: Mengasah daya ingat visual dengan menemukan pasangan simbol rasi sesedikit mungkin.
3. **03. Rasi Senyap**: Menghubungkan bintang bernomor untuk mengungkap bentuk konstelasi tersembunyi.
4. **04. Lonceng Angin**: Sintesis nada genta kristal interaktif yang beresonansi merdu saat disentuh.
5. **05. Lentera Malam**: Menuliskan niat atau harapan kecil, menyalakan lentera, dan melepasnya ke angkasa.
6. **06. Prisma Cahaya Bintang**: Teka-teki logika optik untuk mengasah otak dengan memutar sudut pantulan prisma 90 derajat demi memandu berkas foton ke mercusuar tujuan.
7. **07. Kanvas Rasi Mandiri**: Ruang bebas untuk menabur bintang di kanvas malam, menyambungkan garis konstelasi, memberi nama rasi karya sendiri, dan menyimpannya ke galeri pribadi.

### 4. Jurnal, Toples Bintang & Lembar Pengingat
- **Toples Bintang Kaca**: Wadah menitipkan pikiran sebelum tidur. Tulis harapan, hal yang ingin diikhlaskan, atau ide acak, lalu lipat menjadi bintang kertas kaca bercahaya.
- **Lembar Pengingat**: 8 bacaan kontemplatif bertema sains kosmik nyata (foton bintang purba, sistem pembersihan racun otak CSF saat tidur, jaringan miselium hutan, dan orbit gravitasi).
- **Bisikan Langit Harian**: Kutipan perenungan yang berganti otomatis setiap hari.
- **Privat**: Semua catatan tersimpan secara aman di peramban lokal pengunjung (*localStorage*).

### 5. Perpustakaan Cerita
- Kumpulan kisah fiksi hangat dan esai sains pendek untuk menemani istirahat malam.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Kerangka Kerja**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Grafika 3D**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), dan *Custom GLSL Shaders*
- **Sintesis Audio**: Native Web Audio API (prosedural oscillators, noise buffers, and biquad filters)
- **Tata Gaya**: [Tailwind CSS](https://tailwindcss.com/) dengan dukungan *glassmorphism* dan *responsive clamp typography*
- **Pengelola Status**: [Zustand](https://github.com/pmndrs/zustand)
- **Optimasi Produksi**: Netlify Edge Runtime via `@netlify/plugin-nextjs`

---

## 🚀 Menjalankan Proyek Secara Lokal

Pastikan Anda telah memasang **Node.js 20+** pada komputer Anda.

```bash
# 1. Klon repositori ini
git clone https://github.com/Reyyi/Your-dream.git

# 2. Masuk ke direktori proyek
cd Your-dream

# 3. Pasang seluruh dependensi
npm install --legacy-peer-deps

# 4. Jalankan server pengembangan
npm run dev
```

Buka peramban Anda di [http://localhost:3000](http://localhost:3000) untuk mulai menikmati pengalaman Your Dream.

---

## 🌐 Panduan Deploy ke Netlify

Proyek ini telah dilengkapi berkas konfigurasi resmi `netlify.toml`:

1. Buka [Netlify](https://app.netlify.com) dan masuk ke akun Anda.
2. Klik **Add new site ➔ Import an existing project**.
3. Pilih repositori **Reyyi/Your-dream**.
4. Netlify akan secara otomatis mengenali pengaturan build dari `netlify.toml`.
5. Tekan tombol **Deploy** dan situs Anda akan aktif dalam 1-2 menit.

---

## 🌿 Filosofi Desain

Proyek ini dibuat dengan komitmen:
- Tanpa tema percintaan klise. Fokus penuh pada kebijaksanaan hidup, ketenangan batin, logika alam, dan eksplorasi sains semesta.
- Tipografi yang bersih dan nyaman dipandang mata.
- Performa tinggi dengan ukuran berkas awal (*First Load JS*) hanya sekitar 115 kB.

---

Dibuat dengan rasa kagum pada alam semesta oleh **rayvelione**.
