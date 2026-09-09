# Portfolio

Site portfolio statique construit avec [Astro](https://astro.build).

## Commandes

| Commande          | Action                                        |
| :----------------- | :--------------------------------------------- |
| `npm install`       | Installe les dépendances                       |
| `npm run dev`       | Lance le serveur local sur `localhost:4321`    |
| `npm run build`     | Génère le site statique dans `./dist/`          |
| `npm run preview`   | Prévisualise le build de production en local   |

## Personnaliser le contenu

Tout le contenu éditable se trouve dans deux fichiers, pas besoin de toucher au reste :

- **`src/data/site.ts`** — nom, titre, bio, email, liens, statut de recherche, chiffres clés, **parcours (CV)**, langues et compétences.
- **`src/data/projects.ts`** — la liste des projets : `slug` (URL `/projets/<slug>`), **`category`**, statut, période, stack, résumé, paragraphes, points clés, liens et médias (voir [`public/media/README.md`](public/media/README.md)).

> ⚠️ Après avoir modifié `projects.ts` (ajout/suppression d'un projet, changement de `slug`), redémarre `npm run dev` : les nouvelles routes `/projets/<slug>` ne sont pas toujours prises en compte à chaud.

### Projets perso / école / recherche

Chaque projet porte une `category` : `"perso"`, `"ecole"` ou `"recherche"`. Elle pilote :

- le badge coloré affiché sur la carte et sur la page du projet ;
- les boutons de filtre de la page `/projets` — un filtre n'apparaît que si au moins un projet utilise cette catégorie.

Un modèle prêt à remplir pour un projet école est commenté en bas de `projects.ts`.

### Renseigner le CV

Dans `site.ts` :

- **`timeline`** — chaque entrée (`kind: "formation"` ou `"experience"`) devient une carte de la page `/parcours`, avec période, établissement, description, puces de réalisations et tags. Un modèle commenté est fourni dans le tableau.
- **`languages`** — les langues et leur niveau.
- **`links.cv`** — dépose ton PDF dans `public/cv/` puis mets son chemin ici (ex. `"/cv/cv-paul-foltzer.pdf"`). Le bouton de téléchargement apparaît alors dans le header, la page Parcours et le pied de page ; tant que la valeur est `null`, il reste masqué.
- **`links.cvUpdated`** — date affichée sous le bouton (ex. `"Septembre 2026"`).
- **`availability`** — pastille de statut sur l'accueil (ex. `"Recherche un stage de fin d'études — 2027"`). `null` = masquée.
- **`stats`** — les chiffres mis en avant sur l'accueil. Le nombre de projets est ajouté automatiquement.

## Structure

```
src/
├── data/
│   ├── site.ts         # infos perso, CV (timeline), compétences, chiffres
│   └── projects.ts     # projets + catégories perso/école/recherche
├── layouts/
│   └── Layout.astro    # squelette HTML (polices, thème, révélation au scroll)
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── ProjectCard.astro
│   ├── MediaBlock.astro   # images, vidéos en boucle et schémas SVG
│   └── ThemeToggle.astro
├── styles/
│   └── global.css      # tokens de design, thèmes clair/sombre, primitives
└── pages/
    ├── index.astro          # accueil (hero, chiffres, projets, compétences)
    ├── parcours.astro       # CV : bio, timeline, compétences, langues, contact
    └── projets/
        ├── index.astro      # liste filtrable des projets
        └── [slug].astro     # page détail d'un projet
```

## Direction artistique

- **Typographie** : Space Grotesk (titres), Inter (texte), JetBrains Mono (libellés techniques), chargées depuis Google Fonts.
- **Thème** : clair/sombre, suit la préférence système par défaut et mémorise le choix manuel dans `localStorage`.
- **Couleurs** : tous les tokens sont regroupés en haut de `src/styles/global.css` — change `--accent` et `--accent-2` pour redéfinir l'identité du site en une ligne.
- **Animations** : révélation au scroll via `data-reveal`, désactivée automatiquement si le visiteur a activé « réduire les animations ».
- **Schémas SVG** : injectés dans la page au build (`MediaBlock.astro`) pour que leurs couleurs suivent le thème du site et pas seulement celui du système.

## Déployer sur GitHub Pages

1. Crée un dépôt GitHub (ex. `ton-pseudo.github.io` pour un site à la racine, ou n'importe quel nom pour un sous-chemin).
2. Dans `astro.config.mjs`, renseigne `site` (et `base` si le dépôt n'est pas `<pseudo>.github.io`) :

   ```js
   export default defineConfig({
     site: "https://ton-pseudo.github.io",
     // base: "/nom-du-repo", // uniquement si le dépôt n'est pas <pseudo>.github.io
   });
   ```

3. Ajoute un workflow GitHub Actions `.github/workflows/deploy.yml` :

   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   permissions:
     contents: read
     pages: write
     id-token: write
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: withastro/action@v3
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

4. Dans les paramètres du dépôt GitHub (`Settings > Pages`), choisis la source **GitHub Actions**.
5. Pousse sur `main` : le site se déploie automatiquement à chaque push.

## Déployer sur Vercel/Netlify (alternative)

Ces plateformes détectent Astro automatiquement : il suffit de connecter le dépôt GitHub, sans configuration supplémentaire (`site`/`base` ne sont pas nécessaires dans ce cas).
