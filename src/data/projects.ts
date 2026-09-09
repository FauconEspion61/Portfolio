export interface ProjectMedia {
  /** "diagram" = schéma SVG (fond propre, pas de recadrage ni de fond noir). */
  type: "image" | "video" | "diagram";
  /** Chemin sous public/, ex. "/media/mon-projet/photo.png" */
  src: string;
  /** Texte alternatif (image) ou titre (vidéo), pour l'accessibilité. */
  alt: string;
  /** Légende affichée sous le média. */
  caption?: string;
  /**
   * Place ce média dans le fil de lecture juste après le paragraphe `details[i]`
   * (index 0-based). Omis = affiché avant le premier paragraphe (visuel d'intro).
   * Les vidéos sont lues automatiquement en boucle, sans son ni contrôles,
   * comme une illustration animée insérée dans le texte.
   */
  afterParagraph?: number;
}

/** Type de projet — sert au badge sur les cartes et au filtre de la page Projets. */
export type ProjectCategory = "perso" | "ecole" | "recherche";

export const CATEGORIES: Record<ProjectCategory, { label: string; short: string }> = {
  perso: { label: "Projet personnel", short: "Perso" },
  ecole: { label: "Projet école", short: "École" },
  recherche: { label: "Projet de recherche", short: "Recherche" },
};

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  status: "En cours" | "Terminé" | "En pause";
  period: string;
  stack: string[];
  summary: string;
  details: string[];
  highlights?: string[];
  links?: { label: string; url: string }[];
  /** Images, vidéos ou courbes illustrant le projet. */
  media?: ProjectMedia[];
  /** Teinte HSL (H S% L%) utilisée pour l'accent visuel de la carte projet. */
  accent: string;
  placeholder?: boolean;
}

