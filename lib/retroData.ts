// Arsip Pengetahuan Retro, Sandi Logika, dan Frekuensi Radio Analog
// Seluruh teks mematuhi aturan ketat: Tanpa titik-koma dan tanpa tanda pisang em-dash.

export type RetroArticle = {
  id: string;
  title: string;
  category: string;
  era: string;
  readTime: string;
  summary: string;
  content: string[];
  tags: string[];
  quote: string;
};

export type CipherPuzzle = {
  id: string;
  title: string;
  era: string;
  clue: string;
  plaintext: string;
  shift: number;
  unlockedKnowledge: string;
};

export type RadioStation = {
  id: string;
  frequency: number; // MHz
  band: string;
  name: string;
  description: string;
  facts: string[];
  morseMessage: string;
  chord: number[];
};

export type CassetteTrack = {
  id: string;
  title: string;
  side: "A" | "B";
  durationSec: number;
  notes: number[];
  tempoMs: number;
};

export const RETRO_ARTICLES: RetroArticle[] = [
  {
    id: "akustik-kaset",
    title: "Fisika Suara Analog dan Rekaman Pita Magnetik",
    category: "Akustik dan Magnetisme",
    era: "1963, Lou Ottens dan Tim Philips",
    readTime: "4 menit baca",
    summary:
      "Bagaimana getaran udara saat manusia bernyanyi diabadikan menjadi medan magnet mikroskopis di atas pita tipis berbalut partikel ferit oksida.",
    quote:
      "Suara bukan sekadar gelombang tak tampak di udara, melainkan getaran fisik yang dapat dibekukan dalam barisan kutub magnet.",
    tags: ["Akustik", "Magnetik", "Fisika", "Pita Kaset"],
    content: [
      "Ketika Anda berbicara atau memetik senar gitar, udara di sekitar tertekan dan merenggang secara berulang-ulang, menciptakan gelombang mekanis longitudinal. Pada mikrofon analog, gelombang getaran udara ini menabrak membran tipis yang dihubungkan ke kumparan kawat halus di dekat medan magnet. Sesuai hukum induksi elektromagnetik Michael Faraday, gerakan membran mengalirkan arus listrik bolak-balik yang bentuk gelombangnya persis mencerminkan nada getaran suara.",
      "Arus listrik tersebut dialirkan menuju kepala perekam (record head) pada mesin pemutar kaset. Kepala perekam pada dasarnya adalah elektromagnet berbentuk tapal kuda kecil dengan celah mikroskopis yang luar biasa rapat, hanya beberapa mikrometer lebarnya. Saat arus suara melintasi kumparan kepala perekam, celah sempit tersebut memancarkan medan magnet yang berubah-ubah kekuatannya sesuai irama suara.",
      "Di saat yang bersamaan, pita kaset plastik berbahan poliester meluncur mulus melewati celah tersebut dengan kecepatan standar 4.76 sentimeter per detik. Permukaan pita kaset dilapisi miliaran partikel magnetik sangat halus, biasanya berupa serbuk besi oksida atau kromium dioksida. Partikel-partikel mikroskopis ini awalnya memiliki orientasi kutub acak, namun ketika tersapu medan magnet kepala perekam, arah kutub magnet partikel-partikel tersebut seketika berbaris rapi membekukan pola gelombang suara.",
      "Tantangan terbesar rekaman analog adalah histeresis magnetik, yaitu keengganan partikel ferit untuk berubah arah saat sinyal suara terlalu lemah. Para insinyur akustik abad ke-20 menemukan solusi brilian yang disebut sinyal bias AC (alternating current bias). Mereka menyuntikkan frekuensi ultrasonik tinggi berkisar 100 kilohertz yang tidak terdengar oleh telinga manusia ke dalam sinyal audio saat merekam. Gelombang ultrasonik ini bertindak seperti pengocok lembut yang melonggarkan partikel ferit sehingga gelombang suara manusia dapat terukir dengan kejernihan maksimal dan bebas distorsi kasar.",
      "Saat pita kaset diputar ulang, proses ini berlangsung secara berkebalikan. Barisan partikel magnet yang telah teratur meluncur melewati kepala pembaca (playback head), menginduksi tegangan listrik mikro pada kumparannya, lalu diperkuat ribuan kali oleh sirkuit penguat untuk menggetarkan membran pelantang suara. Simfoni orkestra yang telah direkam bertahun-tahun silam pun lahir kembali dengan kehangatan analog yang khas.",
    ],
  },
  {
    id: "komputer-antikythera",
    title: "Mekanisme Antikythera: Komputer Analog Perunggu 2000 Tahun",
    category: "Arkeologi Komputasi",
    era: "Sekitar 150 Sebelum Masehi, Yunani Kuno",
    readTime: "5 menit baca",
    summary:
      "Penemuan artefak dari dasar laut Aegea yang membuktikan bahwa peradaban kuno telah menciptakan kalkulator mekanik diferensial yang rumit.",
    quote:
      "Peradaban manusia telah menyusun roda gigi matematika ribuan tahun sebelum revolusi industri modern dimulai.",
    tags: ["Sejarah", "Mekanika", "Komputasi", "Astronomi"],
    content: [
      "Pada musim semi tahun 1900, sekelompok penyelam spons laut asal Pulau Symi terpaksa berlindung dari badai ganas di dekat pantai berbatu Pulau Antikythera, Yunani. Ketika badai mereda, salah satu penyelam bernama Elias Stadiatis menyelam ke kedalaman 45 meter dan mendapati reruntuhan kapal kargo Romawi kuno yang karam dua puluh abad silam. Di antara patung marmer dan perhiasan perunggu, para arkeolog menemukan bongkahan batu perunggu berkarat yang sempat diabaikan.",
      "Bongkahan tersebut ternyata menyimpan keajaiban teknologi peradaban manusia yang melampaui zamannya. Melalui pemindaian tomografi sinar-X resolusi tinggi tiga dimensi modern, para peneliti berhasil mengintip ke dalam logam yang telah terkorosi dan menemukan sistem rumit yang terdiri dari sekurangnya 30 roda gigi perunggu bergigi segitiga dengan ketepatan mikrometer.",
      "Alat ini dikenal luas sebagai Mekanisme Antikythera, sebuah komputer analog mekanis pertama di muka bumi. Pengguna cukup memutar engkol tangan di sisi kotak kayu, dan seluruh roda gigi perunggu berputar secara sinkron untuk memecahkan persamaan matematika pergerakan benda langit. Mekanisme ini menghitung posisi matahari, fase bulan dari hari ke hari, serta siklus Saros 223 bulan untuk memprediksi tanggal dan jam terjadinya gerhana matahari maupun gerhana bulan secara akurat.",
      "Salah satu inovasi paling menakjubkan di dalam mesin ini adalah mekanisme pin dan slot (pasak dan celah) pada sepasang roda gigi bulan. Celah geser tersebut dirancang untuk meniru anomali pergerakan bulan kedua, yaitu orbit bulan yang elips sehingga kecepatannya tampak melambat dan mempercepat di langit, sebuah fenomena fisika orbit yang baru dirumuskan secara tertulis oleh Johannes Kepler pada abad ke-17.",
      "Mekanisme Antikythera membuktikan bahwa pengetahuan rekayasa mekanik presisi telah mencapai puncak keemasan di masa lampau sebelum pengetahuan tersebut terkubur dan hilang selama lebih dari seribu tahun. Mesin ini menjadi bukti abadi betapa dalamnya rasa ingin tahu manusia untuk memahami harmoni alam semesta melalui instrumen logika fisik.",
    ],
  },
  {
    id: "gelombang-hertz",
    title: "Misteri Percikan Gelombang Elektromagnetik Heinrich Hertz",
    category: "Telekomunikasi Klasik",
    era: "1887, Institut Politeknik Karlsruhe",
    readTime: "4 menit baca",
    summary:
      "Percikan bunga api listrik kecil yang membuktikan bahwa gelombang tak kasat mata dapat merambat melintasi udara tanpa kawat perantara.",
    quote:
      "Gelombang ini merambat dalam keheningan ruang, membawa energi dari satu penjuru laboratorium ke penjuru lainnya.",
    tags: ["Fisika", "Radio", "Elektromagnetik", "Hertz"],
    content: [
      "Pada pertengahan abad ke-19, fisikawan Skotlandia bernama James Clerk Maxwell merumuskan empat persamaan matematika elegan yang menyatukan medan listrik dan medan magnet menjadi satu kesatuan elektromagnetik. Persamaan Maxwell memprediksi bahwa getaran listrik seharusnya memancarkan gelombang energi yang melesat melintasi ruang hampa dengan kecepatan cahaya. Namun pada masa itu, banyak ilmuwan meragukannya karena belum ada seorang pun yang mampu mendeteksi keberadaan gelombang tak kasat mata tersebut.",
      "Tantangan besar itu dijawab oleh fisikawan muda asal Jerman bernama Heinrich Rudolf Hertz pada tahun 1887. Di dalam laboratoriumnya di Karlsruhe, Hertz merancang sebuah alat sederhana namun luar biasa cerdas. Ia membuat osilator pemancar yang terdiri dari dua bola seng besar yang dihubungkan ke kumparan induksi bertegangan tinggi. Di antara dua bola tembaga kecil terdapat celah udara sempit berjarak beberapa milimeter.",
      "Di sisi lain ruangan laboratorium, berjarak beberapa meter tanpa ada kawat penghubung apa pun, Hertz meletakkan alat penerima berupa lingkaran kawat tembaga sederhana yang juga memiliki celah mikroskopis di ujungnya. Ketika Hertz menyalakan kumparan pemancar, loncatan bunga api listrik berwarna biru keunguan memercik melintasi celah udara pemancar. Bersamaan dengan itu, di dalam kegelapan ruangan, Hertz menyaksikan percikan api kecil yang sangat halus ikut menyala di celah kawat penerimanya.",
      "Percikan halus tersebut adalah peristiwa bersejarah. Energi listrik dari pemancar telah melompat ke udara dalam bentuk gelombang elektromagnetik berfrekuensi sekitar 50 megahertz, merambat menembus ruangan, lalu menginduksi arus listrik pada kawat lingkaran penerima. Hertz kemudian menguji sifat gelombang ini menggunakan cermin seng besar dan prisma aspal raksasa, membuktikan bahwa gelombang radio dapat dipantulkan, dibiaskan, dan mengalami polarisasi persis seperti cahaya kasat mata.",
      "Ketika ditanya oleh murid-muridnya mengenai kegunaan praktis dari penemuannya, Hertz dengan rendah hati menjawab bahwa eksperimen ini tidak memiliki manfaat praktis dan hanyalah pembuktian eksperimen bahwa teori Maxwell benar. Siapa yang menduga bahwa percikan kecil di laboratorium Hertz tersebut kini menjadi fondasi seluruh peradaban komunikasi nirkabel modern, mulai dari siaran radio samudra, radar maritim, transmisi satelit, hingga sinyal WiFi yang menghubungkan miliaran manusia di muka bumi.",
    ],
  },
  {
    id: "karakter-ascii",
    title: "Kelahiran Karakter ASCII dan Sandi Teletype",
    category: "Sejarah Komputasi",
    era: "1963, Komite Standar ASA X3.4",
    readTime: "3 menit baca",
    summary:
      "Standardisasi 128 kombinasi biner tujuh bit yang memungkinkan mesin teleks dan komputer awal di seluruh dunia saling bertukar pikiran.",
    quote:
      "Huruf demi huruf dipecah menjadi tujuh pulsa tegangan, menghubungkan manusia melintasi jarak samudra.",
    tags: ["ASCII", "Biner", "Komputer", "Teletype"],
    content: [
      "Pada era awal kelahiran komputer pada tahun 1950-an, setiap produsen mesin komputasi menggunakan bahasa biner internal masing-masing. Komputer buatan IBM tidak dapat membaca data rekaman dari komputer Remington Rand karena kode karakter yang digunakan untuk melambangkan huruf alfabet saling bertentangan. Situasi ini menimbulkan kebingungan besar saat jaringan telekomunikasi antarnegara mulai berkembang pesat.",
      "Menyadari pentingnya bahasa perantara yang universal, seorang pionir komputasi bernama Bob Bemer bersama American Standards Association (sekarang ANSI) merumuskan sebuah standar pengkodean karakter baru pada tahun 1963. Standar tersebut diberi nama ASCII, singkatan dari American Standard Code for Information Interchange.",
      "ASCII menggunakan format biner 7-bit, yang menghasilkan tepat 128 kombinasi angka dari nilai 0 hingga 127. Pilihan 7-bit ini sangat efisien untuk teknologi penyimpanan pita kertas berlubang dan saluran kabel teletype saat itu. Nilai 32 hingga 126 dialokasikan untuk karakter yang dapat dicetak, mencakup 26 huruf alfabet kapital, 26 huruf kecil, sepuluh angka dari 0 hingga 9, serta tanda baca dan simbol matematika dasar.",
      "Sementara itu, nilai 0 hingga 31 sengaja dikhususkan untuk karakter kendali fisik mesin teletype (control characters). Contohnya adalah kode 7 yang melambangkan lonceng (Bell) untuk membunyikan bel mekanis di kantor penerima kawat, kode 10 untuk Line Feed yang memutar drum kertas ke baris berikutnya, serta kode 13 untuk Carriage Return yang mengembalikan tuas ketik ke tepi kiri kertas. Karakter kendali teletype ini tetap lestari dan masih menjadi standar format baris baru di semua sistem operasi komputer hingga saat ini.",
      "Kelahiran ASCII membuka gerbang komunikasi digital global. Untuk pertama kalinya dalam sejarah manusia, sebuah dokumen teks dapat diketik di New York, dikirimkan melalui kabel telegraf bawah laut sebagai pulsa biner, dan dicetak dengan sempurna di London tanpa ada satu pun karakter yang tersesat atau tertukar maknanya.",
    ],
  },
  {
    id: "camera-obscura",
    title: "Optika Ruang Gelap Camera Obscura dan Kelahiran Fotografi",
    category: "Optika Klasik",
    era: "1021, Kitab al-Manazir oleh Al-Hasan Ibnu al-Haitham",
    readTime: "4 menit baca",
    summary:
      "Prinsip perambatan lurus berkas cahaya melewati lubang jarum yang mendasari lukisan Renaisans dan kamera modern.",
    quote:
      "Cahaya yang masuk melalui lubang kecil membalikkan bayangan dunia nyata ke dinding ruangan hening.",
    tags: ["Optika", "Kamera", "Fisika Cahaya", "Sains Kuno"],
    content: [
      "Di dalam sebuah ruangan yang sepenuhnya gelap gulita tanpa jendela, buatlah sebuah lubang jarum kecil sebesar beberapa milimeter pada salah satu dinding yang menghadap pemandangan luar yang bermandikan sinar matahari. Di dinding seberangnya yang berada di dalam kegelapan, akan tampak proyeksi pemandangan luar secara nyata, lengkap dengan warna alami pepohonan dan awan yang bergerak, namun dalam posisi terbalik dari atas ke bawah dan dari kiri ke kanan.",
      "Fenomena ajaib yang sepenuhnya alami ini dikenal dengan istilah Latin Camera Obscura, yang secara harfiah bermakna kamar gelap. Penjelasan ilmiah paling komprehensif mengenai fenomena ini pertama kali dirumuskan oleh ilmuwan polimatik Muslim bernama Al-Hasan Ibnu al-Haitham (dikenal di dunia barat sebagai Alhazen) di Kairo dalam karyanya yang monumental, Kitab al-Manazir, sekitar seribu tahun silam.",
      "Ibnu al-Haitham membuktikan bahwa cahaya merambat dalam garis lurus sempurna. Berkas cahaya yang dipantulkan dari bagian atas pohon merambat lurus melewati lubang jarum dan jatuh di bagian bawah dinding kamar gelap. Sebaliknya, berkas cahaya dari pangkal pohon merambat lurus ke atas dan jatuh di bagian atas dinding. Karena lubang jarum sangat sempit, hanya berkas cahaya dari satu sudut yang diizinkan masuk untuk setiap titik gambar, mencegah berkas cahaya saling tumpang tindih dan menghasilkan proyeksi yang tajam tanpa lensa cembung sama sekali.",
      "Pada era Renaisans, para pelukis legendaris seperti Leonardo da Vinci dan Johannes Vermeer memanfaatkan kotak portabel camera obscura yang dilengkapi cermin miring 45 derajat dan lensa kaca cembung untuk mempelajari ilmu perspektif, gradasi bayangan, dan geometri ruang dengan ketelitian yang luar biasa.",
      "Evolusi berlanjut pada awal abad ke-19 ketika para kimiawan seperti Joseph Nicephore Niepce dan Louis Daguerre meletakkan pelat tembaga berlapis garam perak halida di bagian belakang camera obscura. Bahan kimia peka cahaya ini bereaksi secara fotokimia terhadap berkas cahaya yang masuk, membekukan proyeksi sementara tersebut menjadi gambar abadi pertama yang menandai kelahiran dunia fotografi modern.",
    ],
  },
  {
    id: "vinil-gramofon",
    title: "Alur Spiral Piringan Hitam dan Ketelitian Jarum Safir",
    category: "Fisika Akustik",
    era: "1948, Rekaman Mikroalur Long Play 33 RPM",
    readTime: "3 menit baca",
    summary:
      "Getaran fisik instrumen musik yang dipahat secara mekanis ke dalam dinding alur mikro berbentuk V berputar konstan.",
    quote:
      "Satu alur spiral tunggal sepanjang ratusan meter menyimpan keutuhan emosi nada instrumen musik.",
    tags: ["Vinil", "Akustik", "Gramofon", "Fisika"],
    content: [
      "Berbeda dengan media digital modern yang memotong gelombang suara menjadi miliaran sampel angka biner 0 dan 1, piringan hitam (vinil LP) menyimpan getaran suara secara murni dan kontinu dalam bentuk fisik nyata. Di atas piringan plastik polivinil klorida berdiameter 30 sentimeter tersebut, terbentang satu alur spiral tunggal tanpa putus sepanjang hampir 500 meter yang melingkar dari tepi luar menuju pusat piringan.",
      "Jika Anda mengamati alur piringan hitam menggunakan mikroskop elektron, Anda akan melihat sebuah jurang sempit berbentuk huruf V dengan sudut 90 derajat. Lebar alur ini hanya sekitar 40 hingga 80 mikrometer, kira-kira sebanding dengan ketebalan sehelai rambut manusia. Dinding jurang sebelah kiri diukir dengan modulasi gelombang untuk kanal audio kiri, sedangkan dinding jurang sebelah kanan diukir dengan modulasi gelombang untuk kanal audio kanan, sebuah metode perekaman stereo ortogonal yang sangat brilian yang dirumuskan oleh insinyur Alan Blumlein.",
      "Saat piringan hitam diputar di atas meja putar dengan kecepatan konstan 33 sepertiga putaran per menit, sebuah jarum runcing berbahan safir atau intan murni meluncur dengan anggun di dalam alur tersebut. Fluktuasi mikroskopis pada dinding alur memaksa ujung jarum bergetar ke kiri, ke kanan, ke atas, dan ke bawah sesuai frekuensi suara asli yang diukir pemotong rekaman master.",
      "Getaran jarum diteruskan ke batang penopang (cantilever) kecil yang di ujung belakangnya dipasangi magnet mini atau kumparan kawat halus di dalam kartrid. Gerakan mikroskopis magnet di antara kumparan kawat menghasilkan tegangan listrik bolak-balik yang sangat kecil, berorde beberapa milivolt saja. Sinyal listrik murni ini kemudian dialirkan ke penguat awal pemerata RIAA (RIAA equalization preamp) untuk memulihkan respons bass dan treble alami sebelum dihantarkan ke pelantang suara.",
      "Keindahan piringan hitam terletak pada hubungan fisik langsung antara gerak mekanik dan suara. Tidak ada konversi analog ke digital, tidak ada kompresi algoritma matematis. Suara hangat yang Anda dengar adalah hasil gesekan fisik yang presisi antara kristal intan dan dinding alur vinil, membawa nuansa kehadiran ruang rekaman langsung ke dalam ruangan Anda.",
    ],
  },
  {
    id: "resonansi-schumann",
    title: "Resonansi Schumann: Denyut Gelombang Elektromagnetik Bumi",
    category: "Geofisika dan Atmosfer",
    era: "1952, Profesor Winfried Otto Schumann",
    readTime: "3 menit baca",
    summary:
      "Rongga gelombang alami antara permukaan tanah bumi dan lapisan ionosfer atmosfer yang berdenyut pada frekuensi 7.83 Hertz.",
    quote:
      "Planet bumi memiliki detak frekuensi alami yang beresonansi tanpa henti di langit malam.",
    tags: ["Geofisika", "Resonansi", "Frekuensi", "Schumann"],
    content: [
      "Bayangkan planet bumi kita sebagai sebuah bola konduktor raksasa yang dikelilingi oleh lapisan atmosfer luar yang bermuatan listrik bernama ionosfer pada ketinggian sekitar 60 hingga 100 kilometer. Permukaan bumi yang terdiri dari tanah dan lautan asin bertindak sebagai dinding konduktor bagian dalam, sedangkan lapisan bawah ionosfer bertindak sebagai dinding konduktor bagian luar. Di antara kedua lapisan konduktor ini, terdapat rongga udara dielektrik yang melingkari seluruh permukaan planet bumi.",
      "Pada tahun 1952, fisikawan asal Jerman bernama Winfried Otto Schumann mempublikasikan perhitungan fisika teoritis yang menunjukkan bahwa rongga antara permukaan bumi dan ionosfer bertindak seperti rongga resonansi elektromagnetik gelombang sangat panjang (extremely low frequency). Gelombang elektromagnetik yang merambat di dalam rongga ini akan mengalami interferensi konstruktif dan membentuk gelombang berdiri (standing waves) jika panjang gelombangnya cocok dengan keliling lingkaran bumi.",
      "Pembangkit energi alami yang terus menyalakan resonansi ini adalah sambaran kilat badai petir. Di setiap detik sepanjang siang dan malam, terjadi sekitar 50 hingga 100 sambaran petir di berbagai belahan dunia, terutama di wilayah hutan hujan tropis. Setiap kilatan petir memancarkan denyut gelombang elektromagnetik berenergi masif ke segala arah di dalam rongga bumi-ionosfer.",
      "Gelombang kilat yang melesat dengan kecepatan mendekati kecepatan cahaya ini mengitari bumi sekitar 7.5 kali per detik. Akibatnya, terciptalah frekuensi resonansi alami dasar sebesar 7.83 Hertz, diikuti nada harmonik atas pada 14.3 Hertz, 20.8 Hertz, 27.3 Hertz, dan 33.8 Hertz. Frekuensi dasar 7.83 Hertz ini dikenal di dunia sains sebagai Resonansi Schumann.",
      "Secara menarik di bidang neurofisiologi, frekuensi 7.83 Hertz berada tepat di batas transisi antara gelombang otak Theta (relaksasi mendalam dan intuisi) dan gelombang otak Alpha (ketenangan terjaga dan fokus santai) pada manusia. Banyak peneliti biofisika memandang resonansi Schumann sebagai detak jantung elektromagnetik alami planet bumi yang telah menyertai evolusi seluruh makhluk hidup selama jutaan tahun.",
    ],
  },
  {
    id: "tabung-hampa",
    title: "Tabung Hampa Udara dan Fajar Era Elektronika",
    category: "Elektronika Klasik",
    era: "1906, Lee de Forest dan Trioda Audion",
    readTime: "4 menit baca",
    summary:
      "Tabung kaca berfilamen panas yang mampu memperkuat sinyal listrik lemah dan mengawali revolusi radio serta komputer ENIAC.",
    quote:
      "Pijaran filamen hangat di dalam kaca hampa udara adalah lentera yang menyalakan fajar komunikasi modern.",
    tags: ["Tabung Vakum", "Elektronika", "Trioda", "Sejarah"],
    content: [
      "Sebelum silikon dan semikonduktor mendominasi sirkuit terpadu pada paruh kedua abad ke-20, seluruh perangkat elektronik canggih di dunia bergantung pada komponen kaca anggun bernama tabung hampa udara (vacuum tube atau thermionic valve). Komponen ini tampak seperti bola lampu pijar bening yang di dalamnya memuat kisi-kisi logam rumit yang berpijar oranye kemerahan saat dialiri arus listrik.",
      "Prinsip dasar tabung vakum berakar dari Efek Edison yang ditemukan Thomas Edison pada tahun 1883. Ketika sebuah filamen kawat dipanaskan hingga membara di dalam ruang hampa udara, elektron-elektron pada permukaan logam menerima energi kinetik yang cukup besar untuk terlepas ke udara sekitarnya, sebuah fenomena yang disebut emisi termionik. Insinyur Inggris John Ambrose Fleming kemudian menambahkan pelat logam kedua (anoda) untuk menciptakan Dioda, katup satu arah yang hanya mengizinkan arus listrik mengalir dari katoda ke anoda.",
      "Revolusi sesungguhnya terjadi pada tahun 1906 ketika penemu asal Amerika Serikat, Lee de Forest, memasukkan elemen ketiga di antara filamen katoda dan pelat anoda. Elemen ketiga ini berupa kisi kawat berlubang yang dinamai kisi kendali (control grid), menciptakan komponen Trioda yang ia sebut Audion. Dengan memberikan tegangan listrik kecil pada kisi kendali, arus elektron masif yang mengalir menuju anoda dapat diatur, dihambat, atau dilepaskan secara presisi.",
      "Penemuan trioda ini memberikan satu kemampuan baru yang belum pernah dimiliki umat manusia sebelumnya, yaitu amplifikasi atau penguatan sinyal. Sinyal radio yang sangat lemah yang ditangkap antena setelah melintasi ribuan mil samudra kini dapat diperkuat ribuan kali hingga cukup bertenaga untuk menggetarkan membran pelantang suara di ruang keluarga.",
      "Selain sebagai penguat audio dan pemancar radio berdaya tinggi, tabung vakum dapat difungsikan sebagai sakelar elektronik berkecepatan tinggi tanpa bagian mekanik yang bergerak. Puluhan ribu tabung vakum kemudian dirangkai bersama untuk membangun komputer elektronik digital skala besar pertama di dunia, ENIAC, pada tahun 1945, yang mampu melakukan ribuan operasi aritmatika per detik dan membuka era komputasi modern yang kita nikmati saat ini.",
    ],
  },
];

