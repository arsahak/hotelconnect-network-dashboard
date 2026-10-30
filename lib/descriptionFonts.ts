// The fonts a product's short description can be set in.
//
// The dashboard and the website each hold this same file: the dashboard's
// editor offers the list, and wherever a description is shown the fonts it
// uses are loaded from Google Fonts — only those, not the whole list. Keep
// the two copies identical; a font removed here falls back to a plain one in
// descriptions that already use it.

export interface DescriptionFont {
  /**
   * The family name, as the editor lists it and as a saved style names it.
   * Letters and spaces only, so it is a valid font name with or without
   * quotes around it.
   */
  name: string;
  /** What to fall back on until the font loads, or if it can't. */
  fallback: string;
  /**
   * Its Google Fonts "family" value (name and weights). Left out for fonts
   * every device already has.
   */
  google?: string;
  /**
   * The storefront loads its own three fonts under generated names; this is
   * the CSS variable each can be reached through there.
   */
  siteVariable?: string;
}

const SANS = "sans-serif";
const SERIF = "serif";
const CURSIVE = "cursive";

export const DESCRIPTION_FONTS: DescriptionFont[] = [
  // The storefront's own
  { name: "Inter", fallback: SANS, google: "Inter:wght@400;700", siteVariable: "--font-inter" },
  { name: "Plus Jakarta Sans", fallback: SANS, google: "Plus+Jakarta+Sans:wght@400;700", siteVariable: "--font-jakarta" },
  { name: "DM Sans", fallback: SANS, google: "DM+Sans:wght@400;700", siteVariable: "--font-dm" },

  // Clean
  { name: "Poppins", fallback: SANS, google: "Poppins:wght@400;700" },
  { name: "Montserrat", fallback: SANS, google: "Montserrat:wght@400;700" },
  { name: "Roboto", fallback: SANS, google: "Roboto:wght@400;700" },
  { name: "Open Sans", fallback: SANS, google: "Open+Sans:wght@400;700" },
  { name: "Lato", fallback: SANS, google: "Lato:wght@400;700" },
  { name: "Nunito", fallback: SANS, google: "Nunito:wght@400;700" },
  { name: "Raleway", fallback: SANS, google: "Raleway:wght@400;700" },
  { name: "Quicksand", fallback: SANS, google: "Quicksand:wght@400;700" },
  { name: "Josefin Sans", fallback: SANS, google: "Josefin+Sans:wght@400;700" },
  { name: "Oswald", fallback: SANS, google: "Oswald:wght@400;700" },
  { name: "Comfortaa", fallback: SANS, google: "Comfortaa:wght@400;700" },

  // Elegant
  { name: "Playfair Display", fallback: SERIF, google: "Playfair+Display:wght@400;700" },
  { name: "Cormorant Garamond", fallback: SERIF, google: "Cormorant+Garamond:wght@400;700" },
  { name: "Lora", fallback: SERIF, google: "Lora:wght@400;700" },
  { name: "Merriweather", fallback: SERIF, google: "Merriweather:wght@400;700" },
  { name: "Libre Baskerville", fallback: SERIF, google: "Libre+Baskerville:wght@400;700" },
  { name: "EB Garamond", fallback: SERIF, google: "EB+Garamond:wght@400;700" },
  { name: "Cinzel", fallback: SERIF, google: "Cinzel:wght@400;700" },

  // Bold display
  { name: "Bebas Neue", fallback: SANS, google: "Bebas+Neue" },
  { name: "Abril Fatface", fallback: SERIF, google: "Abril+Fatface" },
  { name: "Righteous", fallback: SANS, google: "Righteous" },
  { name: "Lobster", fallback: CURSIVE, google: "Lobster" },

  // Script and calligraphy
  { name: "Dancing Script", fallback: CURSIVE, google: "Dancing+Script:wght@400;700" },
  { name: "Great Vibes", fallback: CURSIVE, google: "Great+Vibes" },
  { name: "Pacifico", fallback: CURSIVE, google: "Pacifico" },
  { name: "Satisfy", fallback: CURSIVE, google: "Satisfy" },
  { name: "Sacramento", fallback: CURSIVE, google: "Sacramento" },
  { name: "Parisienne", fallback: CURSIVE, google: "Parisienne" },
  { name: "Allura", fallback: CURSIVE, google: "Allura" },
  { name: "Alex Brush", fallback: CURSIVE, google: "Alex+Brush" },
  { name: "Pinyon Script", fallback: CURSIVE, google: "Pinyon+Script" },
  { name: "Tangerine", fallback: CURSIVE, google: "Tangerine:wght@400;700" },
  { name: "Kaushan Script", fallback: CURSIVE, google: "Kaushan+Script" },
  { name: "Courgette", fallback: CURSIVE, google: "Courgette" },

  // Handwriting
  { name: "Caveat", fallback: CURSIVE, google: "Caveat:wght@400;700" },
  { name: "Shadows Into Light", fallback: CURSIVE, google: "Shadows+Into+Light" },
  { name: "Indie Flower", fallback: CURSIVE, google: "Indie+Flower" },

  // Bangla
  { name: "Hind Siliguri", fallback: SANS, google: "Hind+Siliguri:wght@400;700" },
  { name: "Noto Sans Bengali", fallback: SANS, google: "Noto+Sans+Bengali:wght@400;700" },
  { name: "Noto Serif Bengali", fallback: SERIF, google: "Noto+Serif+Bengali:wght@400;700" },
  { name: "Anek Bangla", fallback: SANS, google: "Anek+Bangla:wght@400;700" },
  { name: "Tiro Bangla", fallback: SERIF, google: "Tiro+Bangla" },
  { name: "Galada", fallback: CURSIVE, google: "Galada" },

  // On every device
  { name: "Arial", fallback: `Helvetica, ${SANS}` },
  { name: "Verdana", fallback: `Geneva, ${SANS}` },
  { name: "Tahoma", fallback: `Arial, ${SANS}` },
  { name: "Trebuchet MS", fallback: `Geneva, ${SANS}` },
  { name: "Georgia", fallback: `Palatino, ${SERIF}` },
  { name: "Times New Roman", fallback: `Times, ${SERIF}` },
  { name: "Courier New", fallback: "Courier, monospace" },
];