export const projects: Project[] = [
  {
    slug: "segmentation-defauts-ct",
    title: "Segmentation 3D de défauts en tomographie industrielle",
    tagline:
      "Combien de données réelles faut-il pour détecter automatiquement des défauts internes ? Une étude menée de la fabrication des pièces jusqu'au modèle entraîné.",
    category: "recherche",
    status: "Terminé",
    period: "Avril – Août 2026",
    stack: ["Python", "PyTorch", "MONAI", "Swin-UNETR", "trimesh", "3D Slicer"],
    summary:
      "Stage de recherche de quatre mois à l'University of Bradford (laboratoire Smart Manufacturing) : concevoir et évaluer une chaîne complète de segmentation automatique de défauts internes en tomographie à rayons X, en cherchant à contourner l'obstacle central du domaine — la rareté des volumes industriels annotés.",
    details: [
      "Le contrôle non destructif par tomographie permet de détecter porosités, fissures et inclusions sans abîmer la pièce, mais automatiser cette inspection par apprentissage profond se heurte à un mur : chaque scan représente plusieurs milliards de voxels, les défauts sont rares et irréguliers, et l'annotation manuelle par un expert est lente, subjective et impossible à passer à l'échelle. La question du stage était donc économique autant que scientifique : combien de données réelles faut-il réellement, et que valent les sources de substitution ?",
      "Premier levier : fabriquer la donnée plutôt que l'annoter. J'ai écrit un générateur paramétrique de pièces de test en Python (trimesh, opérations booléennes de maillages) creusant des défauts internes délibérés — sphères, ellipsoïdes, blobs, fissures fines, amas de pores — dans des corps simples imprimés ensuite à 100 % de remplissage, puis scannés au tomographe du laboratoire. La pièce étant nominalement pleine, tout vide interne est par construction un défaut : la vérité terrain se dérive alors du scan par simple seuillage d'intensité, sans recalage CAO ni intervention manuelle.",
      "Second levier : le transfert d'apprentissage depuis l'imagerie médicale, qui dispose de jeux publics abondants. J'ai calibré la chaîne de segmentation (architecture Swin-UNETR, PyTorch et MONAI) sur des volumes CT thoraciques publics, en portant le Dice de 0,33 à 0,53 par six améliorations méthodologiques validées séparément — entropie croisée pondérée, augmentation spatiale et d'intensité, planification du taux d'apprentissage au dégel de l'encodeur, échantillonnage équilibré des patchs, terme focal.",
      "Le cœur de l'étude compare trois initialisations du même réseau, à protocole strictement identique : poids aléatoires, pré-entraînement auto-supervisé, et auto-supervisé complété d'un affinage médical. En ré-entraînant chacune sur des sous-ensembles emboîtés de 5 à 63 pièces avec plusieurs graines aléatoires, on obtient une courbe d'efficacité en données qui montre que le pré-entraînement accélère systématiquement la convergence, mais n'améliore la précision finale qu'au-delà d'une vingtaine de pièces — en deçà, il peut même être contre-productif.",
      "La validation finale porte sur des pièces industrielles réelles à défauts d'usinage authentiques, scannées et corrigées à la main sous 3D Slicer, évaluées en validation croisée leave-one-out. C'est là que se joue le résultat le plus utile pour l'industrie, et il est net : quelques pièces réelles du domaine cible valent mieux qu'un volume bien supérieur de données fabriquées, aussi soigneusement construites soient-elles.",
      "Au-delà des résultats, ce stage a été une leçon de méthode. Deux bugs découverts en cours d'étude auraient chacun pu fausser silencieusement les conclusions : un mécanisme de reprise après plantage qui avantageait mécaniquement l'initialisation aléatoire, et un chargeur de poids trop permissif qui rejetait en silence tout un point de contrôle pré-entraîné tout en affichant un message de succès. Depuis, je ne considère plus qu'un composant fonctionne parce qu'il l'affirme : comptage explicite des tenseurs chargés, échec bruyant plutôt que dégradation silencieuse.",
    ],
    highlights: [
      "Chaîne complète menée seul : conception paramétrique, impression 3D, acquisition tomographique, annotation automatique, entraînement, validation statistique",
      "90 pièces annotées sans aucune annotation manuelle grâce au pipeline de génération de vérité terrain",
      "Comparaison contrôlée de trois stratégies d'initialisation, étayée par graines multiples et tests de Wilcoxon appariés",
      "Article de recherche de 13 pages rédigé en anglais, en cours d'évaluation",
    ],
    media: [
      {
        type: "diagram",
        src: "/media/segmentation-defauts-ct/schema-1-pipeline-donnees.svg",
        alt: "Schéma de la chaîne de génération automatique des données annotées",
        caption:
          "La chaîne de fabrication de la donnée : le générateur paramétrique dessine les défauts, l'impression 3D pleine garantit qu'aucun autre vide n'existe, et le seuillage du scan transforme cette garantie physique en annotation gratuite.",
        afterParagraph: 1,
      },
      {
        type: "diagram",
        src: "/media/segmentation-defauts-ct/schema-2-trois-domaines.svg",
        alt: "Schéma des trois domaines d'images et des résultats principaux de l'étude",
        caption:
          "Les trois jeux de données du projet et ce qu'ils ont appris : le domaine fabriqué sur mesure s'est révélé plus atypique que le domaine médical, et une poignée de pièces réelles a battu neuf fois plus de pièces imprimées.",
        afterParagraph: 4,
      },
    ],
    accent: "158 62% 42%",
    placeholder: false,
  },
  {
    slug: "scanner-tomographie-optique",
    title: "Scanner de tomographie optique DIY",
    tagline:
      "Un scanner 3D par tomographie optique : mécanique, firmware et reconstruction, de bout en bout.",
    category: "perso",
    status: "En cours",
    period: "Depuis août 2026",
    stack: ["Jetson Orin Nano", "STM32 (Nucleo-L476RG)", "Python", "scikit-image", "C"],
    summary:
      "Conception d'un scanner de tomographie optique fait maison : un échantillon tourne sur un plateau motorisé pendant qu'une caméra capture des images sous plusieurs angles, reconstruites ensuite en un volume 3D.",
    details: [
      "L'acquisition repose sur une Jetson Orin Nano Super (JetPack 6.2.3) couplée à une caméra Arducam IMX477 sur port CSI, et sur une carte NUCLEO-L476RG qui pilote un moteur pas-à-pas NEMA17 via un driver DRV8825 pour faire tourner l'échantillon avec précision (200 pas par tour).",
      "Le pipeline logiciel visé enchaîne acquisition synchronisée (rotation + capture), prétraitement des images (niveaux de gris, flat-field), extraction des profils de projection, construction du sinogramme, puis reconstruction tomographique avec scikit-image (iradon) pour empiler les tranches en un volume 3D.",
      "Le projet a aussi été l'occasion de déboguer des problèmes matériels concrets : un overlay device-tree spécifique nécessaire pour faire fonctionner correctement la caméra IMX477 sur le Jetson, et un faux contact d'alimentation qui simulait une panne moteur.",
    ],
    highlights: [
      "Intégration d'une caméra CSI sur Jetson (device tree, overlays)",
      "Pilotage moteur pas-à-pas synchronisé avec l'acquisition",
      "Pipeline de reconstruction tomographique en Python",
    ],
    media: [
      {
        type: "image",
        src: "/media/tomographe/calibrage-banc.png",
        alt: "Interface de calibration de l'exposition de la caméra IMX477",
        caption:
          "Outil maison de calibration de l'exposition de la caméra IMX477 : recherche automatique du temps d'exposition maximal sans pixel saturé.",
      },
      {
        type: "video",
        src: "/media/tomographe/demo-rotation.mp4",
        alt: "Démonstration du plateau motorisé en rotation",
        caption: "Rotation du plateau motorisé (NEMA17 + DRV8825) pendant l'acquisition.",
        afterParagraph: 0,
      },
    ],
    accent: "190 85% 45%",
    placeholder: false,
  },
  {
    slug: "transformer-cpp",
    title: "TransformerCpp",
    tagline:
      "Un Transformer encodeur-décodeur (traduction anglais → français) écrit intégralement à la main en C++17, entraîné sur GPU via un backend CUDA maison.",
    category: "perso",
    status: "Terminé",
    period: "Mai – Juin 2026",
    stack: ["C++17", "CUDA", "cuBLAS", "CMake", "doctest"],
    summary:
      "Implémentation from scratch de l'architecture Transformer (« Attention Is All You Need ») pour la traduction anglais → français : toute l'algèbre, les couches, la rétropropagation, l'optimiseur Adam, le tokenizer et le backend GPU sont écrits à la main, sans bibliothèque de deep learning.",
    details: [
      "Le cœur du projet est une implémentation CPU de référence où chaque couche (attention, multi-têtes, feed-forward, layer norm, embeddings, blocs encodeur/décodeur) expose un forward et un backward dérivés et codés à la main, validés par gradient checking.",
      "Un backend CUDA device-resident reproduit exactement les mêmes calculs mais fait vivre et entraîner le modèle entièrement sur le GPU (cuBLAS pour les produits matriciels, kernels maison pour softmax, layer norm et embedding scatter), chaque couche GPU étant validée par un test d'équivalence contre son homologue CPU. Le passage à un batching bloc-diagonal sur GPU a fait passer le débit d'entraînement d'environ 30 à 900 exemples par seconde.",
      "Le projet inclut aussi un tokenizer BPE byte-level, un pipeline de données (corpus parallèle, teacher forcing, batching, padding), le checkpointing binaire des poids compatible CPU/GPU, la génération auto-régressive (glouton puis beam search), et une suite de tests exhaustive : 140 cas et environ 9000 assertions.",
      "Pour piloter les entraînements et tester le modèle sans ligne de commande, une application compagnon (TrainerApp) a été développée par-dessus la bibliothèque : une interface graphique en C++17/ImGui avec des onglets Modèles, Configuration, Entraînement et Inférence. L'onglet Entraînement affiche en direct la perte train/validation, le score BLEU-4 et les traductions générées à chaque epoch, aux côtés de la mémoire et de l'utilisation GPU. Elle a depuis été étendue pour piloter également le CNN du projet ConvNetwork, devenant une petite plateforme d'entraînement multi-modèles.",
    ],
    highlights: [
      "Rétropropagation dérivée et codée à la main pour chaque couche, vérifiée par gradient checking",
      "Backend CUDA device-resident (cuBLAS, kernels custom) validé couche par couche contre le CPU",
      "Tokenizer BPE, pipeline de données et checkpointing binaire CPU/GPU écrits from scratch",
      "Interface graphique compagnon (TrainerApp, ImGui) : suivi live de l'entraînement (perte, BLEU-4) et inférence interactive",
    ],
    media: [
      {
        type: "diagram",
        src: "/media/transformer-cpp/schema-2-anatomie-bloc.svg",
        alt: "Schéma de l'anatomie d'un bloc encodeur et d'un bloc décodeur",
        caption:
          "Anatomie d'un bloc : self-attention puis feed-forward, chacun suivi d'un dropout, d'une connexion résiduelle et d'une LayerNorm. Le décodeur insère en plus une attention croisée dont les clés et valeurs proviennent de la sortie de l'encodeur.",
        afterParagraph: 0,
      },
      {
        type: "diagram",
        src: "/media/transformer-cpp/schema-3-deux-backends.svg",
        alt: "Schéma comparant l'implémentation CPU et son miroir GPU",
        caption:
          "Deux implémentations, une seule logique : chaque couche CPU (Matrix, boucles explicites) a son miroir GPU (GpuMatrix, cuBLAS, kernels CUDA) construit avec les mêmes poids. Un test d'équivalence compare leurs sorties couche par couche, et un format de checkpoint binaire identique rend les deux backends interchangeables.",
        afterParagraph: 1,
      },
      {
        type: "diagram",
        src: "/media/transformer-cpp/schema-1-trajet-batch.svg",
        alt: "Schéma du trajet d'un batch, du corpus texte jusqu'à la mise à jour des poids sur GPU",
        caption:
          "Le trajet complet d'un batch : le corpus est tokenisé et regroupé en batches triés par longueur côté hôte, puis seuls les identifiants de tokens partent sur le GPU. Une région capturée en CUDA Graph y enchaîne encodeur, décodeur, perte et rétropropagation sans repasser par l'hôte, avant la mise à jour Adam — le mécanisme derrière le gain de débit ×30.",
        afterParagraph: 2,
      },
      {
        type: "image",
        src: "/media/transformer-cpp/trainerapp-entrainement.png",
        alt: "Onglet Entraînement de TrainerApp montrant les courbes de perte et le score BLEU en direct",
        caption:
          "TrainerApp — onglet Entraînement : perte train/val, score BLEU-4 (35 % à l'epoch 31) et traductions générées en direct.",
        afterParagraph: 3,
      },
      {
        type: "image",
        src: "/media/transformer-cpp/trainerapp-inference.png",
        alt: "Onglet Inférence de TrainerApp montrant des traductions anglais vers français",
        caption:
          "TrainerApp — onglet Inférence : traductions générées par le modèle et historique des requêtes.",
        afterParagraph: 3,
      },
      {
        type: "diagram",
        src: "/media/transformer-cpp/schema-4-trainerapp.svg",
        alt: "Schéma de l'architecture de TrainerApp au-dessus de transformer_lib",
        caption:
          "TrainerApp pilote transformer_lib dans le même processus pour trois usages : entraînement (batches → passe graphée → Adam), évaluation (BLEU) et inférence (beam search). La bibliothèque s'appuie sur la VRAM (DevicePool, CUDA Graphs, cuBLAS) et sur des checkpoints disque, et renvoie les métriques qui alimentent les courbes de l'interface.",
        afterParagraph: 3,
      },
    ],
    links: [{ label: "Code source", url: "https://github.com/FauconEspion61/TransformerCpp" }],
    accent: "265 80% 60%",
    placeholder: false,
  },
  {
    slug: "convnetwork",
    title: "ConvNetwork",
    tagline:
      "Un réseau de neurones convolutif écrit intégralement à la main en C++, entraîné sur MNIST jusqu'à 97,4 % de précision — sans aucune bibliothèque de deep learning.",
    category: "perso",
    status: "Terminé",
    period: "Juillet – Septembre 2026",
    stack: ["C++17", "CMake", "doctest", "MNIST"],
    summary:
      "Implémentation manuelle d'un CNN complet en C++ — convolution, max pooling, couches denses, rétropropagation et optimiseur Adam — dans la même démarche que TransformerCpp : comprendre chaque opération en l'écrivant et en la testant soi-même plutôt qu'en s'appuyant sur une bibliothèque existante.",
    details: [
      "Le projet part d'une classe Matrix maison (allocation brute, règle des cinq, initialisation He) et construit dessus les couches d'un CNN classique : convolution 2D multi-canaux à padding « same », max pooling 2×2, couches entièrement connectées. Elles s'assemblent en blocs réutilisables (Conv2D → MaxPooling → ReLU) puis en réseau complet, terminé par un flatten, une couche dense et un softmax fusionné à la cross-entropy pour un gradient numériquement stable.",
      "La partie la plus exigeante est la passe arrière, dérivée et codée à la main pour chaque couche : gradient de la convolution par rapport aux filtres et à l'entrée, et routage du gradient du max pooling vers la seule position qui a gagné le maximum au forward. Un optimiseur Adam maison (moments d'ordre 1 et 2, correction de biais) est branché sur les couches Conv2D et Dense. Le tout est validé par un test de sur-apprentissage volontaire : le réseau doit faire chuter la perte sur un exemple unique répété — si la rétropropagation est fausse quelque part, ce test échoue immédiatement.",
      "Sur MNIST, l'architecture retenue reste volontairement simple — un bloc convolutif de 8 filtres 3×3, un pooling qui ramène l'image à 14×14×8, puis une couche dense vers les 10 classes — et atteint 97,4 % de précision sur le jeu de test après une seule epoch d'entraînement, avec Adam à un taux d'apprentissage de 0,001. L'ensemble tourne sur CPU, une image à la fois, à environ 1 200 exemples par seconde.",
      "Le réseau a ensuite été branché dans TrainerApp, l'interface graphique développée pour TransformerCpp : celle-ci est devenue une petite plateforme d'entraînement multi-modèles, capable de piloter indifféremment le Transformer CUDA et ce CNN CPU via un adaptateur dédié, avec le même suivi en direct des courbes de perte et de précision.",
      "Ce suivi rend d'ailleurs très lisible la principale limite du modèle : sur un entraînement long, la perte d'entraînement s'effondre vers 0,001 tandis que la perte de test remonte franchement à partir de la troisième epoch, et la précision plafonne autour de 96 %. C'est un cas d'école de sur-apprentissage, attendu pour un réseau sans régularisation ni augmentation de données — les leviers évidents pour aller plus loin étant le batching, le dropout, et un portage GPU dans la lignée de TransformerCpp.",
    ],
    highlights: [
      "Convolution, max pooling et couches denses codées à la main en C++, forward et backward compris",
      "Optimiseur Adam maison, validé par un test de sur-apprentissage sur un exemple unique",
      "97,4 % de précision sur MNIST après une seule epoch, sans aucune bibliothèque de deep learning",
      "Intégré comme second modèle de TrainerApp, aux côtés de TransformerCpp",
    ],
    media: [
      {
        type: "image",
        src: "/media/convnetwork/trainerapp-cnn-entrainement.png",
        alt: "Entraînement du CNN suivi dans TrainerApp : courbes de perte et de précision",
        caption:
          "Entraînement du CNN suivi dans TrainerApp. La divergence est nette : la perte d'entraînement (verte) tend vers zéro pendant que la perte de test (orange) remonte dès la troisième epoch — le sur-apprentissage se lit directement sur la courbe.",
        afterParagraph: 4,
      },
    ],
    links: [{ label: "Code source", url: "https://github.com/FauconEspion61/ConvNetwork" }],
    accent: "25 90% 55%",
    placeholder: false,
  },

  // ==========================================================================
  // MODÈLE — duplique ce bloc pour chaque projet école (retire les commentaires).
  // Le champ `category: "ecole"` suffit à le faire apparaître dans le filtre
  // "École" de la page Projets et à afficher le badge correspondant.
  // ==========================================================================
  // {
  //   slug: "mon-projet-ecole",              // devient l'URL /projets/mon-projet-ecole
  //   title: "Titre du projet",
  //   tagline: "Une phrase qui résume le projet et son résultat.",
  //   category: "ecole",                      // "perso" | "ecole" | "recherche"
  //   status: "Terminé",                      // "En cours" | "Terminé" | "En pause"
  //   period: "Mois AAAA – Mois AAAA",
  //   stack: ["Techno 1", "Techno 2"],
  //   summary: "2-3 phrases : le contexte (cours, projet de groupe), le problème, l'approche.",
  //   details: [
  //     "Paragraphe 1 : contexte et objectif.",
  //     "Paragraphe 2 : ce que tu as personnellement réalisé (important si projet de groupe).",
  //     "Paragraphe 3 : résultats, note obtenue, difficultés surmontées.",
  //   ],
  //   highlights: ["Point fort 1", "Point fort 2"],
  //   links: [{ label: "Code source", url: "https://github.com/..." }],
  //   accent: "150 70% 42%",                  // teinte HSL de la carte
  // },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Catégories réellement utilisées par au moins un projet, dans l'ordre d'affichage. */
export function usedCategories(): ProjectCategory[] {
  const order: ProjectCategory[] = ["perso", "ecole", "recherche"];
  return order.filter((c) => projects.some((p) => p.category === c));
}
