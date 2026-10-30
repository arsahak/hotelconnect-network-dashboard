// How a product's written descriptions are set: the size, spacing, colours
// and fonts of their paragraphs, titles, lists, links and tables.
//
// The dashboard and the website each hold this same file, and both draw the
// text from it — the dashboard's editor while a description is being written,
// the website when it is shown — so what is typed looks the same in both.
// Keep the two copies identical.
//
// Colours and the two base fonts come from the storefront's own variables,
// with the storefront's light-theme values to fall back on where those
// variables don't exist (the editor).

/** "overview" is the full description; "summary" the short one beside the price. */
export type DescriptionVariant = "overview" | "summary";

/** Marks an empty paragraph — a blank line — in a description shown on a page. */
export const DESCRIPTION_BLANK_CLASS = "sd-blank";
/**
 * Marks one inside the editor. TinyMCE leaves every data-mce-* attribute out
 * of the saved text, so the mark never gets saved.
 */
export const DESCRIPTION_BLANK_ATTRIBUTE = "data-mce-blank";

const TEXT = "var(--color-text, #000)";
const TEXT_MUTED = "var(--color-text-muted, #66615a)";
const DARK = "var(--color-dark, #1d1d1b)";
const PRIMARY = "var(--color-primary, #ff0052)";
const BORDER = "var(--color-border, #dcd5c9)";
const SURFACE = "var(--color-bg, #f4f7fc)";
const BODY_FONT = "var(--font-body, Inter, sans-serif)";
const HEADING_FONT = "var(--font-heading, 'Plus Jakarta Sans', sans-serif)";

interface DescriptionTypography {
  color: string;
  /** In px, like every size and gap here. */
  fontSize: number;
  lineHeight: number;
  /**
   * The line height of a blank line — a paragraph left empty to open up a
   * gap — and so how much room one blank line adds, as a share of a line of
   * text. Well under a full line, so it reads as a pause rather than a hole.
   */
  blankLine: number;
  /** The space above and below a paragraph. */
  paragraphGap: number;
  /** The space above a title, and below it. */
  headingGap: [number, number];
  /** Size and weight of h1 … h6, in that order. */
  headings: [number, number][];
  /** The space above and below a list, and between its items. */
  listGap: number;
  itemGap: number;
  tableFontSize: number;
  cellPadding: string;
}

const TYPOGRAPHY: Record<DescriptionVariant, DescriptionTypography> = {
  overview: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 1.75,
    blankLine: 0.6,
    paragraphGap: 12,
    headingGap: [20, 8],
    headings: [
      [28, 800],
      [24, 700],
      [20, 700],
      [17, 600],
      [16, 600],
      [14, 600],
    ],
    listGap: 12,
    itemGap: 5,
    tableFontSize: 14,
    cellPadding: "8px 12px",
  },
  summary: {
    color: TEXT_MUTED,
    fontSize: 14,
    lineHeight: 1.5,
    blankLine: 0.6,
    paragraphGap: 4,
    headingGap: [12, 4],
    headings: [
      [18, 700],
      [17, 700],
      [16, 600],
      [14, 600],
      [14, 600],
      [13, 600],
    ],
    listGap: 6,
    itemGap: 3,
    tableFontSize: 13,
    cellPadding: "4px 8px",
  },
};

/** The class names for the element a description of this kind is shown in. */
export const descriptionContentClass = (variant: DescriptionVariant): string =>
  `description-content description-content--${variant}`;

/**
 * The stylesheet for a description of this kind, with every rule under
 * `scope` — the selector of the element holding the text ("body" inside the
 * editor, the description's class on a page).
 */
