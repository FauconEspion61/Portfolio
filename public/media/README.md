# Médias des projets

Chaque sous-dossier ici correspond à un projet (`/media/<slug-du-projet>/...`).

## Ajouter une image ou une vidéo à un projet

1. Dépose le fichier dans `public/media/<slug-du-projet>/` (crée le dossier s'il n'existe pas).
2. Dans [`src/data/projects.ts`](../../src/data/projects.ts), ajoute une entrée au tableau `media` du projet concerné :

   ```ts
   media: [
     {
       type: "image", // "image" | "video" | "diagram"
       src: "/media/transformer-cpp/courbe-perte.png",
       alt: "Courbe de perte d'entraînement",
       caption: "Perte d'entraînement et de validation sur 20 000 paires de phrases.",
       afterParagraph: 0, // insère ce média juste après details[0] ; omis = avant le premier paragraphe
     },
   ],
   ```

`afterParagraph` place le média dans le fil de lecture, entre deux paragraphes de `details` (comme une illustration insérée dans un article), plutôt que dans une galerie séparée. Plusieurs médias peuvent partager le même `afterParagraph` : ils s'affichent alors à la suite, dans l'ordre du tableau.

Les vidéos sont lues automatiquement en boucle, sans son ni contrôles (comme un GIF animé) — pense à des clips courts et silencieux (quelques secondes suffisent pour illustrer un mouvement ou une démo).

`type: "diagram"` sert aux schémas SVG (architecture, flux de données) : contrairement à `"image"`, le rendu n'est ni recadré ni posé sur un fond noir — le SVG garde son propre fond (généralement clair/sombre auto-adaptatif via `prefers-color-scheme`) et s'affiche en entier. Écris une légende (`caption`) substantielle pour un schéma : elle sert d'explication, pas juste de titre.

Formats recommandés : `.png`/`.jpg` pour les photos, `.svg` pour les schémas, `.mp4` pour les vidéos (compresse-les avant de les ajouter — vise quelques Mo, pas des dizaines).

## Idées d'illustrations par projet

- **TransformerCpp** : schémas d'architecture et captures TrainerApp déjà en place — il reste un graphe de débit CPU vs GPU (ex/s) à ajouter si tu veux aller plus loin.
- **ConvNetwork** : visualisation des filtres appris, sortie d'une convolution ou d'un max pooling sur une image test.
- **Scanner de tomographie optique** : déjà en place (vidéo de rotation + calibration caméra) — tu peux ajouter une image du sinogramme ou d'une tranche reconstruite une fois le pipeline plus avancé.