// Teka-Teki Sandi Rotor Mekanik Klasik
export const CIPHER_PUZZLES: CipherPuzzle[] = [
  {
    id: "cipher-newton",
    title: "Sandi Spektrum Prisma Newton",
    era: "1672, Royal Society London",
    clue: "Eksperimen pembiasan berkas cahaya matahari menggunakan prisma kaca segitiga oleh Sir Isaac Newton.",
    plaintext: "CAHAYA PUTIH MATAHARI ADALAH GABUNGAN SELURUH WARNA PELANGI",
    shift: 3,
    unlockedKnowledge:
      "Sir Isaac Newton membuktikan bahwa warna bukan berasal dari kaca prisma, melainkan cahaya putih itu sendiri yang terurai menjadi spektrum warna yang kontinu.",
  },
  {
    id: "cipher-hertz",
    title: "Sandi Gelombang Elektromagnetik",
    era: "1887, Karlsruhe Jerman",
    clue: "Eksperimen pembuktian perambatan energi tak kasat mata melalui udara bebas tanpa perantara kawat.",
    plaintext: "PERCIKAN LISTRIK DI SATU TEMPAT MEMICU GETARAN DI TEMPAT LAIN TANPA KAWAT",
    shift: 5,
    unlockedKnowledge:
      "Eksperimen Hertz membuktikan kebenaran persamaan gelombang Maxwell dan membuka jalan bagi seluruh peradaban komunikasi nirkabel modern.",
  },
  {
    id: "cipher-boole",
    title: "Sandi Logika Aljabar Biner",
    era: "1854, Universitas Cork Irlandia",
    clue: "Fondasi matematika yang mendasari gerbang logika prosesor dan komputasi digital.",
    plaintext: "SELURUH PENALARAN DAPAT DIRINGKAS MENJADI DUA KEADAAN BENAR ATAU SALAH",
    shift: 4,
    unlockedKnowledge:
      "George Boole merumuskan bahwa logika berpikir manusia dapat dioperasikan secara matematis dengan simbol 1 dan 0, melahirkan era gerbang logika digital.",
  },
  {
    id: "cipher-galileo",
    title: "Sandi Percepatan Gerak Benda",
    era: "1638, Pisa Italia",
    clue: "Hukum gerak benda jatuh yang membuktikan massa tidak mempengaruhi laju gravitasi di ruang hampa.",
    plaintext: "SEMUA BENDA JATUH DENGAN KECEPATAN SAMA JIKA TANPA HAMBATAN UDARA",
    shift: 6,
    unlockedKnowledge:
      "Galileo Galilei meruntuhkan pandangan Aristoteles dan membuktikan bahwa dua benda berbobot berbeda jatuh bersamaan di ruang hampa udara.",
  },
];

