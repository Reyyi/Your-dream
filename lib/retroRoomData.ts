// Basis Data Pemandangan Kamar Retro, Barang Antik Interaktif, dan Catatan Pengetahuan
// Seluruh teks mematuhi aturan ketat: Tanpa titik-koma dan tanpa tanda pisang em-dash.

export type SceneryMode = "rainy-window" | "golden-sunset";

export type VinylAlbum = {
  id: string;
  title: string;
  artist: string;
  year: string;
  chords: number[][];
  coverColor: string;
  description: string;
};

export type TvChannel = {
  id: string;
  channelNumber: number;
  name: string;
  type: "pixel-rain" | "color-bars" | "vector-synth" | "static-snow";
  caption: string;
};

export type PolaroidPhoto = {
  id: string;
  title: string;
  caption: string;
  filterClass: string;
  timestamp: string;
};

export type PhoneRecord = {
  digit: number;
  label: string;
  message: string;
};

export type RetroItemKnowledge = {
  id: string;
  name: string;
  year: string;
  headline: string;
  facts: string[];
  scientificPrinciple: string;
};

export const VINYL_ALBUMS: VinylAlbum[] = [
  {
    id: "album-1",
    title: "Simfoni Senja Klasik",
    artist: "Orkestra Kamar Analog",
    year: "1978",
    coverColor: "from-amber-800 to-amber-950",
    description: "Harmoni akor akustik hangat yang mengalun lembut serasi dengan suasana senja.",
    chords: [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23], // G7
    ],
  },
  {
    id: "album-2",
    title: "Kala Hujan Menyentuh Kaca",
    artist: "Ensembel Piano Malam",
    year: "1982",
    coverColor: "from-sky-900 to-slate-950",
    description: "Melodi denting tuts piano berpadu dengan desis alami piringan hitam di malam syahdu.",
    chords: [
      [146.83, 220.0, 261.63, 329.63], // Dm9
      [196.0, 246.94, 293.66, 392.0],  // G
      [130.81, 196.0, 261.63, 329.63], // C
      [164.81, 220.0, 261.63, 329.63], // Am
    ],
  },
  {
    id: "album-3",
    title: "Irama Nostalgia Sintetis 1984",
    artist: "Studio Gelombang Hangat",
    year: "1984",
    coverColor: "from-purple-900 to-indigo-950",
    description: "Alunan penyintesis suara polifonik yang menenangkan jiwa dengan karakteristik frekuensi hangat.",
    chords: [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 369.99], // G6
      [164.81, 196.0, 246.94, 293.66], // Em7
      [220.0, 261.63, 329.63, 392.0],  // Am7
    ],
  },
];

export const TV_CHANNELS: TvChannel[] = [
  {
    id: "ch-1",
    channelNumber: 3,
    name: "Pemandangan Piksel Hujan Kota Malam",
    type: "pixel-rain",
    caption: "Siluet gedung kota dengan rintik hujan lembut dan kerlip jendela apartemen.",
  },
  {
    id: "ch-2",
    channelNumber: 7,
    name: "Pola Uji Sinyal Warna TV Antik",
    type: "color-bars",
    caption: "Bilah warna standar siaran televisi analog untuk kalibrasi tabung katoda.",
  },
  {
    id: "ch-3",
    channelNumber: 11,
    name: "Animasi Gelombang Vektor Sintesis 80-an",
    type: "vector-synth",
    caption: "Garis kisi geometris tak berujung dengan matahari senja neon retro.",
  },
  {
    id: "ch-4",
    channelNumber: 13,
    name: "Derau Salju Statis Antena Gelombang UHF",
    type: "static-snow",
    caption: "Partikel derau putih alami dari radiasi elektromagnetik latar belakang.",
  },
];

