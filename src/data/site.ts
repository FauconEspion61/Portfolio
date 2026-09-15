// Toutes tes informations personnelles vivent ici : elles alimentent le header,
// la page d'accueil, la page Parcours (CV) et le pied de page.
//
// Chaque champ traduisible est un objet { fr, en }. Si tu ajoutes une entrée en
// oubliant sa traduction, le `npm run build` échoue : c'est voulu, ça évite de
// publier un site à moitié traduit.

import type { Localized, LocalizedList } from "../i18n";

export interface TimelineEntry {
  /** "formation" = diplôme / école · "experience" = stage, projet de recherche, job */
  kind: "formation" | "experience";
  /** Intitulé : diplôme ou poste occupé */
  title: Localized;
  /** Établissement ou entreprise */
  org: Localized;
  location?: Localized;
  /** Ex. "2024 – 2027", "Été 2026" */
  period: Localized;
  description?: Localized;
  /** Puces de réalisations concrètes (le plus important pour un recruteur) */
  bullets?: LocalizedList;
  /** Technos / mots-clés associés */
  tags?: LocalizedList;
  /** true = en cours (affiche une pastille "en cours") */
  current?: boolean;
}

export const site = {
  name: "Paul FOLTZER",

  role: {
    fr: "Étudiant ingénieur EMSE – ISMIN — Systèmes Embarqués & Sécurité des Architectures Numériques et de l'IA",
    en: "Engineering student at Mines Saint-Étienne (ISMIN) — Embedded Systems & Security of Digital and AI Architectures",
  },

  tagline: {
    fr: "Je conçois des systèmes qui mêlent électronique, mécanique et logiciel — du firmware embarqué au traitement de données.",
    en: "I build systems where electronics, mechanics and software meet — from embedded firmware to data processing.",
  },

  bio: {
    fr: [
      "Actuellement en 3ᵉ année à l'École des Mines de Saint-Étienne (EMSE – ISMIN), je me spécialise en Systèmes Embarqués et en Sécurité des Architectures Numériques et de l'IA. Passionné par l'intelligence artificielle, j'ai mené un projet de recherche à l'Université de Bradford (Royaume-Uni) sur le transfert d'apprentissage appliqué à l'imagerie industrielle par tomographie (CT). Ces travaux ont donné lieu à un article de recherche, actuellement en cours d'évaluation en vue d'une publication : « Data-Efficient Industrial CT Defect Segmentation via Self-Supervised and Cross-Domain Pretraining ».",
      "Au-delà du cadre académique, je suis quelqu'un de proactif : j'aime me lancer des défis personnels à travers des projets qui me poussent à explorer de nouveaux domaines techniques.",
    ],
    en: [
      "I am in my final year at Mines Saint-Étienne (ISMIN), a French engineering grande école, majoring in Embedded Systems and Security of Digital and AI Architectures. Driven by a strong interest in artificial intelligence, I carried out a research project at the University of Bradford (UK) on transfer learning applied to industrial X-ray computed tomography. That work produced a research paper, currently under review for publication: “Data-Efficient Industrial CT Defect Segmentation via Self-Supervised and Cross-Domain Pretraining”.",
      "Outside the academic setting I am a self-starter: I like setting myself challenges through projects that push me into technical territory I haven't explored yet.",
    ],
  },

  location: { fr: "France", en: "France" },
  email: "foltzerpaul@gmail.com",

  /**
   * Statut affiché en pastille sur la page d'accueil.
   * Mets `null` des deux côtés pour ne rien afficher.
   */
  availability: {
    fr: "Recherche un stage de fin d'études — 2027",
    en: "Looking for a final-year internship — 2027",
  } as Localized | null,

  links: {
    github: "https://github.com/FauconEspion61",
    linkedin: "https://www.linkedin.com/in/paul-foltzer",
    /** Dépose ton PDF dans public/cv/ puis mets son chemin ici, ex : "/cv/cv-paul-foltzer.pdf" */
    cv: null as string | null,
    /** Version anglaise du CV, si tu en prépares une (sinon le PDF français est servi aux deux) */
    cvEn: null as string | null,
    /** Date de dernière mise à jour du PDF (ex : { fr: "Septembre 2026", en: "September 2026" }) */
    cvUpdated: null as Localized | null,
  },

  /**
   * Chiffres mis en avant sur la page d'accueil (le nombre de projets est ajouté
   * automatiquement). Garde-les vérifiables : un recruteur peut poser la question.
   */
  stats: [
    {
      value: "9 000+",
      label: {
        fr: "assertions de tests écrites (TransformerCpp)",
        en: "test assertions written (TransformerCpp)",
      },
    },
    {
      value: "×30",
      label: {
        fr: "accélération de l'entraînement après portage GPU",
        en: "training speed-up after the GPU port",
      },
    },
    {
      value: "1",
      label: {
        fr: "article de recherche en cours d'évaluation",
        en: "research paper under review",
      },
    },
  ],

  /**
   * Ton CV, section par section. Les entrées apparaissent dans l'ordre du tableau,
   * regroupées automatiquement en "Formation" et "Expériences".
   */
  timeline: [
    {
      kind: "experience",
      title: {
        fr: "Stage de recherche — apprentissage profond économe en données pour la détection de défauts en tomographie industrielle",
        en: "Research internship — data-efficient deep learning for defect detection in industrial CT",
      },
      org: {
        fr: "University of Bradford — laboratoire Smart Manufacturing",
        en: "University of Bradford — Smart Manufacturing lab",
      },
      location: { fr: "Bradford, Royaume-Uni", en: "Bradford, United Kingdom" },
      period: { fr: "Avril – Août 2026 (4 mois)", en: "April – August 2026 (4 months)" },
      description: {
        fr: "Projet de recherche mené de bout en bout au sein de la Faculty of Engineering & Digital Technologies, encadré par le Pr. Ciprian Daniel Neagu (groupe de recherche en IA — AIRE). Question de départ : combien de données industrielles réelles faut-il pour segmenter automatiquement des défauts internes en tomographie à rayons X, et dans quelle mesure un pré-entraînement médical ou des données fabriquées sur mesure permettent-ils d'en réduire le besoin ?",
        en: "A research project carried out end to end within the Faculty of Engineering & Digital Technologies, supervised by Prof. Ciprian Daniel Neagu (AIRE artificial intelligence research group). The starting question: how much real industrial data does it actually take to segment internal defects in X-ray CT automatically, and to what extent can medical pre-training or purpose-built surrogate data reduce that need?",
      },
      bullets: {
        fr: [
          "Conception d'un pipeline de génération automatique de données annotées : génération paramétrique de pièces de test en Python (trimesh), impression 3D à 100 % de remplissage, acquisition tomographique, puis dérivation de la vérité terrain par seuillage d'intensité — 90 pièces annotées sans aucune annotation manuelle ni recalage CAO.",
          "Entraînement de l'architecture Swin-UNETR (PyTorch / MONAI) pour la segmentation volumique 3D : correction d'un déséquilibre de classes extrême, gel puis dégel de l'encodeur, inférence par fenêtre glissante sur des volumes de plusieurs milliards de voxels. Dice porté de 0,33 à 0,53 sur le jeu médical de calibration.",
          "Comparaison contrôlée de trois stratégies d'initialisation (aléatoire, auto-supervisée, auto-supervisée + affinage médical) et tracé d'une courbe d'efficacité en données de 5 à 63 pièces, avec graines multiples et tests de Wilcoxon appariés.",
          "Résultat principal, validé sur neuf pièces industrielles réelles en validation croisée leave-one-out : affiner sur 7 pièces réelles multiplie le Dice par 1,8 à 2,1 par rapport à un entraînement sur neuf fois plus de données de substitution.",
          "Rédaction d'un article de recherche en anglais (13 pages) — « Data-Efficient Industrial CT Defect Segmentation via Self-Supervised and Cross-Domain Pretraining », en cours d'évaluation — et présentation hebdomadaire des résultats aux encadrants, en anglais.",
        ],
        en: [
          "Designed a pipeline that generates annotated data automatically: parametric test-part generation in Python (trimesh), 3D printing at 100 % infill, CT acquisition, then ground truth derived from the scan by intensity thresholding — 90 annotated parts with no manual labelling and no CAD-to-scan registration.",
          "Trained the Swin-UNETR architecture (PyTorch / MONAI) for 3D volumetric segmentation: corrected an extreme class imbalance, froze then unfroze the encoder, ran sliding-window inference over volumes of several billion voxels. Dice raised from 0.33 to 0.53 on the medical calibration set.",
          "Ran a controlled comparison of three initialisation strategies (random, self-supervised, self-supervised plus medical fine-tuning) and plotted a data-efficiency curve from 5 to 63 parts, with multiple seeds and paired Wilcoxon tests.",
          "Headline result, validated on nine real industrial parts under leave-one-out cross-validation: fine-tuning on 7 real parts multiplies Dice by 1.8 to 2.1 compared with training on nine times more surrogate data.",
          "Wrote a 13-page research paper in English — “Data-Efficient Industrial CT Defect Segmentation via Self-Supervised and Cross-Domain Pretraining”, currently under review — and presented results weekly to my supervisors, in English.",
        ],
      },
      tags: {
        fr: [
          "PyTorch",
          "MONAI",
          "Swin-UNETR",
          "Segmentation 3D",
          "Imagerie CT",
          "Python",
          "trimesh",
          "Impression 3D",
          "3D Slicer",
          "Analyse statistique",
        ],
        en: [
          "PyTorch",
          "MONAI",
          "Swin-UNETR",
          "3D segmentation",
          "CT imaging",
          "Python",
          "trimesh",
          "3D printing",
          "3D Slicer",
          "Statistical analysis",
        ],
      },
    },
    {
      kind: "formation",
      title: {
        fr: "Cycle ingénieur ISMIN — majeure Systèmes embarqués & Sécurité des architectures numériques et de l'IA",
        en: "ISMIN engineering degree — major in Embedded Systems & Security of Digital and AI Architectures",
      },
      org: { fr: "Mines Saint-Étienne (EMSE)", en: "Mines Saint-Étienne (EMSE)" },
      location: {
        fr: "Campus Georges Charpak Provence, Gardanne",
        en: "Georges Charpak Provence campus, Gardanne, France",
      },
      // TODO : remplace par tes années de cursus complètes, ex "2024 – 2027"
      period: { fr: "3ᵉ année — 2026/2027", en: "Final year — 2026/2027" },
      current: true,
      description: {
        fr: "Majeure choisie à l'issue du stage de recherche, dans la perspective de l'edge AI : exécuter des modèles d'intelligence artificielle au plus près du matériel, sous contraintes de mémoire, de calcul et d'énergie.",
        en: "A major chosen after the research internship, with edge AI in mind: running artificial intelligence models as close to the hardware as possible, under memory, compute and power constraints.",
      },
      tags: {
        fr: ["Systèmes embarqués", "Sécurité numérique", "IA", "Edge AI"],
        en: ["Embedded systems", "Digital security", "AI", "Edge AI"],
      },
    },
    // ---------------------------------------------------------------------
    // Modèle à dupliquer pour chaque ligne de ton CV :
    // {
    //   kind: "experience", // ou "formation"
    //   title: { fr: "Stage développeur embarqué", en: "Embedded software intern" },
    //   org: { fr: "Nom de l'entreprise", en: "Company name" },
    //   location: { fr: "Ville", en: "City" },
    //   period: { fr: "Juin – Août 2027", en: "June – August 2027" },
    //   description: { fr: "Une phrase de contexte.", en: "One sentence of context." },
    //   bullets: { fr: ["Réalisation 1"], en: ["Achievement 1"] },
    //   tags: { fr: ["C", "STM32"], en: ["C", "STM32"] },
    // },
    // ---------------------------------------------------------------------
  ] as TimelineEntry[],

  /** Langues affichées sur la page Parcours. */
  languages: [
    {
      name: { fr: "Français", en: "French" },
      level: { fr: "Langue maternelle", en: "Native speaker" },
    },
    {
      name: { fr: "Anglais", en: "English" },
      // Formulation fondée sur des faits vérifiables plutôt que sur un niveau
      // auto-déclaré. Remplace par ton score TOEIC / niveau CECRL si tu l'as.
      level: {
        fr: "Contexte professionnel — 4 mois de recherche au Royaume-Uni, article et présentations en anglais",
        en: "Professional working proficiency — 4 months of research in the UK, paper and presentations in English",
      },
    },
  ],

  skills: [
    {
      category: { fr: "Deep learning", en: "Deep learning" },
      items: {
        fr: [
          "PyTorch / MONAI",
          "Segmentation volumique 3D (Swin-UNETR)",
          "Transfert d'apprentissage & pré-entraînement auto-supervisé",
          "Déséquilibre de classes (pertes pondérées, focale)",
        ],
        en: [
          "PyTorch / MONAI",
          "3D volumetric segmentation (Swin-UNETR)",
          "Transfer learning & self-supervised pre-training",
          "Class imbalance (weighted and focal losses)",
        ],
      },
    },
    {
      category: { fr: "IA & calcul haute performance", en: "AI & high-performance computing" },
      items: {
        fr: ["C++17 / CUDA", "Implémentation from scratch (Transformer, CNN)", "cuBLAS, kernels GPU"],
        en: ["C++17 / CUDA", "From-scratch implementations (Transformer, CNN)", "cuBLAS, custom GPU kernels"],
      },
    },
    {
      category: { fr: "Embarqué", en: "Embedded" },
      items: {
        fr: ["STM32 / C", "Firmware temps réel", "Pilotage moteur (DRV8825, NEMA17)"],
        en: ["STM32 / C", "Real-time firmware", "Stepper motor control (DRV8825, NEMA17)"],
      },
    },
    {
      category: { fr: "Systèmes & Linux", en: "Systems & Linux" },
      items: {
        fr: ["Jetson / L4T", "Device tree & overlays", "Debug matériel bas niveau"],
        en: ["Jetson / L4T", "Device tree & overlays", "Low-level hardware debugging"],
      },
    },
    {
      category: { fr: "Données & imagerie", en: "Data & imaging" },
      items: {
        fr: [
          "Python (numpy, scipy, scikit-image)",
          "Imagerie tomographique (CT)",
          "Reconstruction tomographique (iradon)",
          "Analyse statistique (Wilcoxon, Wasserstein)",
        ],
        en: [
          "Python (numpy, scipy, scikit-image)",
          "Computed tomography imaging",
          "Tomographic reconstruction (iradon)",
          "Statistical analysis (Wilcoxon, Wasserstein)",
        ],
      },
    },
    {
      category: { fr: "Fabrication & instrumentation", en: "Fabrication & instrumentation" },
      items: {
        fr: [
          "CAO paramétrique en Python (trimesh)",
          "Impression 3D FDM",
          "Acquisition tomographique à rayons X",
        ],
        en: [
          "Parametric CAD in Python (trimesh)",
          "FDM 3D printing",
          "X-ray CT acquisition",
        ],
      },
    },
    {
      category: { fr: "Outils", en: "Tools" },
      items: {
        fr: ["Git", "STM32CubeIDE", "3D Slicer", "VGStudio", "VS Code"],
        en: ["Git", "STM32CubeIDE", "3D Slicer", "VGStudio", "VS Code"],
      },
    },
  ],
};
