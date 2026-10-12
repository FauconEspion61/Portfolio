// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // URL publique du site : sert aux URLs canoniques et aux métadonnées de partage.
  // Doit correspondre exactement à l'adresse principale configurée chez Vercel —
  // ici la forme avec `www`, vers laquelle le domaine nu redirige en 308.
  site: 'https://www.paulfoltzer.fr',
});
