import type { Lang, Localized, LocalizedList } from "../i18n";

/**
 * Un média illustrant un projet.
 *
 * Union discriminée volontaire : un schéma SVG a son texte gravé à l'intérieur,
 * il lui faut donc un fichier par langue. Une photo ou une vidéo, non — un seul
 * fichier sert aux deux. Le typage rend l'oubli d'un schéma anglais impossible.
 */
export type ProjectMedia =
  | {
      type: "image" | "video";
      /** Chemin sous public/, ex. "/media/mon-projet/photo.png" */
      src: string;
      alt: Localized;
      caption?: Localized;
      afterParagraph?: number;
    }
  | {
      type: "diagram";
      /** Un SVG par langue : le texte du schéma doit être traduit lui aussi. */
      src: Localized;
      alt: Localized;
      caption?: Localized;
      afterParagraph?: number;
    };

/** Type de projet — sert au badge sur les cartes et au filtre de la page Projets. */
export type ProjectCategory = "perso" | "ecole" | "recherche";

export const CATEGORIES: Record<ProjectCategory, { label: Localized; short: Localized }> = {
  perso: {
    label: { fr: "Projet personnel", en: "Personal project" },
    short: { fr: "Perso", en: "Personal" },
  },
  ecole: {
    label: { fr: "Projet école", en: "Coursework project" },
    short: { fr: "École", en: "Coursework" },
  },
  recherche: {
    label: { fr: "Projet de recherche", en: "Research project" },
    short: { fr: "Recherche", en: "Research" },
  },
};

/**
 * Statut du projet. C'est une clé neutre et non du texte affichable : elle sert
 * aussi de sélecteur CSS, qui casserait si on y mettait la traduction.
 */
export type ProjectStatus = "ongoing" | "done" | "paused";

export const STATUS_LABELS: Record<ProjectStatus, Localized> = {
  ongoing: { fr: "En cours", en: "Ongoing" },
  done: { fr: "Terminé", en: "Completed" },
  paused: { fr: "En pause", en: "On hold" },
};

export interface Project {
  slug: string;
  title: Localized;
  tagline: Localized;
  category: ProjectCategory;
  status: ProjectStatus;
  period: Localized;
  /** Noms de technos : identiques dans les deux langues, donc non traduits. */
  stack: string[];
  summary: Localized;
  details: LocalizedList;
  highlights?: LocalizedList;
  links?: { label: Localized; url: string }[];
  media?: ProjectMedia[];
  /** Teinte HSL (H S% L%) utilisée pour l'accent visuel de la carte projet. */
  accent: string;
  placeholder?: boolean;
}