export const descriptionContentCss = (
  scope: string,
  variant: DescriptionVariant,
): string => {
  const type = TYPOGRAPHY[variant];
  const headings = "h1, h2, h3, h4, h5, h6";
  return [
    `${scope} { color: ${type.color}; font-family: ${BODY_FONT}; font-size: ${type.fontSize}px; line-height: ${type.lineHeight}; overflow-wrap: break-word; }`,
    `${scope} p { margin: ${type.paragraphGap}px 0; color: inherit; font-family: inherit; font-size: inherit; line-height: inherit; }`,
    // An empty paragraph or title. The page marks these with a class when it
    // prepares the text; the editor marks them with an attribute as they are
    // typed.
    // Pulled in by half a paragraph gap on each side: a blank line sits
    // between two gaps that would otherwise have merged into one, and
    // without this it would add a whole extra gap on top of its own height.
    `${scope} :is(.${DESCRIPTION_BLANK_CLASS}, [${DESCRIPTION_BLANK_ATTRIBUTE}]) { margin-block: -${type.paragraphGap / 2}px; line-height: ${type.blankLine}; }`,
    `${scope} :is(${headings}) { margin: ${type.headingGap[0]}px 0 ${type.headingGap[1]}px; color: ${DARK}; font-family: ${HEADING_FONT}; line-height: 1.25; letter-spacing: -0.02em; }`,
    ...type.headings.map(
      ([size, weight], index) =>
        `${scope} h${index + 1} { font-size: ${size}px; font-weight: ${weight}; }`,
    ),
    // Lists, bold text and table cells take the color, size and line height
    // of the text they are in — said outright, because the storefront's
    // general styles give each of them its own.
    `${scope} :is(ul, ol) { margin: ${type.listGap}px 0; padding-inline-start: 20px; color: inherit; line-height: inherit; }`,
    `${scope} ul { list-style: disc; }`,
    `${scope} ol { list-style: decimal; }`,
    `${scope} li { margin: ${type.itemGap}px 0; }`,
    `${scope} li::marker { color: ${PRIMARY}; }`,
    `${scope} a { color: ${PRIMARY}; text-decoration: underline; }`,
    // A bold word inside colored text keeps that color.
    `${scope} :is(strong, b) { font-weight: 700; color: inherit; }`,
    // A picture fills the width of the text, keeping its own shape — unless it
    // was given a width by hand, which it then keeps (never wider than the
    // text). A video always fills the width, in the usual 16:9 frame.
    `${scope} img { display: block; max-width: 100%; height: auto; margin: 12px 0; border-radius: 8px; }`,
    `${scope} img:not([width]) { width: 100%; }`,
    `${scope} :is(iframe, video) { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; margin: 12px 0; border: 0; border-radius: 8px; }`,
    `${scope} :is(table, img, iframe, video) { box-sizing: border-box; }`,
    `${scope} table { width: 100% !important; margin: 16px 0; border-collapse: collapse; font-family: inherit; font-size: ${type.tableFontSize}px; }`,
    `${scope} thead { background-color: transparent; }`,
    `${scope} :is(th, td) { padding: ${type.cellPadding}; border: 1px solid ${BORDER}; background-color: transparent; color: inherit; font-size: inherit; letter-spacing: normal; text-align: start; }`,
    `${scope} th { background-color: ${SURFACE}; color: ${DARK}; font-weight: 600; }`,
    // The text starts and ends flush with the box it is in — also when it
    // sits inside a wrapper <div> or two, as pasted text usually does.
    `${scope} > :first-child, ${scope} > div:first-child > :first-child, ${scope} > div:first-child > div:first-child > :first-child { margin-top: 0; }`,
    `${scope} > :last-child, ${scope} > div:last-child > :last-child, ${scope} > div:last-child > div:last-child > :last-child { margin-bottom: 0; }`,
  ].join("\n");
};

const VARIANTS: DescriptionVariant[] = ["overview", "summary"];

/** Name of the stylesheet below, for adding it to a page once. */
export const DESCRIPTION_CONTENT_STYLESHEET_ID = "description-content";

/**
 * The stylesheet for a page that shows descriptions: both kinds, each under
 * its own class (see descriptionContentClass).
 */
export const DESCRIPTION_CONTENT_STYLESHEET = VARIANTS.map((variant) =>
  descriptionContentCss(`.description-content--${variant}`, variant),
).join("\n");
