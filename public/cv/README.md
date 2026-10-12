# CV

Dépose ton CV en PDF ici, sous ce nom exact :

```
public/cv/cv-paul-foltzer.pdf
```

Il n'y a **rien d'autre à faire** : le site teste l'existence du fichier à la
construction (`src/data/site.ts`). Dès qu'il est là, tout s'allume d'un coup —

- le bouton « Télécharger mon CV (PDF) » dans le header et le pied de page,
- la visionneuse en haut de la page Parcours, qui affiche le PDF directement
  dans la page sur ordinateur, et propose les liens d'ouverture et de
  téléchargement sur mobile (les navigateurs mobiles n'affichent pas les PDF
  en ligne).

Retire le fichier et tout disparaît : jamais de lien mort.

Une seule chose reste manuelle, le mois affiché sous le bouton. Il est écrit
dans `links.cvUpdated` (`src/data/site.ts`) et pas déduit de la date du
fichier : Vercel reclone le dépôt à chaque déploiement, la date du fichier
serait donc celle de la mise en ligne, pas celle du CV.

## Exporter le PDF depuis Word

`Fichier` → `Enregistrer sous` → format **PDF**, en visant directement le
chemin ci-dessus. Pense à cocher « Qualité d'impression » plutôt que « Taille
minimale » : un CV se lit aussi à l'écran, mais se zoome.