export const POLAROID_PHOTOS: PolaroidPhoto[] = [
  {
    id: "photo-1",
    title: "Pojok Meja Kamar Nostalgia",
    caption: "Cahaya temaram lampu meja menyinari koleksi piringan vinil dan secangkir teh.",
    filterClass: "sepia-[0.35] contrast-[1.05] brightness-[1.02]",
    timestamp: "14 Okt 1984, 21:40",
  },
  {
    id: "photo-2",
    title: "Rintik Hujan di Balik Kaca Jendela",
    caption: "Butiran air merambat perlahan membiaskan cahaya neon jalanan malam.",
    filterClass: "hue-rotate-[15deg] contrast-[1.1] brightness-[0.98]",
    timestamp: "14 Okt 1984, 22:15",
  },
  {
    id: "photo-3",
    title: "Piringan Hitam Berputar Damai",
    caption: "Kilauan alur spiral vinil di bawah pendar lampu meja kayu antik.",
    filterClass: "sepia-[0.25] saturate-[1.2]",
    timestamp: "14 Okt 1984, 22:50",
  },
  {
    id: "photo-4",
    title: "Lampu Lava Berpijar Tenang",
    caption: "Gumpalan lilin hangat melayang perlahan memancarkan ketenangan batin.",
    filterClass: "sepia-[0.4] brightness-[1.08]",
    timestamp: "14 Okt 1984, 23:30",
  },
];

export const PHONE_RECORDS: PhoneRecord[] = [
  {
    digit: 1,
    label: "Pojok Musik & Akustik",
    message:
      "Halo di sana. Tahukah kamu bahwa jarum piringan hitam membaca gelombang fisik langsung dari dinding alur vinil tanpa digitalisasi sama sekali? Nikmati alunan musik hangat ini.",
  },
  {
    digit: 2,
    label: "Warta Cuaca Kota Malam",
    message:
      "Stasiun pengamat cuaca melaporkan: Suhu luar ruangan 21 derajat Celsius dengan rintik hujan lembut. Ruangan retro ini adalah tempat paling hangat untuk beristirahat.",
  },
  {
    digit: 3,
    label: "Catatan Sejarah Kamera Instan",
    message:
      "Pada tahun 1947, Edwin Land menciptakan kamera polaroid setelah putrinya yang berusia 3 tahun bertanya mengapa ia tidak bisa langsung melihat foto yang baru saja dijepret.",
  },
  {
    digit: 4,
    label: "Pesan Refleksi Diri",
    message:
      "Berhentilah sejenak dari hiruk-pikuk dunia modern. Sentuhlah barang-barang fisik ini, dengarkan detak waktu, dan temukan kembali kedamaian dalam kesederhanaan.",
  },
];