// Helper untuk menyandikan teks dengan pergeseran Caesar
export function encodeCaesar(text: string, shift: number): string {
  return text
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      // Huruf besar A-Z (65 - 90)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      return char;
    })
    .join("");
}

// Stasiun Radio Gelombang Pendek Interaktif
export const RADIO_STATIONS: RadioStation[] = [
  {
    id: "station-schumann",
    frequency: 7.83,
    band: "SW1 40M",
    name: "Rongga Resonansi Alami Bumi",
    description:
      "Frekuensi elektromagnetik alami rongga bumi-ionosfer yang berdenyut stabil akibat sambaran kilat global.",
    facts: [
      "Frekuensi dasar 7.83 Hertz dihitung secara matematis oleh fisikawan Jerman Winfried Otto Schumann pada 1952.",
      "Gelombang ini merambat melingkar mengitari planet bumi sekitar 7.5 kali dalam waktu satu detik.",
      "Frekuensi ini bertepatan dengan ritme gelombang otak manusia dalam fase ketenangan dan meditasi alami.",
    ],
    morseMessage: "EARTH RESONANCE 7.83 HZ",
    chord: [130.81, 164.81, 196.0],
  },
  {
    id: "station-time",
    frequency: 10.0,
    band: "TIME BEACON",
    name: "Transmisi Sinyal Waktu Atomik",
    description:
      "Siaran standar frekuensi dan waktu presisi tinggi yang dipancarkan secara terus menerus untuk sinkronisasi navigasi sains.",
    facts: [
      "Satu detik didefinisikan secara resmi sebagai 9.192.631.770 periode transisi radiasi atom Cesium 133.",
      "Stasiun pemancar waktu gelombang pendek seperti WWV telah mengudara tanpa henti selama lebih dari satu abad.",
      "Ketepatan waktu atomik menjadi acuan dasar navigasi maritim dan konstelasi posisi global.",
    ],
    morseMessage: "ATOMIC TIME STANDARD",
    chord: [220.0, 277.18, 329.63],
  },
  {
    id: "station-morse",
    frequency: 14.22,
    band: "CW AMATEUR 20M",
    name: "Telegrafi Morse Gelombang Pendek",
    description:
      "Pita frekuensi 20 meter yang digemari para operator radio amatir dunia untuk komunikasi jarak jauh via pantulan ionosfer.",
    facts: [
      "Kode Morse diciptakan oleh Samuel Morse dan Alfred Vail pada tahun 1837 untuk telegraf kabel listrik.",
      "Hanya dengan daya pemancar 5 watt, sinyal telegrafi gelombang pendek dapat melintasi benua saat ionosfer optimal.",
      "Sinyal telegrafi CW memiliki kemampuan menembus derau badai yang jauh lebih andal dibanding transmisi suara analog.",
    ],
    morseMessage: "CQ CQ DE RETRO KNOWLEDGE LAB",
    chord: [174.61, 220.0, 261.63],
  },
  {
    id: "station-lofi",
    frequency: 18.1,
    band: "SW3 BROADCAST",
    name: "Siaran Dokumenter Sains Suara Kaset",
    description:
      "Arsip audio analog yang memancarkan narasi sejarah penemuan ilmiah diiringi harmoni sintetis hangat.",
    facts: [
      "Sinyal gelombang pendek (High Frequency) mampu merambat ribuan kilometer karena dipantulkan berulang kali antara langit dan bumi.",
      "Fenomena pantulan berulang ini dinamakan perambatan gelombang langit (skywave propagation).",
      "Kualitas penerimaan gelombang pendek dipengaruhi oleh siklus bintik matahari dan ketebalan lapisan ionosfer F2.",
    ],
    morseMessage: "ANALOG SOUNDSCAPE TAPE",
    chord: [146.83, 174.61, 220.0],
  },
];

// Kaset Pita Mixtape Analog Interaktif
export const CASSETTE_TRACKS: CassetteTrack[] = [
  {
    id: "tape-study",
    title: "Side A: Meja Kerja Laboratorium 1984",
    side: "A",
    durationSec: 180,
    tempoMs: 1400,
    notes: [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 261.63, 220.0],
  },
  {
    id: "tape-analog",
    title: "Side B: Resonansi Partikel Ferit Oksida",
    side: "B",
    durationSec: 210,
    tempoMs: 1600,
    notes: [196.0, 246.94, 293.66, 369.99, 293.66, 246.94, 196.0, 164.81],
  },
];
