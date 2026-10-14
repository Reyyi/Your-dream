// Koleksi surat-surat renungan kontemplatif dari Rayvelione
// Ditulis dengan gaya puitis, hangat, dan menenangkan jiwa untuk menemani malam pembaca.

export type RayvelioneLetter = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  quote: string;
  readTime: string;
  paragraphs: string[];
};

export const rayvelioneLetters: RayvelioneLetter[] = [
  {
    id: "surat-1-lelah",
    title: "Saat Lelahmu Tak Tampak oleh Dunia",
    subtitle: "Untuk malam-malam ketika kamu merasa berjuang sendirian",
    tag: "Ketenangan",
    quote: "Kamu tidak perlu membuktikan apa pun malam ini. Bernapaslah, kamu sudah berjuang luar biasa.",
    readTime: "2 mnt",
    paragraphs: [
      "Ada hari-hari di mana langkahmu terasa begitu berat, namun tak seorang pun di sekitarmu menyadarinya. Kamu tersenyum saat berpapasan, menjawab 'aku baik-baik saja' dengan lancar, padahal di dalam dadamu ada badai kecil yang sedang kamu tahan sendirian.",
      "Malam ini, ketika pintu kamar sudah tertutup dan dunia luar mulai terlelap, lepaskanlah topeng ketegaran itu. Kamu tidak perlu selalu kuat. Menjadi manusia berarti boleh merasa lelah, boleh merasa bingung, dan boleh sejenak berhenti.",
      "Tarik napas perlahan. Rasakan udara dingin malam menyapa dadamu. Segala beban yang belum selesai hari ini, biarkan beristirahat di luar ambang pintu. Langit malam tidak menuntutmu menjadi apa-apa selain dirimu yang utuh.",
      "Tidurlah dengan damai. Kamu berharga bukan hanya karena pencapaianmu, melainkan karena keberanianmu untuk tetap ada di sini.",
    ],
  },
  {
    id: "surat-2-berjalan-pelan",
    title: "Tidak Apa Berjalan Pelan",
    subtitle: "Mengingat kembali arti tempo dan kesabaran di tengah dunia yang tergesa",
    tag: "Arah Hidup",
    quote: "Bunga tidak pernah berlomba dengan bunga di sebelahnya; ia mekar saat waktunya tiba.",
    readTime: "2 mnt",
    paragraphs: [
      "Dunia sering kali berbicara dalam bahasa kecepatan. Siapa yang lebih cepat sampai, siapa yang lebih dulu memiliki, seolah-olah hidup adalah garis finis yang harus dikejar dengan napas terengah-engah.",
      "Namun pernahkah kamu memperhatikan pohon-pohon di hutan? Mereka tumbuh dalam hening, menjalar dalam gelap tanah bertahun-tahun sebelum daun pertamanya menyentuh hangat matahari. Tidak ada ketergesaan di alam semesta.",
      "Jika hari ini kamu merasa tertinggal dari teman-temanmu, jangan biarkan rasa cemas itu mengaburkan pandanganmu. Setiap orang memiliki musimnya masing-masing. Musim dinginmu bukan akhir dari segalanya, melainkan rahasia tanah sebelum musim semi tiba.",
      "Berjalanlah dengan langkahmu sendiri. Yang lambat tetapi tulus akan sampai lebih jauh daripada yang terburu-buru hingga kehilangan arah.",
    ],
  },
  {
    id: "surat-3-mimpi-istirahat",
    title: "Mimpi yang Sedang Mengambil Napas",
    subtitle: "Menjaga keyakinan bahwa jeda bukanlah bentuk dari keputusasaan",
    tag: "Harapan",
    quote: "Jeda bukanlah menyerah; ia adalah tanah subur tempat akar impianmu mencengkeram lebih dalam.",
    readTime: "3 mnt",
    paragraphs: [
      "Mungkin kamu pernah punya mimpi besar yang dulu menyalakan matamu, namun kini seakan tertimbun rutinitas yang menjemukan. Kamu bertanya-tanya: 'Apakah mimpiku telah mati?'",
      "Katakan pada hatimu: ia tidak mati. Ia hanya sedang tidur, mengambil napas panjang setelah menempuh perjalanan yang melelahkan.",
      "Jangan merasa bersalah jika saat ini energimu habis untuk hal-hal sederhana—bangun pagi, bekerja, dan bertahan melewati hari. Itu pun sebuah perjuangan yang mulia. Mimpi sejati memiliki kesabaran yang luar biasa; ia tahu jalan pulang ke hatimu.",
      "Suatu hari nanti, di saat yang tepat, percikan kecil itu akan kembali menyala menjadi lentera yang membimbing langkahmu.",
    ],
  },
  {
    id: "surat-4-memaafkan-hari",
    title: "Memaafkan Hari yang Berantakan",
    subtitle: "Melepaskan rasa bersalah sebelum memejamkan mata malam ini",
    tag: "Kedamaian",
    quote: "Matahari selalu terbenam tanpa meminta maaf atas siang yang panas; ia tahu esok fajar membawa kesempatan baru.",
    readTime: "2 mnt",
    paragraphs: [
      "Ada hari-hari yang tidak berjalan sesuai rencana kita. Kata-kata yang salah terucap, tugas yang belum rampung, atau keputusan yang menyisakan penyesalan di kepala saat bantal menyentuh telinga.",
      "Pikiranmu mungkin sedang memutar ulang kejadian itu berkali-kali, mengadili setiap detik yang telah lewat. Namun tanyakan pada dirimu: apakah menyiksa diri malam ini bisa mengubah apa yang sudah berlalu?",
      "Hari ini sudah selesai. Biarkan ia menjadi sejarah kecil. Tutup bukunya, letakkan penanya. Maafkan ketidaksempurnaanmu hari ini, sebagaimana kamu begitu mudah memaafkan orang yang kamu sayangi.",
      "Besok adalah kanvas bersih yang belum tercoret oleh kesalahan apa pun.",
    ],
  },
  {
    id: "surat-5-tempat-bersandar",
    title: "Untukmu yang Selalu Menjadi Tempat Bersandar",
    subtitle: "Pengingat lembut bahwa sang penjaga pun berhak untuk dijaga",
    tag: "Kasih",
    quote: "Bahkan pelindung terkuat pun membutuhkan tempat untuk melipat sayapnya dan terlelap.",
    readTime: "2 mnt",
    paragraphs: [
      "Kamu terbiasa menjadi orang yang mendengarkan, yang menenangkan, yang selalu ada saat orang lain membutuhkan pundak. Kamu adalah tempat pulang bagi banyak orang.",
      "Tetapi Rayvelione ingin bertanya padamu malam ini: ketika dadamu terasa penuh, ke mana kamu pulang? Siapa yang mendengarkan keheninganmu?",
      "Jangan takut untuk menunjukkan kerapuhanmu. Menjadi rentan bukan berarti kamu lemah; itu bukti bahwa kamu hidup dan memiliki hati yang tulus. Jika malam ini tidak ada tangan yang menggenggammu, biarkan keheningan malam dan bintang-bintang di luar jendela memelukmu.",
      "Kamu telah merawat banyak orang. Malam ini, izinkan dirimu dirawat oleh istirahat yang lelap.",
    ],
  },
  {
    id: "surat-6-hening-malam",
    title: "Hening Malam Ini Adalah Milikmu",
    subtitle: "Menemukan keindahan dalam jeda dan ketiadaan tuntutan",
    tag: "Kontemplasi",
    quote: "Dalam sunyi yang paling dalam, kamu akhirnya bisa mendengar bisikan murni dari jiwamu sendiri.",
    readTime: "2 mnt",
    paragraphs: [
      "Malam hari memiliki sihir yang tidak dimiliki oleh siang hari. Di saat matahari pergi, dunia berhenti menuntut kita untuk menjadi produktif, cerdas, atau memikat.",
      "Di hadapan malam, kita hanyalah debu kecil di bawah kubah bintang yang luas. Dan anehnya, kesadaran itu tidak membuat kita ciut, melainkan membebaskan.",
      "Kamu tidak perlu buru-buru memikirkan hari esok. Esok akan membawa ceritanya sendiri. Saat ini, detik ini, ruang ini adalah milikmu sepenuhnya. Rasakan dinginnya angin, dengarkan jangkrik dan dedaunan yang bergesekan pelan.",
      "Semoga tidurmu malam ini dihiasi mimpi yang paling manis dan meneduhkan.",
    ],
  },
  {
    id: "surat-7-cahaya-kecil",
    title: "Cahaya Kecil yang Menolak Padam",
    subtitle: "Tentang ketahanan tersembunyi di sudut hati terdalammu",
    tag: "Kekuatan",
    quote: "Satu lentera kecil sudah cukup untuk membelah kegelapan malam yang paling pekat.",
    readTime: "2 mnt",
    paragraphs: [
      "Kamu mungkin merasa bahwa apa yang kamu miliki saat ini sangat sedikit. Sedikit tenaga, sedikit keyakinan, sedikit keberuntungan. Namun ketahuilah, sebuah ruangan yang gelap gulita tidak membutuhkan seribu matahari untuk diterangi—ia hanya butuh satu nyala lilin kecil.",
      "Harapan di dalam dadamu adalah lilin itu. Selama kamu masih ingin mencoba lagi esok hari, kegelapan tidak akan pernah menang.",
      "Rayvelione menuliskan surat ini untuk mengingatkanmu: kamu jauh lebih tabah daripada yang pernah kamu duga. Ingatlah berapa banyak hari berat di masa lalu yang kamu kira tak akan terlewati, namun buktinya malam ini kamu masih berada di sini, bernapas dan terus melangkah.",
      "Pertahankan nyala kecil itu. Itu sudah lebih dari cukup.",
    ],
  },
  {
    id: "surat-8-esok-pagi",
    title: "Surat Singkat untuk Esok Pagi",
    subtitle: "Doa sederhana untuk menyongsong fajar yang akan datang",
    tag: "Awal Baru",
    quote: "Setiap fajar adalah undangan kedua dari semesta untuk mencintai hidup sekali lagi.",
    readTime: "1 mnt",
    paragraphs: [
      "Sebelum kamu memejamkan mata, titipkan satu harapan kecil pada bintang malam ini.",
      "Bukan harapan yang muluk-muluk, cukup harapan agar esok pagi kamu bisa menghirup udara dengan lebih ringan, menikmati secangkir kehangatan, dan menemukan setidaknya satu hal kecil yang membuat bibirmu tersenyum.",
      "Dunia ini luas dan penuh kemungkinan yang belum kamu jumpai. Orang-orang baik yang belum kamu temui, buku-buku indah yang belum kamu baca, dan senja-senja menakjubkan yang belum sempat kamu saksikan.",
      "Selamat beristirahat. Sampai jumpa di fajar esok hari.",
    ],
  },
];