const FONT_BY_NAME = new Map(
  DESCRIPTION_FONTS.map((font) => [font.name.toLowerCase(), font]),
);

/** The Google Fonts stylesheet that loads these fonts, or "" if none need it. */
export const descriptionFontStylesheet = (fonts: DescriptionFont[]): string => {
  const families = fonts
    .filter((font) => font.google)
    .map((font) => `family=${font.google}`);
  return families.length > 0
    ? `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`
    : "";
};

// A font-family declaration inside a style="…" attribute. A name with a space
// in it may be saved in quotes, single or (as &quot;) double.
const FONT_FAMILY = /font-family:\s*((?:&quot;|[^;"])+)/gi;

const firstFamily = (families: string) =>
  families.split(",")[0].replace(/'|&quot;/g, "").trim().toLowerCase();

/** The listed fonts a saved description is set in, each once. */
export const descriptionFontsUsed = (html: string): DescriptionFont[] => {
  const used = new Set<DescriptionFont>();
  for (const match of html.matchAll(FONT_FAMILY)) {
    const font = FONT_BY_NAME.get(firstFamily(match[1]));
    if (font) used.add(font);
  }
  return [...used];
};

/**
 * Points a description's use of the storefront's own fonts at the variables
 * they are loaded under there. Other fonts are left as they are.
 */
export const withSiteFontVariables = (html: string): string =>
  html.replace(FONT_FAMILY, (match, families: string) => {
    const variable = FONT_BY_NAME.get(firstFamily(families))?.siteVariable;
    return variable
      ? `font-family: var(${variable}), ${families.trim()}`
      : match;
  });
