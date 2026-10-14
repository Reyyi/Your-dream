// Koleksi lembar pengingat kontemplatif
// Ditulis dengan POV langsung dari pembuat ruang ini (aku).
// Berisi kebijaksanaan hidup, logika sains yang menenangkan, dan imajinasi fantasi yang menyenangkan.
// Tanpa tema cinta/romantisme, tanpa tanda titik koma, dan tanpa garis panjang.

export type ReminderItem = {
  id: string;
  title: string;
  subtitle: string;
  category: "Sains Kosmik" | "Fantasi Tenang" | "Logika & Hidup" | "Alam Semesta";
  quote: string;
  readTime: string;
  paragraphs: string[];
};

export const reminders: ReminderItem[] = [
  {
    id: "ingat-1-bintang",
    title: "Cahaya Bintang yang Menempuh Jutaan Tahun",
    subtitle: "Tentang perjalanan foton dan kehadiranmu di bawah langit",
    category: "Sains Kosmik",
    quote: "Bintang itu menembus kehampaan selama jutaan tahun hanya untuk mendarat tepat di matamu malam ini.",
    readTime: "2 mnt",
    paragraphs: [
      "Ketika kamu mendongak ke langit malam ini, sadarilah satu hal menarik. Cahaya dari bintang yang sedang kamu tatap sudah memulai perjalanannya jutaan tahun lalu, jauh sebelum kota ini dibangun dan jauh sebelum kita lahir.",
      "Partikel cahaya itu melintasi ruang hampa yang beku, melewati debu galaksi, lalu menembus atmosfer bumi hanya untuk berakhir di pupil matamu. Perjalanan kosmik yang begitu panjang bertemu dengan kesadaranmu detik ini.",
      "Aku menulis ini agar kamu ingat bahwa kehadiranmu bukan kebetulan yang sepele. Kamu adalah bagian dari alam semesta yang sedang mengamati dirinya sendiri. Masalahmu hari ini memang nyata, tetapi jangan biarkan ia menenggelamkan rasa kagummu pada keajaiban besar yang sedang menaungimu.",
    ],
  },
  {
    id: "ingat-2-pohon",
    title: "Jaringan Rahasia Akar Pohon di Bawah Hutan",
    subtitle: "Bagaimana alam mengajarkan kita untuk saling menopang dalam diam",
    category: "Alam Semesta",
    quote: "Bahkan di lantai hutan yang paling gelap, tidak ada satu pohon pun yang dibiarkan berjuang sendirian.",
    readTime: "2 mnt",
    paragraphs: [
      "Ada fakta biologi yang selalu membuatku kagum. Di bawah tanah hutan lebat, ada jaringan miselium jamur mikroskopis yang saling mengaitkan akar dari pohon-pohon yang berbeda jenis.",
      "Para ilmuwan menemukan bahwa ketika ada satu pohon kecil yang kekurangan sinar matahari atau sedang sakit, pohon-pohon besar di sekitarnya mengirimkan gula dan nutrisi melalui jaringan bawah tanah itu. Tanpa suara, tanpa pamer, alam bekerja dalam keselarasan yang tenang.",
      "Jika malam ini kamu merasa kesepian atau terasing, ingatlah bahwa kamu tetap bagian dari ekosistem kehidupan yang luas. Terkadang kita merasa sendirian hanya karena kita lupa melihat jaring kebaikan tak terlihat yang sesungguhnya ada di sekeliling kita.",
    ],
  },
  {
    id: "ingat-3-otak",
    title: "Mekanisme Otak Membersihkan Diri Saat Tidur",
    subtitle: "Logika biologis di balik pentingnya meletakkan hari ini",
    category: "Logika & Hidup",
    quote: "Istirahat bukan tanda kelemahan, melainkan proses biologis paling cerdas untuk memulihkan kejernihanmu.",
    readTime: "2 mnt",
    paragraphs: [
      "Secara sains, saat kita tidur lelap, sel otak kita sebenarnya menyusut sekitar enam puluh persen untuk memberi ruang bagi cairan serebrospinal mengalir. Cairan ini bekerja persis seperti ombak kecil di pantai, membersihkan racun sisa metabolisme yang menumpuk selama kamu berpikir seharian.",
      "Otakmu juga menggunakan malam hari untuk memilah memori, mengarsipkan pengalaman penting, dan membuang detail yang tidak berguna. Kamu tidak sedang membuang waktu saat tidur.",
      "Jadi ketika kamu tergoda untuk terus begadang memikirkan hal-hal yang belum selesai, ingatkan logikamu. Pikiranmu butuh siklus pembersihan ini agar besok pagi kamu bisa berpikir dengan jernih, tajam, dan tenang kembali.",
    ],
  },
  {
    id: "ingat-4-jam-pasir",
    title: "Perpustakaan Jam Pasir di Antara Dua Detik",
    subtitle: "Sebuah ruang fantasi yang aman dari kejaran waktu",
    category: "Fantasi Tenang",
    quote: "Ada ruang rahasia di dalam imajinasimu tempat jarum jam berhenti dan segala tuntutan dunia menguap.",
    readTime: "3 mnt",
    paragraphs: [
      "Bayangkan ada sebuah pintu kayu berat di sudut kamarmu yang hanya bisa kamu lihat saat kamu memejamkan mata. Di balik pintu itu ada perpustakaan berkubah tinggi dengan jendela besar yang menghadap samudra bintang.",
      "Di sana ada sofa beludru hangat, rak buku tak terbatas yang berisi kisah-kisah yang belum pernah ditulis, dan sebuah jam pasir kuno yang pasirnya melayang di udara. Di ruangan ini, waktu tidak bergerak maju. Tidak ada tenggat waktu, tidak ada pesan yang harus dibalas, dan tidak ada orang yang menuntutmu menjadi apa pun.",
      "Aku menciptakan ruang web ini dengan harapan kamu bisa merasakan atmosfer serupa. Ambillah napas dalam-dalam. Di sini, kamu aman untuk sekadar menjadi manusia yang ingin beristirahat.",
    ],
  },
  {
    id: "ingat-5-gravitasi",
    title: "Gravitasi dan Pelajaran tentang Menemukan Orbit",
    subtitle: "Mengapa jatuh terkadang adalah cara semesta menciptakan tarian baru",
    category: "Sains Kosmik",
    quote: "Planet tidak pernah takut jatuh ke matahari, karena kecepatan dan arah geraknya mengubah kejatuhan itu menjadi orbit yang abadi.",
    readTime: "2 mnt",
    paragraphs: [
      "Dalam hukum gravitasi Newton dan relativitas Einstein, bumi sebenarnya terus-menerus ditarik jatuh ke arah matahari. Namun karena bumi memiliki kecepatan menyamping yang pas, ia tidak pernah menabrak matahari. Kejatuhan yang terus-menerus itu justru menciptakan orbit yang stabil dan melahirkan musim serta kehidupan.",
      "Kadang dalam hidup, rencanamu meleset dan kamu merasa sedang jatuh terpuruk. Kamu merasa kehilangan kendali atas apa yang sudah kamu susun rapi.",
      "Tetapi pikirkan kemungkinan ini. Mungkin kamu tidak sedang hancur. Mungkin kecepatan langkahmu dan gaya tarik situasi sedang membentuk orbit baru yang belum pernah kamu bayangkan sebelumnya. Beri waktu bagi gravitasi hidupmu untuk menemukan keseimbangannya.",
    ],
  },
  {
    id: "ingat-6-debu-bintang",
    title: "Tubuhmu Dibangun dari Dapur Bintang Purba",
    subtitle: "Fakta spektakuler tentang materi yang membentuk tulang dan darahmu",
    category: "Sains Kosmik",
    quote: "Atom di tangan kananmu dan atom di tangan kirimu mungkin berasal dari dua bintang berbeda yang meledak miliaran tahun lalu.",
    readTime: "2 mnt",
    paragraphs: [
      "Semua unsur yang lebih berat dari hidrogen dan helium di alam semesta ini hanya bisa dimasak di satu tempat, yaitu di dalam tungku fusi inti bintang raksasa. Besi yang mengalir di hemoglobin darahmu dan kalsium yang menopang tulangmu terbentuk saat bintang purba meledak dalam peristiwa supernova dahsyat.",
      "Secara kimiawi dan fisik, kamu bukan sekadar makhluk yang tinggal di bumi. Kamu adalah debu bintang yang berevolusi menjadi sadar, bisa tertawa, bisa belajar, dan bisa memikirkan mimpi-mimpinya.",
      "Ketika kamu merasa kecil dan tidak berarti di hadapan kerasnya hari, ingatlah asal-usul fisikamu. Materi di dalam tubuhmu telah bertahan melewati miliaran tahun kekacauan kosmik. Kamu jauh lebih kuat dan tangguh daripada yang kamu duga.",
    ],
  },
  {
    id: "ingat-7-pulau-awan",
    title: "Pulau Terapung di Atas Samudra Awan",
    subtitle: "Imajinasi ringan untuk melepaskan gravitasi pikiran yang berat",
    category: "Fantasi Tenang",
    quote: "Terkadang yang kamu butuhkan hanyalah melepaskan jangkar pikiranmu dan membiarkannya melayang ringan.",
    readTime: "2 mnt",
    paragraphs: [
      "Di suatu tempat di balik cakrawala fantasi, ada kepulauan batu apung yang melayang di atas selimut awan perak. Di pulau itu tumbuh lumut yang bersinar hijau lembut di malam hari, dan air terjunnya mengalir ke atas menuju langit.",
      "Di sana kamu bisa melangkah seringan bulu angsa. Segala beban pikiran yang berat seperti batu langsung kehilangan massanya dan melayang pergi begitu kamu sentuh.",
      "Aku sering membayangkan tempat ini saat kepalaku terasa terlalu penuh oleh tugas dan rencana. Imajinasi adalah tempat perlindungan yang sah. Gunakan ia malam ini untuk menenangkan pikiranmu sebelum kamu terlelap.",
    ],
  },
  {
    id: "ingat-8-entropi",
    title: "Hukum Entropi dan Kerapian yang Tak Perlu Sempurna",
    subtitle: "Mengapa tidak apa jika hidupmu terkadang terasa sedikit berantakan",
    category: "Logika & Hidup",
    quote: "Alam semesta sendiri selalu bergerak menuju ketidakteraturan, jadi jangan hukum dirimu hanya karena segalanya belum tertata rapi.",
    readTime: "2 mnt",
    paragraphs: [
      "Hukum kedua termodinamika menyatakan bahwa entropi atau tingkat ketidakteraturan di alam semesta akan selalu meningkat seiring waktu. Kamar yang rapi lambat laun akan berantakan, es batu akan mencair, dan energi akan menyebar.",
      "Artinya, ketidaksempurnaan dan kekacauan kecil bukanlah tanda bahwa kamu gagal. Itu adalah kecenderungan alami dari dunia tempat kita berpijak. Menuntut agar seluruh aspek hidupmu rapi, terkontrol, dan tanpa cela setiap detik adalah hal yang melawan hukum fisika itu sendiri.",
      "Malam ini, terimalah apa yang masih belum rapi. Biarkan beberapa hal tetap berantakan untuk saat ini. Cukup fokus pada satu hal kecil yang ada di hadapanmu, lalu istirahatlah dengan lega.",
    ],
  },
];

// Alias for compatibility
export type RayvelioneLetter = ReminderItem;
export const rayvelioneLetters = reminders;
