// Toutes tes informations personnelles vivent ici : elles alimentent le header,
// la page d'accueil, la page Parcours (CV) et le pied de page.

export interface TimelineEntry {
  /** "formation" = diplôme / école · "experience" = stage, projet de recherche, job */
  kind: "formation" | "experience";
  /** Intitulé : diplôme ou poste occupé */
  title: string;
  /** Établissement ou entreprise */
  org: string;
  location?: string;
  /** Ex. "2024 – 2027", "Été 2026" */
  period: string;
  description?: string;
  /** Puces de réalisations concrètes (le plus important pour un recruteur) */
  bullets?: string[];
  /** Technos / mots-clés associés */
  tags?: string[];
  /** true = en cours (affiche une pastille "en cours") */
  current?: boolean;
}

export const site = {
  name: "Paul FOLTZER",
  role: "Étudiant ingénieur EMSE – ISMIN — Systèmes Embarqués & Sécurité des Architectures Numériques et de l'IA",
  tagline:
    "Je conçois des systèmes qui mêlent électronique, mécanique et logiciel — du firmware embarqué au traitement de données.",
  bio: [
    "Actuellement en 3ᵉ année à l'École des Mines de Saint-Étienne (EMSE – ISMIN), je me spécialise en Systèmes Embarqués et en Sécurité des Architectures Numériques et de l'IA. Passionné par l'intelligence artificielle, j'ai mené un projet de recherche à l'Université de Bradford (Royaume-Uni) sur le transfert d'apprentissage appliqué à l'imagerie industrielle par tomographie (CT). Ces travaux ont donné lieu à un article de recherche, actuellement en cours d'évaluation en vue d'une publication : « Data-Efficient Industrial CT Defect Segmentation via Self-Supervised and Cross-Domain Pretraining ».",
    "Au-delà du cadre académique, je suis quelqu'un de proactif : j'aime me lancer des défis personnels à travers des projets qui me poussent à explorer de nouveaux domaines techniques.",
  ],
  location: "France",
  email: "foltzerpaul@gmail.com",

  /**
   * Statut affiché en pastille sur la page d'accueil.
   * Mets une phrase courte, ex : "Recherche un stage de fin d'études — 2027".
   * Laisse à null pour ne rien afficher.
   */
  availability: "Recherche un stage de fin d'études — 2027" as string | null,

  links: {
    github: "https://github.com/FauconEspion61",
    linkedin: "https://www.linkedin.com/in/paul-foltzer",
    /** Dépose ton PDF dans public/cv/ puis mets son chemin ici, ex : "/cv/cv-paul-foltzer.pdf" */
    cv: null as string | null,
    /** Date de dernière mise à jour du PDF, affichée sous le bouton (ex : "Septembre 2026") */
    cvUpdated: null as string | null,
  },

  /**
   * Chiffres mis en avant sur la page d'accueil (le nombre de projets est ajouté
   * automatiquement). Garde-les vérifiables : un recruteur peut poser la question.
   */
  stats: [
    { value: "9 000+", label: "assertions de tests écrites (TransformerCpp)" },
    { value: "×30", label: "accélération de l'entraînement après portage GPU" },
    { value: "1", label: "article de recherche en cours d'évaluation" },
  ],

  /**
   * Ton CV, section par section. Les entrées apparaissent dans l'ordre du tableau,
   * regroupées automatiquement en "Formation" et "Expériences".
   */
  timeline: [
    {
      kind: "experience",
      title:
        "Stage de recherche — apprentissage profond économe en données pour la détection de défauts en tomographie industrielle",
      org: "University of Bradford — laboratoire Smart Manufacturing",
      location: "Bradford, Royaume-Uni",
      period: "Avril – Août 2026 (4 mois)",
      description:
        "Projet de recherche mené de bout en bout au sein de la Faculty of Engineering & Digital Technologies, encadré par le Pr. Ciprian Daniel Neagu (groupe de recherche en IA — AIRE). Question de départ : combien de données industrielles réelles faut-il pour segmenter automatiquement des défauts internes en tomographie à rayons X, et dans quelle mesure un pré-entraînement médical ou des données fabriquées sur mesure permettent-ils d'en réduire le besoin ?",
      bullets: [
        "Conception d'un pipeline de génération automatique de données annotées : génération paramétrique de pièces de test en Python (trimesh), impression 3D à 100 % de remplissage, acquisition tomographique, puis dérivation de la vérité terrain par seuillage d'intensité — 90 pièces annotées sans aucune annotation manuelle ni recalage CAO.",
        "Entraînement de l'architecture Swin-UNETR (PyTorch / MONAI) pour la segmentation volumique 3D : correction d'un déséquilibre de classes extrême, gel puis dégel de l'encodeur, inférence par fenêtre glissante sur des volumes de plusieurs milliards de voxels. Dice porté de 0,33 à 0,53 sur le jeu médical de calibration.",
        "Comparaison contrôlée de trois stratégies d'initialisation (aléatoire, auto-supervisée, auto-supervisée + affinage médical) et tracé d'une courbe d'efficacité en données de 5 à 63 pièces, avec graines multiples et tests de Wilcoxon appariés.",
        "Résultat principal, validé sur neuf pièces industrielles réelles en validation croisée leave-one-out : affiner sur 7 pièces réelles multiplie le Dice par 1,8 à 2,1 par rapport à un entraînement sur neuf fois plus de données de substitution.",
        "Rédaction d'un article de recherche en anglais (13 pages) — « Data-Efficient Industrial CT Defect Segmentation via Self-Supervised and Cross-Domain Pretraining », en cours d'évaluation — et présentation hebdomadaire des résultats aux encadrants, en anglais.",
      ],
      tags: [
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
    },
    {
      kind: "formation",
      title:
        "Cycle ingénieur ISMIN — majeure Systèmes embarqués & Sécurité des architectures numériques et de l'IA",
      org: "Mines Saint-Étienne (EMSE)",
      location: "Campus Georges Charpak Provence, Gardanne",
      period: "3ᵉ année — 2026/2027", // TODO : remplace par tes années de cursus complètes, ex "2024 – 2027"
      current: true,
      description:
        "Majeure choisie à l'issue du stage de recherche, dans la perspective de l'edge AI : exécuter des modèles d'intelligence artificielle au plus près du matériel, sous contraintes de mémoire, de calcul et d'énergie.",
      tags: ["Systèmes embarqués", "Sécurité numérique", "IA", "Edge AI"],
    },
    // ---------------------------------------------------------------------
    // Modèle à dupliquer pour chaque ligne de ton CV :
    // {
    //   kind: "experience", // ou "formation"
    //   title: "Stage développeur embarqué",
    //   org: "Nom de l'entreprise",
    //   location: "Ville",
    //   period: "Juin – Août 2027",
    //   description: "Une phrase de contexte sur la mission.",
    //   bullets: ["Réalisation concrète 1", "Réalisation concrète 2"],
    //   tags: ["C", "STM32"],
    // },
    // ---------------------------------------------------------------------
  ] as TimelineEntry[],

  /** Langues affichées sur la page Parcours. */
  languages: [
    { name: "Français", level: "Langue maternelle" },
    {
      name: "Anglais",
      // Formulation fondée sur des faits vérifiables plutôt que sur un niveau
      // auto-déclaré. Remplace par ton score TOEIC / niveau CECRL si tu l'as.
      level: "Contexte professionnel — 4 mois de recherche au Royaume-Uni, article et présentations en anglais",
    },
  ],

  skills: [
    {
      category: "Deep learning",
      items: [
        "PyTorch / MONAI",
        "Segmentation volumique 3D (Swin-UNETR)",
        "Transfert d'apprentissage & pré-entraînement auto-supervisé",
        "Déséquilibre de classes (pertes pondérées, focale)",
      ],
    },
    {
      category: "IA & calcul haute performance",
      items: ["C++17 / CUDA", "Implémentation from scratch (Transformer, CNN)", "cuBLAS, kernels GPU"],
    },
    {
      category: "Embarqué",
      items: ["STM32 / C", "Firmware temps réel", "Pilotage moteur (DRV8825, NEMA17)"],
    },
    {
      category: "Systèmes & Linux",
      items: ["Jetson / L4T", "Device tree & overlays", "Debug matériel bas niveau"],
    },
    {
      category: "Données & imagerie",
      items: [
        "Python (numpy, scipy, scikit-image)",
        "Imagerie tomographique (CT)",
        "Reconstruction tomographique (iradon)",
        "Analyse statistique (Wilcoxon, Wasserstein)",
      ],
    },
    {
      category: "Fabrication & instrumentation",
      items: [
        "CAO paramétrique en Python (trimesh)",
        "Impression 3D FDM",
        "Acquisition tomographique à rayons X",
      ],
    },
    {
      category: "Outils",
      items: ["Git", "STM32CubeIDE", "3D Slicer", "VGStudio", "VS Code"],
    },
  ],
};
