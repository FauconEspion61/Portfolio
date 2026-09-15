// Internationalisation du site.
//
// Principe : chaque champ traduisible est typé `Localized`, c'est-à-dire un objet
// { fr, en }. Conséquence utile : oublier une traduction n'est pas un oubli
// silencieux qui part en production, c'est une erreur de compilation.

export const LANGS = ["fr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "fr";

/** Une chaîne dans les deux langues. */
export type Localized = Record<Lang, string>;

/** Une liste de chaînes dans les deux langues. */
export type LocalizedList = Record<Lang, string[]>;

/** Extrait la valeur correspondant à la langue courante. */
export function t<T>(value: Record<Lang, T>, lang: Lang): T {
  return value[lang];
}

/** Nom de chaque langue, affiché dans le sélecteur. */
export const LANG_NAMES: Record<Lang, string> = {
  fr: "Français",
  en: "English",
};

/**
 * Préfixe d'URL de la langue. Le français est la langue par défaut et vit à la
 * racine ; l'anglais est servi sous /en/.
 */
export function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LANG ? "" : `/${lang}`;
}

/** Segments de route traduits, pour que les URLs anglaises restent lisibles. */
export const ROUTES = {
  home: { fr: "/", en: "/en/" },
  projects: { fr: "/projets", en: "/en/projects" },
  about: { fr: "/parcours", en: "/en/background" },
} as const;

/** URL de la page d'un projet, dans la langue demandée. */
export function projectUrl(slug: string, lang: Lang): string {
  return `${t(ROUTES.projects, lang)}/${slug}`;
}

/**
 * Équivalent de l'URL courante dans l'autre langue — utilisé par le sélecteur
 * de langue pour rester sur la même page en changeant de langue.
 */
export function alternateUrl(pathname: string, target: Lang): string {
  const clean = pathname.replace(/\/+$/, "") || "/";

  // Page d'accueil
  if (clean === "/" || clean === "/en") return t(ROUTES.home, target);

  // Page projet : on conserve le slug, qui est identique dans les deux langues
  const projectMatch = clean.match(/^(?:\/en)?\/(?:projets|projects)\/(.+)$/);
  if (projectMatch) return projectUrl(projectMatch[1], target);

  // Listes et pages simples
  if (/^(?:\/en)?\/(?:projets|projects)$/.test(clean)) return t(ROUTES.projects, target);
  if (/^(?:\/en)?\/(?:parcours|background)$/.test(clean)) return t(ROUTES.about, target);

  return t(ROUTES.home, target);
}

/** Toutes les chaînes d'interface du site. */
export const ui = {
  skipToContent: { fr: "Aller au contenu", en: "Skip to content" },

  // Navigation
  navHome: { fr: "Accueil", en: "Home" },
  navProjects: { fr: "Projets", en: "Projects" },
  navAbout: { fr: "Parcours", en: "Background" },
  brandRole: { fr: "Systèmes embarqués · IA", en: "Embedded systems · AI" },
  switchLang: { fr: "Lire en anglais", en: "Lire en français" },

  // Accueil
  eyebrowPortfolio: { fr: "Portfolio", en: "Portfolio" },
  heroCtaProjects: { fr: "Découvrir mes projets", en: "Explore my projects" },
  heroCtaAbout: { fr: "Mon parcours", en: "My background" },
  eyebrowSelection: { fr: "Sélection", en: "Selected work" },
  featuredProjects: { fr: "Projets en avant", en: "Featured projects" },
  allProjects: { fr: "Tous les projets", en: "All projects" },
  eyebrowToolbox: { fr: "Boîte à outils", en: "Toolbox" },
  technicalSkills: { fr: "Compétences techniques", en: "Technical skills" },
  ctaTitle: { fr: "Parlons de votre projet", en: "Let's talk about your project" },
  ctaLead: {
    fr: "Stage, alternance ou simple curiosité technique : ma boîte mail est ouverte.",
    en: "Internship, work placement or plain technical curiosity — my inbox is open.",
  },
  contactMe: { fr: "Me contacter", en: "Get in touch" },
  seeBackground: { fr: "Voir mon parcours", en: "See my background" },
  statProjects: { fr: "projets techniques documentés", en: "documented technical projects" },

  // Projets
  projectsTitle: { fr: "Ce que je construis", en: "What I build" },
  projectsLead: {
    fr: "Projets personnels, projets école et travaux de recherche — chacun documenté avec son contexte, ses choix techniques et ses résultats.",
    en: "Personal projects, coursework and research — each documented with its context, technical choices and results.",
  },
  filterAll: { fr: "Tous", en: "All" },
  filterLabel: { fr: "Filtrer les projets par type", en: "Filter projects by type" },
  emptyCategory: {
    fr: "Aucun projet dans cette catégorie pour l'instant.",
    en: "No project in this category yet.",
  },
  viewProject: { fr: "Voir le projet", en: "View project" },
  backToProjects: { fr: "Tous les projets", en: "All projects" },
  returnToProjects: { fr: "Revenir aux projets", en: "Back to projects" },
  questionAboutProject: {
    fr: "Une question sur ce projet ?",
    en: "A question about this project?",
  },
  keyPoints: { fr: "Points clés", en: "Key points" },
  railType: { fr: "Type", en: "Type" },
  railPeriod: { fr: "Période", en: "Period" },
  railStatus: { fr: "Statut", en: "Status" },
  railStack: { fr: "Stack", en: "Stack" },

  // Parcours
  eyebrowAbout: { fr: "Parcours", en: "Background" },
  experiences: { fr: "Expériences", en: "Experience" },
  education: { fr: "Formation", en: "Education" },
  ongoing: { fr: "En cours", en: "Ongoing" },
  skills: { fr: "Compétences", en: "Skills" },
  languages: { fr: "Langues", en: "Languages" },
  downloadCv: { fr: "Télécharger mon CV (PDF)", en: "Download my résumé (PDF)" },
  cvUpdated: { fr: "Mis à jour", en: "Updated" },
  contactTitle: { fr: "Envie d'échanger ?", en: "Want to get in touch?" },
  contactLead: {
    fr: "Le plus simple reste un mail — je réponds rapidement.",
    en: "Email is the simplest way — I reply quickly.",
  },

  // Pied de page
  footerNav: { fr: "Navigation", en: "Navigation" },
  footerLinks: { fr: "Liens", en: "Links" },
  footerCv: { fr: "CV (PDF)", en: "Résumé (PDF)" },
  builtWith: { fr: "Construit avec Astro", en: "Built with Astro" },
  themeToggle: {
    fr: "Basculer le thème clair/sombre",
    en: "Toggle light/dark theme",
  },
} satisfies Record<string, Localized>;
