// src/lib/sectors.ts

// ========== Type Definitions ==========
export interface SectorProject {
  title: string;
  year: number;
  client: string;
}

export interface SectorAchievement {
  value: string;
  label: string;
}

export interface SectorTeam {
  name: string;
  role: string;
  expertise: string;
  image: string;
}

export interface SectorFaq {
  q: string;
  a: string;
}

export interface Sector {
  title: string;
  slug: string;
  icon: string;
  heroImage: string;
  shortDesc: string;
  fullDesc: string;
  objectives: string[];
  services: string[];
  projects: SectorProject[];
  achievements: SectorAchievement[];
  team: SectorTeam[];
  faqs: SectorFaq[];
}

// ========== Data Sectors ==========
export const sectors: Record<string, Sector> = {
  pemerintahan: {
    title: "Pemerintahan & Kebijakan Publik",
    slug: "pemerintahan",
    icon: "🏛️",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=800&fit=crop",
    shortDesc: "Perencanaan pembangunan, kebijakan publik, dan tata kelola pemerintahan.",
    fullDesc: "Kami membantu pemerintah daerah dan pusat dalam menyusun perencanaan pembangunan jangka menengah (RPJMD/RPJMN), kebijakan publik berbasis data, serta penguatan tata kelola pemerintahan. Pendekatan partisipatif dan analisis kebijakan yang komprehensif menjadi kunci keberhasilan setiap proyek.",
    objectives: [
      "Meningkatkan kualitas perencanaan pembangunan daerah",
      "Memperkuat kapasitas kelembagaan pemerintah",
      "Menyusun kebijakan publik yang responsif dan berbasis bukti"
    ],
    services: [
      "Penyusunan RPJMD/RPJMN",
      "Analisis Kebijakan Publik",
      "Evaluasi Kinerja Pemerintah Daerah",
      "Penyusunan Peraturan Daerah"
    ],
    projects: [
      { title: "RPJMD Provinsi Jawa Barat 2024-2029", year: 2024, client: "Bappeda Jabar" },
      { title: "Kajian Kebijakan Pengentasan Kemiskinan", year: 2023, client: "Kemendes PDTT" },
      { title: "Penyusunan Perda Tata Ruang Kabupaten X", year: 2022, client: "Pemkab X" }
    ],
    achievements: [
      { value: "15+", label: "Provinsi Ditangani" },
      { value: "50+", label: "Kebijakan Tersusun" },
      { value: "100%", label: "Kepuasan Klien" }
    ],
    team: [
      { name: "Dr. Ir. Budi Santoso", role: "Senior Planner", expertise: "Perencanaan Wilayah", image: "https://randomuser.me/api/portraits/men/45.jpg" },
      { name: "Ir. Siti Nurhaliza, M.Sc", role: "Konsultan Kebijakan", expertise: "Analisis Kebijakan", image: "https://randomuser.me/api/portraits/women/55.jpg" }
    ],
    faqs: [
      { q: "Berapa lama proses penyusunan RPJMD?", a: "Rata-rata 6-12 bulan tergantung kompleksitas daerah." },
      { q: "Apakah LPPSLH menyediakan pelatihan untuk perangkat daerah?", a: "Ya, kami memiliki program capacity building untuk Bappeda dan OPD." }
    ]
  },
  infrastruktur: {
    title: "Infrastruktur & Pekerjaan Umum",
    slug: "infrastruktur",
    icon: "🛣️",
    heroImage: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1920&h=800&fit=crop",
    shortDesc: "Perencanaan jalan, jembatan, bendungan, dan irigasi.",
    fullDesc: "LPPSLH menyediakan jasa konsultansi perencanaan infrastruktur yang andal, mencakup studi kelayakan, desain teknis, supervisi konstruksi, hingga manajemen aset. Kami memastikan setiap proyek infrastruktur berjalan efisien, tepat waktu, dan berkelanjutan.",
    objectives: [
      "Mewujudkan infrastruktur berkualitas dan berkelanjutan",
      "Meningkatkan konektivitas antar wilayah",
      "Mengoptimalkan anggaran infrastruktur"
    ],
    services: [
      "Studi Kelayakan Jalan & Jembatan",
      "Perencanaan Irigasi dan Sumber Daya Air",
      "Supervisi Konstruksi",
      "Manajemen Aset Infrastruktur"
    ],
    projects: [
      { title: "Jalan Tol Trans-Sumatra", year: 2023, client: "Hutama Karya" },
      { title: "Bendungan Leuwikeris", year: 2022, client: "Kementerian PUPR" },
      { title: "Normalisasi Sungai Ciliwung", year: 2021, client: "Pemprov DKI" }
    ],
    achievements: [
      { value: "500+", label: "KM Jalan" },
      { value: "20+", label: "Bendungan" },
      { value: "100%", label: "Proyek Tepat Waktu" }
    ],
    team: [
      { name: "Ir. Andi Wijaya", role: "Ahli Jalan", expertise: "Geoteknik", image: "https://randomuser.me/api/portraits/men/75.jpg" },
      { name: "Dr. Ir. Budi Santoso", role: "Senior Planner", expertise: "Perencanaan Wilayah", image: "https://randomuser.me/api/portraits/men/45.jpg" }
    ],
    faqs: [
      { q: "Berapa lama studi kelayakan jalan?", a: "Umumnya 4-8 bulan." },
      { q: "Apakah LPPSLH menyediakan supervisi konstruksi?", a: "Ya, kami memiliki tim pengawas bersertifikasi." }
    ]
  },
  perumahan: {
    title: "Perumahan & Kawasan Permukiman",
    slug: "perumahan",
    icon: "🏘️",
    heroImage: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1920&h=800&fit=crop",
    shortDesc: "Pengembangan perumahan layak huni dan penataan kawasan kumuh.",
    fullDesc: "Kami membantu pemerintah dan swasta dalam menyusun rencana pengembangan perumahan dan kawasan permukiman yang layak huni, berkelanjutan, serta mendukung program Kota Tanpa Kumuh (Kotaku).",
    objectives: [
      "Menyediakan perumahan layak huni bagi masyarakat",
      "Menata kawasan kumuh menjadi lingkungan sehat",
      "Mendorong pembangunan berkelanjutan"
    ],
    services: [
      "Penyusunan Rencana Tata Ruang Kawasan Permukiman",
      "Studi Pengembangan Perumahan",
      "Program Kotaku (Kota Tanpa Kumuh)",
      "Pembangunan Infrastruktur Permukiman"
    ],
    projects: [
      { title: "Revitalisasi Rusunawa Marunda", year: 2022, client: "Pemprov DKI" },
      { title: "Penataan Kampung Deret Petogogan", year: 2021, client: "Pemkot Jakarta Selatan" }
    ],
    achievements: [
      { value: "10.000+", label: "Unit Rumah" },
      { value: "5", label: "Kawasan Kumuh Tertata" },
      { value: "100%", label: "Kepuasan" }
    ],
    team: [
      { name: "Ir. Siti Nurhaliza, M.Sc", role: "Ahli Perumahan", expertise: "Perumahan", image: "https://randomuser.me/api/portraits/women/55.jpg" }
    ],
    faqs: [
      { q: "Apakah LPPSLH membantu program Kotaku?", a: "Ya, kami mendampingi pemerintah daerah dalam program Kota Tanpa Kumuh." }
    ]
  },
  "sumber-daya-air": {
    title: "Sumber Daya Air & Lingkungan",
    slug: "sumber-daya-air",
    icon: "💧",
    heroImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&h=800&fit=crop",
    shortDesc: "Pengelolaan air minum, sanitasi, dan konservasi lingkungan.",
    fullDesc: "Kami menyediakan jasa konsultansi di bidang sumber daya air dan lingkungan, meliputi pengelolaan air baku, sanitasi, drainase perkotaan, serta konservasi daerah aliran sungai (DAS).",
    objectives: [
      "Meningkatkan akses air bersih dan sanitasi",
      "Mengendalikan banjir dan erosi",
      "Melestarikan lingkungan hidup"
    ],
    services: [
      "Studi Kelayakan Air Minum",
      "Perencanaan Sistem Drainase",
      "Pengelolaan DAS",
      "AMDAL & UKL-UPL"
    ],
    projects: [
      { title: "Pengelolaan DAS Citarum", year: 2022, client: "Kementerian PUPR" },
      { title: "Sistem Penyediaan Air Minum Regional", year: 2023, client: "Pemprov Jabar" }
    ],
    achievements: [
      { value: "100+", label: "Proyek Air" },
      { value: "50+", label: "DAS" },
      { value: "98%", label: "Kepuasan" }
    ],
    team: [
      { name: "Dewi Anggraini, S.Hut", role: "Ahli Lingkungan", expertise: "AMDAL", image: "https://randomuser.me/api/portraits/women/89.jpg" }
    ],
    faqs: [
      { q: "Berapa lama studi AMDAL?", a: "Umumnya 6-12 bulan." }
    ]
  },
  pertanian: {
    title: "Pertanian & Ketahanan Pangan",
    slug: "pertanian",
    icon: "🌾",
    heroImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&h=800&fit=crop",
    shortDesc: "Pengembangan agribisnis dan ketahanan pangan.",
    fullDesc: "LPPSLH membantu meningkatkan produktivitas pertanian, ketahanan pangan, dan pengembangan agribisnis melalui perencanaan yang terintegrasi dan berbasis teknologi.",
    objectives: [
      "Meningkatkan produksi pangan nasional",
      "Memperkuat ketahanan pangan daerah",
      "Mengembangkan agribisnis berkelanjutan"
    ],
    services: [
      "Studi Pengembangan Komoditas Unggulan",
      "Perencanaan Irigasi Pertanian",
      "Pendampingan Program Ketahanan Pangan"
    ],
    projects: [
      { title: "Pengembangan Food Estate Kalimantan", year: 2023, client: "Kementan" },
      { title: "Irigasi Perpompaan Jawa Timur", year: 2022, client: "Pemprov Jatim" }
    ],
    achievements: [
      { value: "200+", label: "Hektar Lahan" },
      { value: "30+", label: "Komoditas" },
      { value: "100%", label: "Kepuasan" }
    ],
    team: [
      { name: "Dr. Ir. Budi Santoso", role: "Ahli Pertanian", expertise: "Agribisnis", image: "https://randomuser.me/api/portraits/men/45.jpg" }
    ],
    faqs: [
      { q: "Apakah LPPSLH membantu program food estate?", a: "Ya, kami mendampingi perencanaan food estate di berbagai daerah." }
    ]
  },
  "pembangunan-pedesaan": {
    title: "Pembangunan Pedesaan",
    slug: "pembangunan-pedesaan",
    icon: "🏡",
    heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=800&fit=crop",
    shortDesc: "Pemberdayaan masyarakat dan pengembangan BUMDes.",
    fullDesc: "Kami fokus pada pemberdayaan masyarakat desa, pengembangan Badan Usaha Milik Desa (BUMDes), serta perencanaan infrastruktur pedesaan yang berkelanjutan.",
    objectives: [
      "Meningkatkan kesejahteraan masyarakat desa",
      "Memperkuat kelembagaan BUMDes",
      "Mengembangkan potensi desa"
    ],
    services: [
      "Pendampingan BUMDes",
      "Perencanaan Infrastruktur Desa",
      "Pelatihan Pemberdayaan Masyarakat"
    ],
    projects: [
      { title: "Pengembangan BUMDes di Jawa Tengah", year: 2023, client: "Kemendes PDTT" },
      { title: "Infrastruktur Desa Wisata", year: 2022, client: "Pemkab Bantul" }
    ],
    achievements: [
      { value: "50+", label: "Desa" },
      { value: "30+", label: "BUMDes" },
      { value: "100%", label: "Kepuasan" }
    ],
    team: [
      { name: "Ir. Siti Nurhaliza, M.Sc", role: "Ahli Pemberdayaan", expertise: "Community Development", image: "https://randomuser.me/api/portraits/women/55.jpg" }
    ],
    faqs: [
      { q: "Apakah LPPSLH memberikan pelatihan BUMDes?", a: "Ya, kami memiliki program pelatihan pengelolaan BUMDes." }
    ]
  },
  pendidikan: {
    title: "Pendidikan & Peningkatan Kapasitas",
    slug: "pendidikan",
    icon: "📚",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=800&fit=crop",
    shortDesc: "Pelatihan, workshop, dan pengembangan SDM.",
    fullDesc: "LPPSLH menyediakan program pelatihan dan peningkatan kapasitas bagi aparatur pemerintah, swasta, dan masyarakat umum di berbagai bidang.",
    objectives: [
      "Meningkatkan kompetensi SDM",
      "Menyediakan pelatihan berkualitas",
      "Mendukung sertifikasi profesi"
    ],
    services: [
      "Pelatihan Perencanaan",
      "Workshop GIS & Pemetaan",
      "Sertifikasi Profesi"
    ],
    projects: [
      { title: "Pelatihan GIS Angkatan I 2024", year: 2024, client: "Bappeda Jatim" },
      { title: "Workshop Manajemen Proyek", year: 2023, client: "Kementerian PUPR" }
    ],
    achievements: [
      { value: "1.000+", label: "Peserta" },
      { value: "50+", label: "Kelas" },
      { value: "95%", label: "Kepuasan" }
    ],
    team: [
      { name: "M. Rizky, S.Si, M.T.", role: "Instruktur GIS", expertise: "Pelatihan", image: "https://randomuser.me/api/portraits/men/75.jpg" }
    ],
    faqs: [
      { q: "Apakah peserta mendapatkan sertifikat?", a: "Ya, setiap peserta mendapatkan sertifikat resmi." }
    ]
  },
  kesehatan: {
    title: "Kesehatan & Sanitasi",
    slug: "kesehatan",
    icon: "🏥",
    heroImage: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1920&h=800&fit=crop",
    shortDesc: "Program sanitasi dan kesehatan masyarakat.",
    fullDesc: "Kami membantu pemerintah dan lembaga swasta dalam perencanaan program kesehatan masyarakat, sanitasi total berbasis masyarakat (STBM), serta pengembangan infrastruktur kesehatan.",
    objectives: [
      "Meningkatkan akses sanitasi layak",
      "Mengurangi stunting dan penyakit menular",
      "Membangun fasilitas kesehatan"
    ],
    services: [
      "Perencanaan Sanitasi Total (STBM)",
      "Studi Kesehatan Masyarakat",
      "Perencanaan Puskesmas & RS"
    ],
    projects: [
      { title: "Program STBM Jawa Barat", year: 2023, client: "Pemprov Jabar" },
      { title: "Pembangunan Puskesmas Rawat Inap", year: 2022, client: "Pemkab Bandung" }
    ],
    achievements: [
      { value: "200+", label: "Desa STBM" },
      { value: "10+", label: "Puskesmas" },
      { value: "90%", label: "Akses Sanitasi" }
    ],
    team: [
      { name: "Dewi Anggraini, S.Hut", role: "Ahli Sanitasi", expertise: "STBM", image: "https://randomuser.me/api/portraits/women/89.jpg" }
    ],
    faqs: [
      { q: "Apa itu program STBM?", a: "Sanitasi Total Berbasis Masyarakat, program pilar sanitasi." }
    ]
  }
};

// ========== Helper Functions ==========
export function getAllSectorSlugs(): { slug: string }[] {
  return Object.keys(sectors).map(slug => ({ slug }));
}