export const RETRO_ITEMS_KNOWLEDGE: RetroItemKnowledge[] = [
  {
    id: "turntable",
    name: "Pemutar Piringan Hitam Vinil",
    year: "1978",
    headline: "Alur Mikro Fisik dan Getaran Jarum Intan",
    facts: [
      "Piringan hitam menyimpan gelombang suara fisik dalam satu alur spiral tunggal sepanjang hampir 500 meter yang melingkar dari tepi luar menuju pusat.",
      "Lebar alur mikroskopis ini hanya berkisar 40 hingga 80 mikrometer, kira-kira setara dengan ketebalan sehelai rambut manusia.",
      "Dinding sebelah kiri memuat kanal audio kiri, dan dinding sebelah kanan memuat kanal audio kanan pada sudut 90 derajat ortogonal.",
    ],
    scientificPrinciple:
      "Ketika jarum safir menyusuri alur vinil yang bergelombang, gerakan mekanis mikroskopis menggerakkan magnet kecil di dekat kumparan kawat halus di dalam kartrid. Sesuai hukum induksi Faraday, tercipta arus listrik bolak-balik yang kemudian diperkuat menjadi suara murni tanpa kompresi digital.",
  },
  {
    id: "crt-tv",
    name: "Televisi Tabung Cembung Antik",
    year: "1982",
    headline: "Pancaran Berkas Elektron Tabung Katoda",
    facts: [
      "Layar televisi tabung kaca (Cathode Ray Tube) menggunakan pistol elektron di bagian belakang yang menembakkan jutaan elektron bermuatan negatif ke layar fosfor.",
      "Kumparan pembelok magnetik (deflection yoke) mengarahkan berkas elektron untuk memindai garis layar secara horizontal dari kiri ke kanan sebanyak 15625 kali per detik.",
      "Pendaran cahaya yang kita lihat adalah hasil benturan partikel elektron berkecepatan tinggi dengan kristal fosfor di permukaan dalam kaca cembung.",
    ],
    scientificPrinciple:
      "Kaca cembung yang tebal diperlukan untuk menahan tekanan atmosfer bumi yang sangat besar dari luar, karena bagian dalam tabung televisi harus berupa ruang hampa udara sempurna agar berkas elektron dapat melesat tanpa bertabrakan dengan partikel udara.",
  },
  {
    id: "polaroid",
    name: "Kamera Instan Polaroid",
    year: "1980",
    headline: "Laboratorium Kimia Fotografi Mandiri dalam Selembar Kertas",
    facts: [
      "Ditemukan oleh ilmuwan Edwin Land pada tahun 1947, kamera polaroid memadatkan seluruh proses kamar gelap kimiawi ke dalam satu lembar kertas foto tipis.",
      "Kertas foto polaroid memuat lebih dari sepuluh lapisan mikroskopis bahan kimia peka cahaya, zat pewarna, lapisan pengatur asam, dan kantong pasta pengembang.",
      "Saat tombol jepret ditekan dan foto keluar melalui sepasang rol baja presisi, kantong bahan kimia di dasar foto pecah dan menyebarkan pasta secara merata di antara lapisan film.",
    ],
    scientificPrinciple:
      "Kristal perak halida yang terpapar cahaya bereaksi mengunci bayangan laten, sementara cairan kimia pengembang memindahkan molekul pewarna komplementer ke lapisan penerima atas untuk memunculkan warna foto secara nyata di depan mata pengunjung.",
  },
  {
    id: "lava-lamp",
    name: "Lampu Lava & Jam Flip Analog",
    year: "1985",
    headline: "Termodinamika Cairan dan Mekanika Waktu",
    facts: [
      "Lampu lava diciptakan oleh akuntan asal Inggris bernama Edward Craven Walker pada tahun 1963 setelah melihat pengatur waktu telur antik di sebuah kedai.",
      "Cairan di dalam botol kaca terdiri dari dua zat yang tidak dapat saling bercampur: air transparan khusus dan gumpalan lilin parafin berwarna.",
      "Jam flip mekanis menggunakan motor sinkron elektrik kecil yang memutar drum roda gigi dengan kartu angka akrilik tipis yang berbalik bergantian setiap 60 detik.",
    ],
    scientificPrinciple:
      "Lilin parafin memiliki massa jenis yang sedikit lebih padat daripada air saat dingin sehingga mengendap di dasar. Ketika dipanaskan oleh bohlam pijar di bawah botol, lilin memuai, massa jenisnya berkurang hingga lebih ringan daripada air, lalu mengapung dengan anggun ke atas sebelum mendingin dan tenggelam kembali.",
  },
  {
    id: "rotary-phone",
    name: "Telepon Putar Rotary Dial",
    year: "1975",
    headline: "Sistem Pulsa Telekomunikasi Elektromekanik",
    facts: [
      "Sebelum tombol tekan nada nada ganda diperkenalkan, nomor telepon dipilih dengan memutar piringan logam berlubang searah jarum jam hingga pembatas jari.",
      "Saat piringan dilepas dan berputar kembali menggunakan pegas mekanik, sakelar roda gigi di dalamnya membuka dan memutus aliran arus listrik beberapa kali sesuai angka yang diputar.",
      "Sebagai contoh, memutar angka 4 akan mengirimkan empat pulsa pemutus arus listrik berurutan ke kantor sentral telepon.",
    ],
    scientificPrinciple:
      "Pulsa-pulsa listrik pemutus ini menggerakkan sakelar elektromekanik bertingkat (Strowger switch) di sentral telepon, yang secara fisik melangkah naik dan berputar menghubungkan kawat tembaga langsung ke pesawat telepon penerima di kota tujuan.",
  },
];
