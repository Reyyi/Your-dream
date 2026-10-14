export type LibraryCategory = "Fantasi" | "Pengetahuan";

export type LibraryEntry = {
  id: string;
  title: string;
  category: LibraryCategory;
  description: string;
  readTime: string;
  cover: string;
  accent: string;
  content: string[];
};

export const libraryEntries: LibraryEntry[] = [
  {
    id: "surat-dari-bulan",
    title: "Surat dari Bulan",
    category: "Fantasi",
    description: "Sebuah pesan kecil yang terselip di balik cahaya malam.",
    readTime: "4 menit",
    cover: "☾",
    accent: "from-indigo-200/30 via-violet-200/10 to-slate-900/10",
    content: [
      "Malam itu, Nara menemukan sebuah amplop tipis di ambang jendela. Tidak ada perangko dan tidak ada alamat, hanya sebuah gambar bulan sabit yang dibuat dengan tinta perak.",
      "Di dalamnya tertulis: “Terima kasih sudah menengadah. Kadang, itu saja sudah cukup untuk membuat malam terasa tidak terlalu luas.”",
      "Nara menyimpan surat itu di antara halaman buku kesukaannya. Sejak malam itu, setiap kali hari terasa berat, ia membuka jendela sebentar dan membiarkan cahaya bulan masuk, seperti seorang teman lama yang datang tanpa perlu banyak bicara.",
    ],
  },
  {
    id: "toko-payung",
    title: "Toko Payung di Ujung Hujan",
    category: "Fantasi",
    description: "Toko mungil yang hanya muncul untuk orang yang mau menunggu.",
    readTime: "5 menit",
    cover: "☂",
    accent: "from-cyan-100/30 via-blue-200/10 to-slate-900/10",
    content: [
      "Di jalan paling sepi, ada toko payung yang lampunya selalu menyala. Pemiliknya tidak pernah memanggil pelanggan, ia hanya menyeduh teh dan mendengarkan hujan.",
      "Suatu sore, seorang anak masuk dengan baju basah. Ia tidak punya uang, jadi si pemilik memberikan payung kuning dan berkata, “Kembalikan saja saat kamu bertemu seseorang yang membutuhkannya.”",
      "Bertahun-tahun kemudian, payung itu berpindah tangan berkali-kali. Setiap orang menambahkan satu jahitan kecil. Rupanya, kebaikan juga punya cara untuk pulang.",
    ],
  },
  {
    id: "peta-kecil",
    title: "Peta Kecil untuk Pulang",
    category: "Fantasi",
    description: "Tentang tersesat sebentar, lalu mengenali jalan sendiri.",
    readTime: "3 menit",
    cover: "⌁",
    accent: "from-amber-100/25 via-rose-200/10 to-slate-900/10",
    content: [
      "Lio menggambar peta dari rumah ke tepi danau. Ia menandai pohon yang miring, toko roti dengan aroma kayu manis, dan bangku yang menghadap matahari sore.",
      "Suatu hari peta itu tertiup angin. Lio mengejarnya sampai ke jalan yang belum pernah ia lewati. Ia takut, tetapi lalu melihat pohon miring yang dikenalnya dari sisi lain.",
      "Jalannya ternyata tidak hilang. Ia hanya menemukan sudut pandang yang baru.",
    ],
  },
  {
    id: "langit-biru",
    title: "Mengapa Langit Tampak Biru?",
    category: "Pengetahuan",
    description: "Perjalanan cahaya matahari melewati udara di sekeliling kita.",
    readTime: "2 menit",
    cover: "◌",
    accent: "from-sky-200/30 via-blue-300/10 to-slate-900/10",
    content: [
      "Cahaya matahari terlihat putih, tetapi sebenarnya terdiri dari banyak warna. Saat masuk ke atmosfer, cahaya bertemu molekul-molekul udara yang sangat kecil.",
      "Warna biru memiliki gelombang yang lebih pendek dan lebih mudah tersebar ke berbagai arah. Karena itu, dari permukaan Bumi, kita menerima cahaya biru dari seluruh langit.",
      "Saat matahari terbit atau terbenam, cahaya menempuh jalur yang lebih panjang di atmosfer. Banyak cahaya biru tersebar sebelum sampai ke mata kita, sehingga warna merah dan jingga tampak lebih kuat.",
    ],
  },
  {
    id: "gurita",
    title: "Gurita, Si Pemecah Teka-teki",
    category: "Pengetahuan",
    description: "Hewan laut cerdas dengan delapan lengan yang penuh rasa ingin tahu.",
    readTime: "2 menit",
    cover: "✳",
    accent: "from-teal-200/30 via-emerald-200/10 to-slate-900/10",
    content: [
      "Gurita memiliki sistem saraf yang istimewa: sebagian besar sel sarafnya berada di lengan. Itu membantu setiap lengan merasakan dan menjelajahi benda dengan cara yang cukup mandiri.",
      "Gurita dapat membuka wadah sederhana untuk mencari makanan, mengingat jalur, dan mengubah warna serta tekstur kulitnya untuk berkamuflase.",
      "Para peneliti masih mempelajari bagaimana gurita merasakan dunia. Kecerdasannya mengingatkan kita bahwa ada banyak cara berbeda untuk memahami lingkungan.",
    ],
  },
  {
    id: "pohon-tua",
    title: "Pohon dan Jaringan Rahasia",
    category: "Pengetahuan",
    description: "Bagaimana akar, jamur, dan tanah saling terhubung.",
    readTime: "3 menit",
    cover: "❋",
    accent: "from-lime-200/25 via-green-200/10 to-slate-900/10",
    content: [
      "Di dalam tanah, akar beberapa tumbuhan berhubungan dengan jamur mikoriza. Benang-benang jamur yang halus membantu akar menyerap air dan mineral.",
      "Hubungan ini bisa saling menguntungkan: tumbuhan memberi gula hasil fotosintesis, sementara jamur memperluas jangkauan pencarian nutrisi.",
      "Para ilmuwan meneliti bagaimana jaringan ini bekerja dalam berbagai ekosistem. Ini bukan percakapan seperti bahasa manusia, melainkan kerja sama biologis yang rumit dan menarik.",
    ],
  },
  {
    id: "kereta-kabut",
    title: "Kereta di Atas Kabut",
    category: "Fantasi",
    description: "Sebuah gerbong kayu yang meluncur perlahan di antara awan senja.",
    readTime: "4 menit",
    cover: "⟢",
    accent: "from-purple-200/30 via-slate-700/20 to-slate-900/10",
    content: [
      "Ada sebuah rel yang tidak pernah tercatat di peta mana pun. Rel itu terbentang di atas lembah kabut tebal, dan hanya dilalui satu kereta berlampu kuning temaram tepat setelah matahari terbenam.",
      "Para penumpangnya tidak pernah terburu-buru mengejar stasiun tujuan. Mereka duduk di dekat jendela kaca yang berembun, menikmati secangkir seduhan kayu manis hangat, dan menyaksikan awan yang bergulung seperti ombak di bawah roda.",
      "Kereta itu tidak dirancang untuk membawa orang ke tempat baru, melainkan memberi jeda bagi mereka yang lelah berlari. Saat penumpang akhirnya tertidur dengan tenang, kereta perlahan mengantarkan mereka pulang ke pagi yang damai.",
    ],
  },
  {
    id: "lentera-kunang-kunang",
    title: "Lentera Terakhir di Hutan Lumut",
    category: "Fantasi",
    description: "Tentang satu titik cahaya yang memandu siapa pun yang merasa tertinggal.",
    readTime: "4 menit",
    cover: "✦",
    accent: "from-amber-200/30 via-emerald-300/10 to-slate-900/10",
    content: [
      "Di kedalaman hutan lumut yang selalu basah oleh embun, ada legenda tentang seekor kunang-kunang tua yang menolak meredupkan cahayanya meski musim gugur telah tiba.",
      "Ia tinggal di dahan pohon pasak bumi, menunggu para pengembara yang kehilangan arah atau merasa langkah kakinya terlalu lambat dibandingkan orang lain.",
      "Ia tidak pernah menyuruh mereka berlari kencang. Kunang-kunang itu hanya terbang perlahan satu jengkal di depan, seolah berbisik: “Tak perlu melihat seluruh jalan di depanmu, cukup satu langkah kecil yang diterangi cahaya ini.”",
    ],
  },
  {
    id: "tarian-aurora",
    title: "Tirai Cahaya di Ujung Kutub",
    category: "Pengetahuan",
    description: "Bagaimana angin matahari dan medan magnet Bumi melukis langit malam.",
    readTime: "3 menit",
    cover: "☄",
    accent: "from-teal-200/35 via-indigo-300/15 to-slate-900/10",
    content: [
      "Jauh di lingkar kutub, langit malam kerap kali menari dengan gelombang cahaya hijau zamrud, lembayung, dan merah muda. Fenomena ini bermula dari jutaan kilometer di ruang angkasa, tepatnya badai partikel yang dilepaskan oleh Matahari.",
      "Ketika partikel bermuatan listrik ini tiba di dekat Bumi, perisai magnet planet kita membelokkannya ke arah kutub utara dan selatan. Di sanalah partikel tersebut bertabrakan dengan molekul oksigen dan nitrogen di atmosfer.",
      "Tabrakan itu melepaskan energi berupa pendaran foton cahaya. Di tengah keheningan salju abadi, aurora mengingatkan kita bahwa planet tempat kita berpijak terus aktif melindungi kehidupan dengan keindahan yang sunyi.",
    ],
  },
  {
    id: "arsitektur-mimpi",
    title: "Ke Mana Perginya Pikiran Saat Bermimpi?",
    category: "Pengetahuan",
    description: "Menjelajahi fase tidur REM dan mengapa otak kita menenun kisah tiap malam.",
    readTime: "3 menit",
    cover: "✧",
    accent: "from-rose-200/30 via-purple-300/10 to-slate-900/10",
    content: [
      "Ketika kita terlelap dan memasuki fase REM (Rapid Eye Movement), aktivitas gelombang otak kita meningkat hingga hampir menyerupai saat kita terjaga. Di saat inilah mimpi-mimpi yang paling hidup dan berkesan mulai terajut.",
      "Bagian otak bernama amigdala dan hipokampus bekerja mengolah emosi serta merapikan ingatan-ingatan dari hari yang baru lewat. Otak kita merajut fragmen-fragmen itu menjadi cerita baru yang kerap melompati batas logika dunia nyata.",
      "Mimpi bukanlah sekadar ilusi tidur tanpa arti. Ia adalah cara alami pikiran kita untuk berdialog dengan dirinya sendiri, melepas beban emosi, menyembuhkan luka batin kecil, dan merawat harapan baru sebelum fajar menjelang.",
    ],
  },
];

