// src/lib/projects.ts

interface Achievement {
  value: string;
  label: string;
}

interface Challenge {
  challenge: string;
  solution: string;
}

interface Timeline {
  phase: string;
  date: string;
  desc: string;
}

interface Stakeholder {
  name: string;
  role: string;
  logo?: string;
}

interface Testimonial {
  text: string;
  name: string;
  position: string;
  avatar: string;
}

interface Document {
  name: string;
  type: string;
  size: string;
  url: string;
}

interface RelatedProject {
  slug: string;
  title: string;
  image: string;
}

export interface Project {
  title: string;
  slug: string;
  client: string;
  location: string;
  year: number;
  value: string;
  status: string; // 'completed' | 'ongoing' | 'planned'
  duration: string;
  category: string;
  progress: number;
  imageHero: string;
  images: string[];
  desc: string;
  fullDesc: string;
  objectives: string[];
  achievements: Achievement[];
  challenges: Challenge[];
  timeline: Timeline[];
  personilIds: number[];
  stakeholders: Stakeholder[];
  testimonial: Testimonial;
  documents: Document[];
  videoUrl: string | null;
  relatedProjects: RelatedProject[];
  // 👇 TAMBAHKAN INI
  organigramRoles?: {
    projectManager?: string;   // default "Senior Planner"
    gisConsultant?: string;    // default "Konsultan GIS"
    gisSpecialist?: string;    // default "Ahli GIS"
    environmental?: string;    // default "Konsultan Lingkungan"
    qaQc?: string;             // optional
    k3?: string;               // optional
  };
}

export const projects: Record<string, Project> = {
  'bandara-jawa-barat': {
    title: "Bandara Internasional Jawa Barat",
    slug: "bandara-jawa-barat",
    client: "PT Angkasa Pura II",
    location: "Majalengka, Jawa Barat",
    year: 2024,
    value: "Rp 12.5 Triliun",
    status: "completed",
    duration: "36 bulan",
    category: "Infrastruktur",
    progress: 100,
    imageHero: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&h=600&fit=crop"
    ],
    desc: "Pengembangan bandara internasional kapasitas 20 juta penumpang/tahun.",
    fullDesc: "Bandara Internasional Jawa Barat (BIJB) dikembangkan untuk mengurangi beban Bandara Soekarno-Hatta. LPPSLH bertugas sebagai konsultan manajemen proyek dan supervisi. Proyek ini selesai tepat waktu dan telah beroperasi penuh sejak 2024.",
    objectives: [
      "Meningkatkan konektivitas udara di Jawa Barat",
      "Mengurangi beban Bandara Soekarno-Hatta",
      "Mendorong pertumbuhan ekonomi regional"
    ],
    achievements: [
      { value: "20 Juta", label: "Penumpang/Tahun" },
      { value: "150.000 m²", label: "Luas Terminal" }
    ],
    challenges: [
      { challenge: "Pembebasan lahan yang kompleks", solution: "Pendekatan musyawarah dengan masyarakat dan kompensasi yang adil." }
    ],
    timeline: [
      { phase: "Perencanaan", date: "Jan 2021 - Mar 2021", desc: "Studi kelayakan dan desain konsep." },
      { phase: "Konstruksi", date: "Apr 2021 - Des 2023", desc: "Pembangunan fisik terminal dan landasan." }
    ],
    personilIds: [1, 2, 3, 4, 5, 6],
    stakeholders: [
      { name: "Kementerian Perhubungan", role: "Regulator" },
      { name: "PT Angkasa Pura II", role: "Owner" }
    ],
    testimonial: {
      text: "LPPSLH menunjukkan profesionalisme tinggi, proyek selesai tepat waktu.",
      name: "Ir. Budi Karya",
      position: "Menteri Perhubungan",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    documents: [
      { name: "Laporan Akhir Proyek", type: "PDF", size: "5.2 MB", url: "#" }
    ],
    videoUrl: null,
    relatedProjects: [],
    // 👇 Konfigurasi organigram untuk proyek ini
    organigramRoles: {
      projectManager: "Senior Planner",        // default, bisa diubah
      gisConsultant: "Konsultan GIS",
      gisSpecialist: "Ahli GIS",
      environmental: "Konsultan Lingkungan",
      qaQc: "QA/QC Manager",                  // contoh jika ada personil dengan posisi ini
      k3: "HSE Officer"
    }
  },

  'tower-a': {
    title: "Tower A",
    slug: "tower-a",
    client: "PT Properti Maju",
    location: "Jakarta Selatan, DKI Jakarta",
    year: 2023,
    value: "Rp 850 Miliar",
    status: "completed",
    duration: "24 bulan",
    category: "Gedung Perkantoran",
    progress: 100,
    imageHero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
    ],
    desc: "Pembangunan gedung perkantoran 30 lantai dengan konsep hemat energi.",
    fullDesc: "Tower A merupakan gedung perkantoran kelas A yang terletak di pusat bisnis Jakarta Selatan. Proyek ini mengusung konsep ramah lingkungan dengan efisiensi energi 30%. LPPSLH bertindak sebagai konsultan manajemen konstruksi dan supervisi penuh.",
    objectives: [
      "Menyediakan ruang kantor premium",
      "Efisiensi energi 30%"
    ],
    achievements: [
      { value: "30 Lantai", label: "Tinggi" },
      { value: "45.000 m²", label: "Luas" }
    ],
    challenges: [
      { challenge: "Lahan terbatas", solution: "Desain vertikal inovatif" }
    ],
    timeline: [
      { phase: "Konstruksi", date: "2021-2023", desc: "Pembangunan" }
    ],
    personilIds: [1, 2, 5],
    stakeholders: [
      { name: "PT Properti Maju", role: "Developer" }
    ],
    testimonial: {
      text: "Kerja sama yang baik.",
      name: "Andi",
      position: "Direktur",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    documents: [],
    videoUrl: null,
    relatedProjects: [],
    // 👇 Konfigurasi berbeda untuk Tower A (jabatan disesuaikan)
    organigramRoles: {
      projectManager: "Project Director",      // berbeda dengan bandara
      gisConsultant: "GIS Coordinator",
      gisSpecialist: "GIS Analyst",
      environmental: "Environmental Specialist",
      // qaQc dan k3 tidak disediakan (akan tampil placeholder)
    }
  }
};