export const projects: Project[] = [
  {
    slug: "segmentation-defauts-ct",
    title: {
      fr: "Segmentation 3D de défauts en tomographie industrielle",
      en: "3D defect segmentation in industrial CT",
    },
    tagline: {
      fr: "Combien de données réelles faut-il pour détecter automatiquement des défauts internes ? Une étude menée de la fabrication des pièces jusqu'au modèle entraîné.",
      en: "How much real data does it take to detect internal defects automatically? A study run from manufacturing the parts all the way to the trained model.",
    },
    category: "recherche",
    status: "done",
    period: { fr: "Avril – Août 2026", en: "April – August 2026" },
    stack: ["Python", "PyTorch", "MONAI", "Swin-UNETR", "trimesh", "3D Slicer"],
    summary: {
      fr: "Stage de recherche de quatre mois à l'University of Bradford (laboratoire Smart Manufacturing) : concevoir et évaluer une chaîne complète de segmentation automatique de défauts internes en tomographie à rayons X, en cherchant à contourner l'obstacle central du domaine — la rareté des volumes industriels annotés.",
      en: "A four-month research internship at the University of Bradford (Smart Manufacturing lab): design and evaluate a complete pipeline for segmenting internal defects in X-ray computed tomography automatically, while working around the field's central obstacle — the scarcity of annotated industrial volumes.",
    },
    details: {
      fr: [
        "Le contrôle non destructif par tomographie permet de détecter porosités, fissures et inclusions sans abîmer la pièce, mais automatiser cette inspection par apprentissage profond se heurte à un mur : chaque scan représente plusieurs milliards de voxels, les défauts sont rares et irréguliers, et l'annotation manuelle par un expert est lente, subjective et impossible à passer à l'échelle. La question du stage était donc économique autant que scientifique : combien de données réelles faut-il réellement, et que valent les sources de substitution ?",
        "Premier levier : fabriquer la donnée plutôt que l'annoter. J'ai écrit un générateur paramétrique de pièces de test en Python (trimesh, opérations booléennes de maillages) creusant des défauts internes délibérés — sphères, ellipsoïdes, blobs, fissures fines, amas de pores — dans des corps simples imprimés ensuite à 100 % de remplissage, puis scannés au tomographe du laboratoire. La pièce étant nominalement pleine, tout vide interne est par construction un défaut : la vérité terrain se dérive alors du scan par simple seuillage d'intensité, sans recalage CAO ni intervention manuelle.",
        "Second levier : le transfert d'apprentissage depuis l'imagerie médicale, qui dispose de jeux publics abondants. J'ai calibré la chaîne de segmentation (architecture Swin-UNETR, PyTorch et MONAI) sur des volumes CT thoraciques publics, en portant le Dice de 0,33 à 0,53 par six améliorations méthodologiques validées séparément — entropie croisée pondérée, augmentation spatiale et d'intensité, planification du taux d'apprentissage au dégel de l'encodeur, échantillonnage équilibré des patchs, terme focal.",
        "Le cœur de l'étude compare trois initialisations du même réseau, à protocole strictement identique : poids aléatoires, pré-entraînement auto-supervisé, et auto-supervisé complété d'un affinage médical. En ré-entraînant chacune sur des sous-ensembles emboîtés de 5 à 63 pièces avec plusieurs graines aléatoires, on obtient une courbe d'efficacité en données qui montre que le pré-entraînement accélère systématiquement la convergence, mais n'améliore la précision finale qu'au-delà d'une vingtaine de pièces — en deçà, il peut même être contre-productif.",
        "La validation finale porte sur des pièces industrielles réelles à défauts d'usinage authentiques, scannées et corrigées à la main sous 3D Slicer, évaluées en validation croisée leave-one-out. C'est là que se joue le résultat le plus utile pour l'industrie, et il est net : quelques pièces réelles du domaine cible valent mieux qu'un volume bien supérieur de données fabriquées, aussi soigneusement construites soient-elles.",
        "Au-delà des résultats, ce stage a été une leçon de méthode. Deux bugs découverts en cours d'étude auraient chacun pu fausser silencieusement les conclusions : un mécanisme de reprise après plantage qui avantageait mécaniquement l'initialisation aléatoire, et un chargeur de poids trop permissif qui rejetait en silence tout un point de contrôle pré-entraîné tout en affichant un message de succès. Depuis, je ne considère plus qu'un composant fonctionne parce qu'il l'affirme : comptage explicite des tenseurs chargés, échec bruyant plutôt que dégradation silencieuse.",
      ],
      en: [
        "Non-destructive testing by computed tomography reveals porosity, cracks and inclusions without damaging the part, but automating that inspection with deep learning runs into a wall: each scan is several billion voxels, defects are rare and irregular, and manual annotation by an expert is slow, subjective and impossible to scale. The internship's question was therefore as much economic as scientific: how much real data do you actually need, and what are surrogate sources worth?",
        "First lever: manufacture the data rather than annotate it. I wrote a parametric generator of test parts in Python (trimesh, mesh boolean operations) that carves deliberate internal defects — spheres, ellipsoids, blobs, thin cracks, clusters of pores — into simple bodies, printed at 100 % infill and then scanned on the lab's CT system. Since the part is nominally solid, every internal void is by construction a defect: ground truth then follows from the scan by simple intensity thresholding, with no CAD registration and no manual work.",
        "Second lever: transfer learning from medical imaging, where large public datasets exist. I calibrated the segmentation pipeline (Swin-UNETR architecture, PyTorch and MONAI) on public chest CT volumes, raising Dice from 0.33 to 0.53 through six methodological improvements validated one at a time — class-weighted cross-entropy, spatial and intensity augmentation, learning-rate scheduling at encoder unfreezing, balanced patch sampling, and a focal term.",
        "The core of the study compares three initialisations of the same network under a strictly identical protocol: random weights, self-supervised pre-training, and self-supervised pre-training followed by medical fine-tuning. Retraining each on nested subsets of 5 to 63 parts with several random seeds yields a data-efficiency curve showing that pre-training consistently speeds up convergence, but only improves final accuracy beyond roughly twenty parts — below that, it can even be counter-productive.",
        "Final validation used real industrial parts with genuine machining defects, scanned and hand-corrected in 3D Slicer, evaluated under leave-one-out cross-validation. This is where the result most useful to industry emerges, and it is unambiguous: a handful of real parts from the target domain beats a far larger volume of manufactured data, however carefully that data is built.",
        "Beyond the results, this internship was a lesson in method. Two bugs found mid-study could each have silently skewed the conclusions: a crash-resume mechanism that mechanically favoured random initialisation, and an over-permissive weight loader that silently discarded an entire pre-trained checkpoint while reporting success. Since then I no longer assume a component works because it says so: explicit counting of loaded tensors, and loud failure rather than silent degradation.",
      ],
    },
    highlights: {
      fr: [
        "Chaîne complète menée seul : conception paramétrique, impression 3D, acquisition tomographique, annotation automatique, entraînement, validation statistique",
        "90 pièces annotées sans aucune annotation manuelle grâce au pipeline de génération de vérité terrain",
        "Comparaison contrôlée de trois stratégies d'initialisation, étayée par graines multiples et tests de Wilcoxon appariés",
        "Article de recherche de 13 pages rédigé en anglais, en cours d'évaluation",
      ],
      en: [
        "Full chain run single-handed: parametric design, 3D printing, CT acquisition, automatic annotation, training, statistical validation",
        "90 parts annotated with zero manual labelling, thanks to the ground-truth generation pipeline",
        "Controlled comparison of three initialisation strategies, backed by multiple seeds and paired Wilcoxon tests",
        "13-page research paper written in English, currently under review",
      ],
    },
    media: [
      {
        type: "diagram",
        src: {
          fr: "/media/segmentation-defauts-ct/schema-1-pipeline-donnees.svg",
          en: "/media/segmentation-defauts-ct/en/schema-1-pipeline-donnees.svg",
        },
        alt: {
          fr: "Schéma de la chaîne de génération automatique des données annotées",
          en: "Diagram of the automatic annotated-data generation chain",
        },
        caption: {
          fr: "La chaîne de fabrication de la donnée : le générateur paramétrique dessine les défauts, l'impression 3D pleine garantit qu'aucun autre vide n'existe, et le seuillage du scan transforme cette garantie physique en annotation gratuite.",
          en: "The data manufacturing chain: the parametric generator draws the defects, printing solid guarantees no other void exists, and thresholding the scan turns that physical guarantee into free annotation.",
        },
        afterParagraph: 1,
      },
      {
        type: "diagram",
        src: {
          fr: "/media/segmentation-defauts-ct/schema-2-trois-domaines.svg",
          en: "/media/segmentation-defauts-ct/en/schema-2-trois-domaines.svg",
        },
        alt: {
          fr: "Schéma des trois domaines d'images et des résultats principaux de l'étude",
          en: "Diagram of the three imaging domains and the study's headline results",
        },
        caption: {
          fr: "Les trois jeux de données du projet et ce qu'ils ont appris : le domaine fabriqué sur mesure s'est révélé plus atypique que le domaine médical, et une poignée de pièces réelles a battu neuf fois plus de pièces imprimées.",
          en: "The project's three datasets and what they taught: the purpose-built domain turned out to be more atypical than the medical one, and a handful of real parts beat nine times as many printed ones.",
        },
        afterParagraph: 4,
      },
    ],
    accent: "158 62% 42%",
    placeholder: false,
  },
  {
    slug: "scanner-tomographie-optique",
    title: {
      fr: "Scanner de tomographie optique DIY",
      en: "DIY optical tomography scanner",
    },
    tagline: {
      fr: "Un scanner 3D par tomographie optique : mécanique, firmware et reconstruction, de bout en bout.",
      en: "A 3D optical tomography scanner: mechanics, firmware and reconstruction, end to end.",
    },
    category: "perso",
    status: "paused",
    period: { fr: "Depuis août 2026", en: "Since August 2026" },
    stack: ["Jetson Orin Nano", "STM32 (Nucleo-L476RG)", "Python", "scikit-image", "C"],
    summary: {
      fr: "Conception d'un scanner de tomographie optique fait maison : un échantillon tourne sur un plateau motorisé pendant qu'une caméra capture des images sous plusieurs angles, reconstruites ensuite en un volume 3D.",
      en: "Building a home-made optical tomography scanner: a sample rotates on a motorised turntable while a camera captures images from many angles, later reconstructed into a 3D volume.",
    },
    details: {
      fr: [
        "L'acquisition repose sur une Jetson Orin Nano Super (JetPack 6.2.3) couplée à une caméra Arducam IMX477 sur port CSI, et sur une carte NUCLEO-L476RG qui pilote un moteur pas-à-pas NEMA17 via un driver DRV8825 pour faire tourner l'échantillon avec précision (200 pas par tour).",
        "Le pipeline logiciel visé enchaîne acquisition synchronisée (rotation + capture), prétraitement des images (niveaux de gris, flat-field), extraction des profils de projection, construction du sinogramme, puis reconstruction tomographique avec scikit-image (iradon) pour empiler les tranches en un volume 3D.",
        "Le projet a aussi été l'occasion de déboguer des problèmes matériels concrets : un overlay device-tree spécifique nécessaire pour faire fonctionner correctement la caméra IMX477 sur le Jetson, et un faux contact d'alimentation qui simulait une panne moteur.",
        "Le projet est aujourd'hui en pause, bloqué sur la rotation. Le moteur tourne, mais pas de façon reproductible : en mode pleine pas, le NEMA17 entre dans sa bande de résonance à certaines cadences de commande, le rotor se met à osciller au lieu d'avancer proprement et perd le synchronisme — il rate des pas sans qu'aucune erreur ne remonte. Un seul essai vraiment propre, un tour complet continu, a été obtenu à environ 250 pas par seconde ; en descendant à 125 pas par seconde, le phénomène réapparaît systématiquement.",
        "C'est bloquant pour ce projet précis, car la tomographie exige de connaître l'angle exact de chaque image : un pas perdu fausse toute la reconstruction, et rien dans le montage actuel ne permet de détecter la perte. Les pistes à explorer sont classiques mais demandent du temps de banc — repasser en micro-pas pour lisser le couple et sortir de la bande de résonance, ajuster la limite de courant du DRV8825, ajouter une rampe d'accélération plutôt que de démarrer à pleine cadence, et surtout instrumenter la rotation avec un capteur de position pour vérifier l'angle réel au lieu de le supposer.",
      ],
      en: [
        "Acquisition runs on a Jetson Orin Nano Super (JetPack 6.2.3) paired with an Arducam IMX477 camera on the CSI port, alongside a NUCLEO-L476RG board driving a NEMA17 stepper motor through a DRV8825 to rotate the sample precisely (200 steps per revolution).",
        "The intended software pipeline chains synchronised acquisition (rotation plus capture), image pre-processing (greyscale, flat-field), extraction of projection profiles, sinogram construction, then tomographic reconstruction with scikit-image (iradon) to stack the slices into a 3D volume.",
        "The project was also a chance to debug very concrete hardware problems: a specific device-tree overlay required to get the IMX477 camera working properly on the Jetson, and a loose power connection that mimicked a dead motor.",
        "The project is currently on hold, blocked on rotation. The motor turns, but not reproducibly: in full-step mode the NEMA17 enters its resonance band at certain command rates, the rotor starts oscillating instead of advancing cleanly and loses synchronism — it drops steps without raising any error. Only one genuinely clean run, a continuous full revolution, was ever obtained, at roughly 250 steps per second; dropping to 125 steps per second brings the problem back every time.",
        "That is blocking for this particular project, because tomography requires knowing the exact angle of every image: a single lost step corrupts the whole reconstruction, and nothing in the current setup can detect the loss. The avenues to explore are standard but need bench time — switching back to microstepping to smooth the torque and move out of the resonance band, tuning the DRV8825 current limit, adding an acceleration ramp instead of starting at full rate, and above all instrumenting the rotation with a position sensor to measure the real angle rather than assume it.",
      ],
    },
    highlights: {
      fr: [
        "Intégration d'une caméra CSI sur Jetson (device tree, overlays)",
        "Pilotage moteur pas-à-pas synchronisé avec l'acquisition",
        "Pipeline de reconstruction tomographique en Python",
      ],
      en: [
        "CSI camera integration on Jetson (device tree, overlays)",
        "Stepper motor control synchronised with acquisition",
        "Tomographic reconstruction pipeline in Python",
      ],
    },
    media: [
      {
        type: "image",
        src: "/media/tomographe/calibrage-banc.png",
        alt: {
          fr: "Interface de calibration de l'exposition de la caméra IMX477",
          en: "Exposure calibration interface for the IMX477 camera",
        },
        caption: {
          fr: "Outil maison de calibration de l'exposition de la caméra IMX477 : recherche automatique du temps d'exposition maximal sans pixel saturé.",
          en: "Home-made exposure calibration tool for the IMX477 camera: it automatically finds the longest exposure with no saturated pixel.",
        },
      },
      {
        type: "video",
        src: "/media/tomographe/demo-rotation.mp4",
        alt: {
          fr: "Démonstration du plateau motorisé en rotation",
          en: "The motorised turntable rotating",
        },
        caption: {
          fr: "Rotation du plateau motorisé (NEMA17 + DRV8825) pendant l'acquisition.",
          en: "The motorised turntable (NEMA17 + DRV8825) rotating during acquisition.",
        },
        afterParagraph: 0,
      },
      {
        type: "video",
        src: "/media/tomographe/acquisition-silhouette.mp4",
        alt: {
          fr: "Vue de la caméra IMX477 : l'échantillon rétroéclairé apparaît en silhouette",
          en: "IMX477 camera view: the backlit sample appears as a silhouette",
        },
        caption: {
          fr: "Ce que voit la caméra pendant l'acquisition : l'échantillon, rétroéclairé par le panneau rouge, se détache en silhouette nette sur le fond. C'est ce contraste que le pipeline exploite ensuite pour extraire les profils de projection.",
          en: "What the camera sees during acquisition: the sample, backlit by the red panel, stands out as a crisp silhouette. That contrast is exactly what the pipeline then uses to extract projection profiles.",
        },
        afterParagraph: 1,
      },
      {
        type: "video",
        src: "/media/tomographe/banc-vue-ensemble.mp4",
        alt: {
          fr: "Vue d'ensemble du banc : enceinte, plateau, caméra, alimentation et câblage du driver",
          en: "Overview of the bench: enclosure, turntable, camera, power supply and driver wiring",
        },
        caption: {
          fr: "Le banc dans son état actuel : l'enceinte rétroéclairée avec le plateau et la caméra IMX477, puis l'alimentation de laboratoire et le câblage du DRV8825 sur breadboard — la chaîne de puissance au cœur du problème de rotation.",
          en: "The bench as it stands: the backlit enclosure with the turntable and the IMX477 camera, then the lab power supply and the DRV8825 wiring on breadboard — the power chain at the heart of the rotation problem.",
        },
        afterParagraph: 4,
      },
    ],
    accent: "190 85% 45%",
    placeholder: false,
  },
  {
    slug: "transformer-cpp",
    title: { fr: "TransformerCpp", en: "TransformerCpp" },
    tagline: {
      fr: "Un Transformer encodeur-décodeur (traduction anglais → français) écrit intégralement à la main en C++17, entraîné sur GPU via un backend CUDA maison.",
      en: "An encoder-decoder Transformer (English → French translation) written entirely by hand in C++17, trained on GPU through a home-made CUDA backend.",
    },
    category: "perso",
    status: "done",
    period: { fr: "Mai – Juin 2026", en: "May – June 2026" },
    stack: ["C++17", "CUDA", "cuBLAS", "CMake", "doctest"],
    summary: {
      fr: "Implémentation from scratch de l'architecture Transformer (« Attention Is All You Need ») pour la traduction anglais → français : toute l'algèbre, les couches, la rétropropagation, l'optimiseur Adam, le tokenizer et le backend GPU sont écrits à la main, sans bibliothèque de deep learning.",
      en: "A from-scratch implementation of the Transformer architecture (“Attention Is All You Need”) for English → French translation: all the algebra, the layers, backpropagation, the Adam optimiser, the tokenizer and the GPU backend are written by hand, with no deep learning library.",
    },
    details: {
      fr: [
        "Le cœur du projet est une implémentation CPU de référence où chaque couche (attention, multi-têtes, feed-forward, layer norm, embeddings, blocs encodeur/décodeur) expose un forward et un backward dérivés et codés à la main, validés par gradient checking.",
        "Un backend CUDA device-resident reproduit exactement les mêmes calculs mais fait vivre et entraîner le modèle entièrement sur le GPU (cuBLAS pour les produits matriciels, kernels maison pour softmax, layer norm et embedding scatter), chaque couche GPU étant validée par un test d'équivalence contre son homologue CPU. Le passage à un batching bloc-diagonal sur GPU a fait passer le débit d'entraînement d'environ 30 à 900 exemples par seconde.",
        "Le projet inclut aussi un tokenizer BPE byte-level, un pipeline de données (corpus parallèle, teacher forcing, batching, padding), le checkpointing binaire des poids compatible CPU/GPU, la génération auto-régressive (glouton puis beam search), et une suite de tests exhaustive : 140 cas et environ 9000 assertions.",
        "Pour piloter les entraînements et tester le modèle sans ligne de commande, une application compagnon (TrainerApp) a été développée par-dessus la bibliothèque : une interface graphique en C++17/ImGui avec des onglets Modèles, Configuration, Entraînement et Inférence. L'onglet Entraînement affiche en direct la perte train/validation, le score BLEU-4 et les traductions générées à chaque epoch, aux côtés de la mémoire et de l'utilisation GPU. Elle a depuis été étendue pour piloter également le CNN du projet ConvNetwork, devenant une petite plateforme d'entraînement multi-modèles.",
      ],
      en: [
        "At the core sits a reference CPU implementation where every layer (attention, multi-head, feed-forward, layer norm, embeddings, encoder/decoder blocks) exposes a forward and a backward pass derived and coded by hand, validated by gradient checking.",
        "A device-resident CUDA backend reproduces exactly the same computations but keeps the model living and training entirely on the GPU (cuBLAS for matrix products, custom kernels for softmax, layer norm and embedding scatter), with every GPU layer validated by an equivalence test against its CPU counterpart. Moving to block-diagonal batching on the GPU took training throughput from roughly 30 to 900 examples per second.",
        "The project also includes a byte-level BPE tokenizer, a data pipeline (parallel corpus, teacher forcing, batching, padding), binary weight checkpointing interchangeable between CPU and GPU, autoregressive generation (greedy, then beam search), and a thorough test suite: 140 cases and around 9,000 assertions.",
        "To drive training runs and try the model without the command line, a companion application (TrainerApp) was built on top of the library: a C++17/ImGui graphical interface with Models, Configuration, Training and Inference tabs. The Training tab shows training and validation loss live, the BLEU-4 score and the translations generated at each epoch, alongside GPU memory and utilisation. It has since been extended to drive the CNN from the ConvNetwork project too, becoming a small multi-model training platform.",
      ],
    },
    highlights: {
      fr: [
        "Rétropropagation dérivée et codée à la main pour chaque couche, vérifiée par gradient checking",
        "Backend CUDA device-resident (cuBLAS, kernels custom) validé couche par couche contre le CPU",
        "Tokenizer BPE, pipeline de données et checkpointing binaire CPU/GPU écrits from scratch",
        "Interface graphique compagnon (TrainerApp, ImGui) : suivi live de l'entraînement (perte, BLEU-4) et inférence interactive",
      ],
      en: [
        "Backpropagation derived and hand-coded for every layer, verified by gradient checking",
        "Device-resident CUDA backend (cuBLAS, custom kernels) validated layer by layer against the CPU",
        "BPE tokenizer, data pipeline and CPU/GPU binary checkpointing all written from scratch",
        "Companion GUI (TrainerApp, ImGui): live training monitoring (loss, BLEU-4) and interactive inference",
      ],
    },
    media: [
      {
        type: "diagram",
        src: {
          fr: "/media/transformer-cpp/schema-2-anatomie-bloc.svg",
          en: "/media/transformer-cpp/en/schema-2-anatomie-bloc.svg",
        },
        alt: {
          fr: "Schéma de l'anatomie d'un bloc encodeur et d'un bloc décodeur",
          en: "Diagram of the anatomy of an encoder block and a decoder block",
        },
        caption: {
          fr: "Anatomie d'un bloc : self-attention puis feed-forward, chacun suivi d'un dropout, d'une connexion résiduelle et d'une LayerNorm. Le décodeur insère en plus une attention croisée dont les clés et valeurs proviennent de la sortie de l'encodeur.",
          en: "Anatomy of a block: self-attention then feed-forward, each followed by dropout, a residual connection and a LayerNorm. The decoder additionally inserts cross-attention whose keys and values come from the encoder output.",
        },
        afterParagraph: 0,
      },
      {
        type: "diagram",
        src: {
          fr: "/media/transformer-cpp/schema-3-deux-backends.svg",
          en: "/media/transformer-cpp/en/schema-3-deux-backends.svg",
        },
        alt: {
          fr: "Schéma comparant l'implémentation CPU et son miroir GPU",
          en: "Diagram comparing the CPU implementation and its GPU mirror",
        },
        caption: {
          fr: "Deux implémentations, une seule logique : chaque couche CPU (Matrix, boucles explicites) a son miroir GPU (GpuMatrix, cuBLAS, kernels CUDA) construit avec les mêmes poids. Un test d'équivalence compare leurs sorties couche par couche, et un format de checkpoint binaire identique rend les deux backends interchangeables.",
          en: "Two implementations, one logic: every CPU layer (Matrix, explicit loops) has its GPU mirror (GpuMatrix, cuBLAS, CUDA kernels) built from the same weights. An equivalence test compares their outputs layer by layer, and an identical binary checkpoint format makes the two backends interchangeable.",
        },
        afterParagraph: 1,
      },
      {
        type: "diagram",
        src: {
          fr: "/media/transformer-cpp/schema-1-trajet-batch.svg",
          en: "/media/transformer-cpp/en/schema-1-trajet-batch.svg",
        },
        alt: {
          fr: "Schéma du trajet d'un batch, du corpus texte jusqu'à la mise à jour des poids sur GPU",
          en: "Diagram of a batch's journey, from the text corpus to the weight update on GPU",
        },
        caption: {
          fr: "Le trajet complet d'un batch : le corpus est tokenisé et regroupé en batches triés par longueur côté hôte, puis seuls les identifiants de tokens partent sur le GPU. Une région capturée en CUDA Graph y enchaîne encodeur, décodeur, perte et rétropropagation sans repasser par l'hôte, avant la mise à jour Adam — le mécanisme derrière le gain de débit ×30.",
          en: "A batch's complete journey: the corpus is tokenized and grouped into length-sorted batches on the host, then only token ids travel to the GPU. A region captured as a CUDA Graph chains encoder, decoder, loss and backpropagation there without returning to the host, before the Adam update — the mechanism behind the ×30 throughput gain.",
        },
        afterParagraph: 2,
      },
      {
        type: "image",
        src: "/media/transformer-cpp/trainerapp-entrainement.png",
        alt: {
          fr: "Onglet Entraînement de TrainerApp montrant les courbes de perte et le score BLEU en direct",
          en: "TrainerApp's Training tab showing live loss curves and BLEU score",
        },
        caption: {
          fr: "TrainerApp — onglet Entraînement : perte train/val, score BLEU-4 (35 % à l'epoch 31) et traductions générées en direct.",
          en: "TrainerApp — Training tab: train/validation loss, BLEU-4 score (35 % at epoch 31) and translations generated live.",
        },
        afterParagraph: 3,
      },
      {
        type: "image",
        src: "/media/transformer-cpp/trainerapp-inference.png",
        alt: {
          fr: "Onglet Inférence de TrainerApp montrant des traductions anglais vers français",
          en: "TrainerApp's Inference tab showing English to French translations",
        },
        caption: {
          fr: "TrainerApp — onglet Inférence : traductions générées par le modèle et historique des requêtes.",
          en: "TrainerApp — Inference tab: translations produced by the model, with request history.",
        },
        afterParagraph: 3,
      },
      {
        type: "diagram",
        src: {
          fr: "/media/transformer-cpp/schema-4-trainerapp.svg",
          en: "/media/transformer-cpp/en/schema-4-trainerapp.svg",
        },
        alt: {
          fr: "Schéma de l'architecture de TrainerApp au-dessus de transformer_lib",
          en: "Diagram of TrainerApp's architecture on top of transformer_lib",
        },
        caption: {
          fr: "TrainerApp pilote transformer_lib dans le même processus pour trois usages : entraînement (batches → passe graphée → Adam), évaluation (BLEU) et inférence (beam search). La bibliothèque s'appuie sur la VRAM (DevicePool, CUDA Graphs, cuBLAS) et sur des checkpoints disque, et renvoie les métriques qui alimentent les courbes de l'interface.",
          en: "TrainerApp drives transformer_lib in the same process for three uses: training (batches → graphed pass → Adam), evaluation (BLEU) and inference (beam search). The library relies on VRAM (DevicePool, CUDA Graphs, cuBLAS) and on disk checkpoints, and returns the metrics that feed the interface's curves.",
        },
        afterParagraph: 3,
      },
    ],
    links: [
      { label: { fr: "Code source", en: "Source code" }, url: "https://github.com/FauconEspion61/TransformerCpp" },
    ],
    accent: "265 80% 60%",
    placeholder: false,
  },
  {
    slug: "convnetwork",
    title: { fr: "ConvNetwork", en: "ConvNetwork" },
    tagline: {
      fr: "Un réseau de neurones convolutif écrit intégralement à la main en C++, entraîné sur MNIST jusqu'à 97,4 % de précision — sans aucune bibliothèque de deep learning.",
      en: "A convolutional neural network written entirely by hand in C++, trained on MNIST to 97.4 % accuracy — with no deep learning library at all.",
    },
    category: "perso",
    status: "done",
    period: { fr: "Juillet – Septembre 2026", en: "July – September 2026" },
    stack: ["C++17", "CMake", "doctest", "MNIST"],
    summary: {
      fr: "Implémentation manuelle d'un CNN complet en C++ — convolution, max pooling, couches denses, rétropropagation et optimiseur Adam — dans la même démarche que TransformerCpp : comprendre chaque opération en l'écrivant et en la testant soi-même plutôt qu'en s'appuyant sur une bibliothèque existante.",
      en: "A complete CNN implemented by hand in C++ — convolution, max pooling, dense layers, backpropagation and an Adam optimiser — in the same spirit as TransformerCpp: understanding every operation by writing and testing it yourself rather than relying on an existing library.",
    },
    details: {
      fr: [
        "Le projet part d'une classe Matrix maison (allocation brute, règle des cinq, initialisation He) et construit dessus les couches d'un CNN classique : convolution 2D multi-canaux à padding « same », max pooling 2×2, couches entièrement connectées. Elles s'assemblent en blocs réutilisables (Conv2D → MaxPooling → ReLU) puis en réseau complet, terminé par un flatten, une couche dense et un softmax fusionné à la cross-entropy pour un gradient numériquement stable.",
        "La partie la plus exigeante est la passe arrière, dérivée et codée à la main pour chaque couche : gradient de la convolution par rapport aux filtres et à l'entrée, et routage du gradient du max pooling vers la seule position qui a gagné le maximum au forward. Un optimiseur Adam maison (moments d'ordre 1 et 2, correction de biais) est branché sur les couches Conv2D et Dense. Le tout est validé par un test de sur-apprentissage volontaire : le réseau doit faire chuter la perte sur un exemple unique répété — si la rétropropagation est fausse quelque part, ce test échoue immédiatement.",
        "Sur MNIST, l'architecture retenue reste volontairement simple — un bloc convolutif de 8 filtres 3×3, un pooling qui ramène l'image à 14×14×8, puis une couche dense vers les 10 classes — et atteint 97,4 % de précision sur le jeu de test après une seule epoch d'entraînement, avec Adam à un taux d'apprentissage de 0,001. L'ensemble tourne sur CPU, une image à la fois, à environ 1 200 exemples par seconde.",
        "Le réseau a ensuite été branché dans TrainerApp, l'interface graphique développée pour TransformerCpp : celle-ci est devenue une petite plateforme d'entraînement multi-modèles, capable de piloter indifféremment le Transformer CUDA et ce CNN CPU via un adaptateur dédié, avec le même suivi en direct des courbes de perte et de précision.",
        "Ce suivi rend d'ailleurs très lisible la principale limite du modèle : sur un entraînement long, la perte d'entraînement s'effondre vers 0,001 tandis que la perte de test remonte franchement à partir de la troisième epoch, et la précision plafonne autour de 96 %. C'est un cas d'école de sur-apprentissage, attendu pour un réseau sans régularisation ni augmentation de données — les leviers évidents pour aller plus loin étant le batching, le dropout, et un portage GPU dans la lignée de TransformerCpp.",
      ],
      en: [
        "The project starts from a home-made Matrix class (raw allocation, rule of five, He initialisation) and builds the layers of a classic CNN on top: multi-channel 2D convolution with “same” padding, 2×2 max pooling, fully connected layers. These assemble into reusable blocks (Conv2D → MaxPooling → ReLU) and then into a complete network, ending with a flatten, a dense layer and a softmax fused with cross-entropy for a numerically stable gradient.",
        "The most demanding part is the backward pass, derived and hand-coded for each layer: the convolution gradient with respect to both filters and input, and routing the max pooling gradient back to the single position that won the maximum on the forward pass. A home-made Adam optimiser (first and second moments, bias correction) is wired into the Conv2D and Dense layers. All of it is validated by a deliberate overfitting test: the network must drive the loss down on a single repeated example — if backpropagation is wrong anywhere, that test fails immediately.",
        "On MNIST the chosen architecture stays deliberately simple — one convolutional block of 8 filters 3×3, pooling that brings the image down to 14×14×8, then a dense layer to the 10 classes — and reaches 97.4 % accuracy on the test set after a single training epoch, with Adam at a learning rate of 0.001. Everything runs on CPU, one image at a time, at roughly 1,200 examples per second.",
        "The network was then plugged into TrainerApp, the graphical interface built for TransformerCpp: it became a small multi-model training platform, able to drive the CUDA Transformer and this CPU CNN alike through a dedicated adapter, with the same live monitoring of loss and accuracy curves.",
        "That monitoring makes the model's main limitation very legible: over a long run, training loss collapses towards 0.001 while test loss climbs sharply from the third epoch onwards, and accuracy plateaus around 96 %. It is a textbook case of overfitting, expected for a network with neither regularisation nor data augmentation — the obvious levers to go further being batching, dropout, and a GPU port in the spirit of TransformerCpp.",
      ],
    },
    highlights: {
      fr: [
        "Convolution, max pooling et couches denses codées à la main en C++, forward et backward compris",
        "Optimiseur Adam maison, validé par un test de sur-apprentissage sur un exemple unique",
        "97,4 % de précision sur MNIST après une seule epoch, sans aucune bibliothèque de deep learning",
        "Intégré comme second modèle de TrainerApp, aux côtés de TransformerCpp",
      ],
      en: [
        "Convolution, max pooling and dense layers hand-coded in C++, forward and backward alike",
        "Home-made Adam optimiser, validated by an overfitting test on a single example",
        "97.4 % accuracy on MNIST after a single epoch, with no deep learning library",
        "Integrated as TrainerApp's second model, alongside TransformerCpp",
      ],
    },
    media: [
      {
        type: "image",
        src: "/media/convnetwork/trainerapp-cnn-entrainement.png",
        alt: {
          fr: "Entraînement du CNN suivi dans TrainerApp : courbes de perte et de précision",
          en: "CNN training monitored in TrainerApp: loss and accuracy curves",
        },
        caption: {
          fr: "Entraînement du CNN suivi dans TrainerApp. La divergence est nette : la perte d'entraînement (verte) tend vers zéro pendant que la perte de test (orange) remonte dès la troisième epoch — le sur-apprentissage se lit directement sur la courbe.",
          en: "CNN training monitored in TrainerApp. The divergence is unmistakable: training loss (green) tends towards zero while test loss (orange) climbs from the third epoch onwards — overfitting reads straight off the curve.",
        },
        afterParagraph: 4,
      },
    ],
    links: [
      { label: { fr: "Code source", en: "Source code" }, url: "https://github.com/FauconEspion61/ConvNetwork" },
    ],
    accent: "25 90% 55%",
    placeholder: false,
  },

  {
    slug: "ascon-fpga",
    title: {
      fr: "ASCON sur FPGA — du SystemVerilog à la ZedBoard",
      en: "ASCON on FPGA — from SystemVerilog to the ZedBoard",
    },
    tagline: {
      fr: "Implémentation matérielle du chiffrement authentifié ASCON, standard NIST, puis intégration complète sur une carte Zynq-7020.",
      en: "A hardware implementation of ASCON authenticated encryption, the NIST standard, then full integration on a Zynq-7020 board.",
    },
    category: "ecole",
    status: "done",
    period: { fr: "Septembre – Octobre 2026", en: "September – October 2026" },
    stack: ["SystemVerilog", "Vivado", "Zynq-7020", "ZedBoard", "RTL"],
    summary: {
      fr: "Projet de la majeure Systèmes embarqués : concevoir en SystemVerilog le cœur matériel du chiffrement authentifié ASCON-128, le valider en simulation, puis construire autour de lui la couche d'intégration qui le fait tourner et s'afficher sur une carte FPGA réelle.",
      en: "A project from the Embedded Systems major: design the hardware core of ASCON-128 authenticated encryption in SystemVerilog, validate it in simulation, then build the integration layer that makes it run and display results on a real FPGA board.",
    },
    details: {
      fr: [
        "ASCON est le chiffrement authentifié retenu par le NIST en 2023 pour la cryptographie légère — celle des objets contraints, capteurs et cartes à puce. Son principe tient en un état de 320 bits que l'on malaxe par une permutation, et dont seuls 64 bits (le « rate ») sont exposés à la donnée : le reste, la capacité, ne sort jamais. Quatre phases s'enchaînent sur ce même état — initialisation, absorption des données associées, chiffrement bloc par bloc, finalisation — et le même passage produit à la fois le texte chiffré et un tag d'authentification de 128 bits.",
        "Le cœur de l'implémentation est la permutation. Un tour enchaîne trois couches purement combinatoires : l'addition d'une constante de tour, une couche de substitution faite de 64 boîtes-S de 5 bits instanciées en parallèle par un bloc generate — chacune prenant une tranche verticale de bits à travers les cinq mots de l'état — puis une diffusion linéaire où chaque mot est XORé avec deux copies de lui-même décalées circulairement. J'avais déjà implémenté ASCON intégralement de zéro l'année précédente, dans un autre projet académique ; cette version-ci repart de la base de code distribuée avec le sujet — registres à enable, multiplexeur d'état et compteur fournis — pour concentrer l'effort sur la permutation, sa machine à états, et surtout l'intégration matérielle qui suit.",
        "Le choix d'architecture structurant est de replier ce tour sur lui-même : une seule instance combinatoire, bouclée sur un registre d'état de 320 bits, exécute un tour par coup d'horloge. C'est le compromis classique surface contre débit — déplier les douze tours aurait divisé la latence mais multiplié la logique d'autant. Une machine à états de Moore à vingt-six états séquence les phases et pilote tous les signaux d'activation, pendant qu'un compteur de tours à double initialisation distingue les douze tours de l'initialisation des six tours du traitement des données.",
        "La validation s'est faite en simulation sur un banc de test fourni avec le sujet, avec une clé et un nonce de 128 bits et plusieurs blocs de données. Le chronogramme se lit comme la spécification : les signaux de fin de phase s'allument l'un après l'autre, le bloc chiffré apparaît quand cipher_valid passe à 1, et le tag se fige en fin de finalisation.",
        "La seconde partie du projet consistait à rendre tout cela visible sur une carte réelle, une ZedBoard à Zynq-7020. J'ai écrit autour du cœur une couche d'intégration : un MMCM qui porte l'horloge de carte de 100 à 150 MHz, une mémoire bloc contenant les blocs à chiffrer, un compteur d'adresse, et une seconde machine à états — dix états cette fois — qui orchestre le tout : lire un bloc, le présenter, attendre l'accusé du cœur, incrémenter, recommencer, puis déclencher la finalisation.",
        "Restait le problème d'affichage : comment montrer un chiffré de 64 bits et un tag de 128 bits sur huit LEDs ? La réponse est une cascade de deux multiplexeurs pilotés par les interrupteurs de la carte — le premier choisit entre chiffré et tag, le second sélectionne un octet parmi seize. On parcourt ainsi le résultat octet par octet. L'implémentation tient dans 857 LUT, soit 1,6 % du composant, avec 573 bascules et un seul bloc RAM, et respecte le timing à 150 MHz avec 0,182 ns de marge.",
      ],
      en: [
        "ASCON is the authenticated cipher selected by NIST in 2023 for lightweight cryptography — the kind used in constrained devices, sensors and smart cards. Its principle fits in one sentence: a 320-bit state churned by a permutation, of which only 64 bits (the “rate”) are ever exposed to data; the rest, the capacity, never leaves. Four phases run over that same state — initialisation, absorption of associated data, block-by-block encryption, finalisation — and a single pass produces both the ciphertext and a 128-bit authentication tag.",
        "The heart of the implementation is the permutation. One round chains three purely combinational layers: adding a round constant, a substitution layer made of 64 five-bit S-boxes instantiated in parallel by a generate block — each taking a vertical slice of bits across the five state words — then linear diffusion where each word is XORed with two circularly rotated copies of itself. I had already implemented ASCON entirely from scratch the previous year, in a separate academic project; this version starts from the code base distributed with the assignment — enabled registers, state multiplexer and counter provided — to focus the effort on the permutation, its state machine, and above all the hardware integration that follows.",
        "The defining architectural choice is to fold that round onto itself: a single combinational instance, looped onto a 320-bit state register, executes one round per clock cycle. This is the classic area-versus-throughput trade-off — unrolling the twelve rounds would have cut the latency but multiplied the logic by as much. A 26-state Moore machine sequences the phases and drives every enable signal, while a round counter with two init values tells the twelve rounds of initialisation apart from the six rounds of data processing.",
        "Validation was done in simulation on a testbench supplied with the assignment, with a 128-bit key and nonce and several data blocks. The waveform reads like the specification: the end-of-phase signals light up one after another, the ciphertext block appears when cipher_valid goes high, and the tag settles at the end of finalisation.",
        "The second part of the project was making all this visible on a real board, a ZedBoard built around a Zynq-7020. Around the core I wrote an integration layer: an MMCM taking the board clock from 100 to 150 MHz, a block RAM holding the blocks to encrypt, an address counter, and a second state machine — ten states this time — orchestrating everything: read a block, present it, wait for the core's acknowledgement, increment, repeat, then trigger finalisation.",
        "That left the display problem: how do you show a 64-bit ciphertext and a 128-bit tag on eight LEDs? The answer is a cascade of two multiplexers driven by the board switches — the first picks between ciphertext and tag, the second selects one byte out of sixteen. You walk through the result one byte at a time. The implementation fits in 857 LUTs, 1.6 % of the device, with 573 flip-flops and a single block RAM, and meets timing at 150 MHz with 0.182 ns of slack.",
      ],
    },
    highlights: {
      fr: [
        "Permutation ASCON en SystemVerilog : trois couches combinatoires, 64 boîtes-S en parallèle, un tour par cycle",
        "Machine à états de Moore à 26 états séquençant les quatre phases du chiffrement authentifié",
        "Couche d'intégration FPGA complète : MMCM, mémoire bloc, FSM pilote, affichage par multiplexeurs sur 8 LEDs",
        "Implémenté sur Zynq-7020 : 857 LUT (1,6 %), timing respecté à 150 MHz",
      ],
      en: [
        "ASCON permutation in SystemVerilog: three combinational layers, 64 parallel S-boxes, one round per cycle",
        "26-state Moore machine sequencing the four phases of authenticated encryption",
        "Full FPGA integration layer: MMCM, block RAM, driver FSM, multiplexed display on 8 LEDs",
        "Implemented on Zynq-7020: 857 LUTs (1.6 %), timing met at 150 MHz",
      ],
    },
    media: [
      {
        type: "diagram",
        src: {
          fr: "/media/ascon-fpga/schema-1-phases.svg",
          en: "/media/ascon-fpga/en/schema-1-phases.svg",
        },
        alt: {
          fr: "Schéma des quatre phases d'ASCON-128 sur l'état de 320 bits",
          en: "Diagram of the four phases of ASCON-128 over the 320-bit state",
        },
        caption: {
          fr: "Les quatre phases d'ASCON-128. Tout se joue sur un seul état de 320 bits : la donnée n'entre que par les 64 bits du rate, la capacité reste secrète, et c'est ce même état qui finit par livrer le tag.",
          en: "The four phases of ASCON-128. Everything happens on a single 320-bit state: data only enters through the 64-bit rate, the capacity stays secret, and that same state ultimately yields the tag.",
        },
        afterParagraph: 0,
      },
      {
        type: "diagram",
        src: {
          fr: "/media/ascon-fpga/schema-2-permutation.svg",
          en: "/media/ascon-fpga/en/schema-2-permutation.svg",
        },
        alt: {
          fr: "Schéma d'un tour de permutation et de son implémentation matérielle bouclée",
          en: "Diagram of one permutation round and its looped hardware implementation",
        },
        caption: {
          fr: "Un tour de permutation et sa traduction matérielle. Les trois couches sont combinatoires : leur profondeur logique fixe la fréquence maximale, le nombre de tours fixe la latence.",
          en: "One permutation round and its hardware translation. The three layers are combinational: their logic depth sets the maximum frequency, the number of rounds sets the latency.",
        },
        afterParagraph: 2,
      },
      {
        type: "image",
        src: "/media/ascon-fpga/simulation-chiffrement.png",
        alt: {
          fr: "Chronogramme de simulation du chiffrement ASCON sous Vivado",
          en: "Simulation waveform of ASCON encryption in Vivado",
        },
        caption: {
          fr: "Simulation du chiffrement complet. On suit l'enchaînement des phases dans les signaux de fin — initialisation, données associées, chiffrement — puis l'apparition du bloc chiffré quand cipher_valid passe à 1.",
          en: "Simulation of a complete encryption. The phase sequence can be followed through the end-of-phase signals — initialisation, associated data, encryption — then the ciphertext block appears as cipher_valid goes high.",
        },
        afterParagraph: 3,
      },
      {
        type: "diagram",
        src: {
          fr: "/media/ascon-fpga/schema-3-fpga.svg",
          en: "/media/ascon-fpga/en/schema-3-fpga.svg",
        },
        alt: {
          fr: "Schéma de la couche d'intégration FPGA autour du cœur ASCON",
          en: "Diagram of the FPGA integration layer around the ASCON core",
        },
        caption: {
          fr: "La couche d'intégration sur ZedBoard : horloge, mémoire, FSM pilote et chaîne d'affichage. Le cœur ASCON n'est qu'un bloc parmi d'autres — tout le reste existe pour l'alimenter et rendre son résultat lisible.",
          en: "The integration layer on the ZedBoard: clocking, memory, driver FSM and display chain. The ASCON core is just one block among others — everything else exists to feed it and make its result readable.",
        },
        afterParagraph: 4,
      },
      {
        type: "image",
        src: "/media/ascon-fpga/implementation-zynq.png",
        alt: {
          fr: "Vue d'implémentation du design placé-routé sur le Zynq-7020",
          en: "Implementation view of the placed-and-routed design on the Zynq-7020",
        },
        caption: {
          fr: "Le design placé-routé sur le Zynq-7020. La logique occupée (en clair) tient dans une fraction d'une seule région d'horloge — 1,6 % des LUT du composant.",
          en: "The placed-and-routed design on the Zynq-7020. The occupied logic (highlighted) fits within a fraction of a single clock region — 1.6 % of the device's LUTs.",
        },
        afterParagraph: 5,
      },
    ],
    accent: "210 80% 55%",
    placeholder: false,
  },

  // ==========================================================================
  // MODÈLE — duplique ce bloc pour chaque projet école (retire les commentaires).
  // Chaque champ de texte demande ses deux langues : c'est ce qui garantit
  // qu'aucun projet ne se retrouve à moitié traduit en production.
  // ==========================================================================
  // {
  //   slug: "mon-projet-ecole",
  //   title: { fr: "Titre du projet", en: "Project title" },
  //   tagline: { fr: "Une phrase qui résume le projet.", en: "One sentence summing it up." },
  //   category: "ecole",                      // "perso" | "ecole" | "recherche"
  //   status: "done",                         // "ongoing" | "done" | "paused"
  //   period: { fr: "Mois AAAA – Mois AAAA", en: "Month YYYY – Month YYYY" },
  //   stack: ["Techno 1", "Techno 2"],
  //   summary: { fr: "2-3 phrases de contexte.", en: "2-3 sentences of context." },
  //   details: {
  //     fr: ["Paragraphe 1.", "Paragraphe 2."],
  //     en: ["Paragraph 1.", "Paragraph 2."],
  //   },
  //   highlights: { fr: ["Point fort 1"], en: ["Highlight 1"] },
  //   links: [{ label: { fr: "Code source", en: "Source code" }, url: "https://github.com/..." }],
  //   accent: "150 70% 42%",
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

/** Chemin du média pour la langue demandée (un schéma a un fichier par langue). */
export function mediaSrc(item: ProjectMedia, lang: Lang): string {
  return item.type === "diagram" ? item.src[lang] : item.src;
}
