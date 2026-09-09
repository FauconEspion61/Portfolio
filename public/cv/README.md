# CV

Dépose ton CV en PDF dans ce dossier, par exemple `cv-paul-foltzer.pdf`.

Puis renseigne son chemin dans [`src/data/site.ts`](../../src/data/site.ts) :

```ts
links: {
  cv: "/cv/cv-paul-foltzer.pdf",
  cvUpdated: "Septembre 2026",
},
```

Le bouton « Télécharger mon CV (PDF) » apparaît alors automatiquement dans le
header, sur la page Parcours et dans le pied de page. Tant que `cv` vaut `null`,
aucun bouton n'est affiché — rien de cassé côté visiteur.
