// The icons a product's short description can use — a title or a line can
// start with one. Each is a Lucide icon (lucide.dev, ISC licence): 24 × 24,
// drawn as a 2px outline that takes the colour of the text around it.
//
// The dashboard and the website each hold this same file: the dashboard's
// editor offers the list and saves an icon as a placeholder,
//   <span class="sd-icon" data-icon="leaf">…</span>
// and wherever the description is shown, renderDescriptionIcons() swaps the
// placeholder for the drawing. Keep the two copies identical; a name that is
// removed here stops showing in descriptions that already use it.

export interface DescriptionIcon {
  /** What a saved description refers to the icon by. */
  name: string;
  /** What the editor's icon picker calls it. */
  label: string;
  /** The shapes inside the <svg>. */
  body: string;
}

export const DESCRIPTION_ICON_CLASS = "sd-icon";

/**
 * How big an icon can be, measured against the text it sits in: "md" is a
 * little taller than a letter. A placeholder carries its size as
 * data-size="lg"; one without it is "md".
 */
export const DESCRIPTION_ICON_SIZES = [
  { value: "sm", label: "Small", em: 1 },
  { value: "md", label: "Normal", em: 1.2 },
  { value: "lg", label: "Large", em: 1.6 },
  { value: "xl", label: "Extra large", em: 2.1 },
  { value: "2xl", label: "Huge", em: 2.8 },
] as const;

export type DescriptionIconSize = (typeof DESCRIPTION_ICON_SIZES)[number]["value"];

export const DEFAULT_DESCRIPTION_ICON_SIZE: DescriptionIconSize = "md";

/**
 * Where an icon of this size sits on the line: the small ones rest on the
 * text like a letter, the big ones are centred on it.
 */
export const descriptionIconAlign = (em: number): string =>
  em <= 1.2 ? "-0.22em" : "middle";

export const DESCRIPTION_ICONS: DescriptionIcon[] = [
  { name: "check", label: "Check", body: "<path d=\"M20 6 9 17l-5-5\"/>" },
  { name: "circle-check", label: "Check circle", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m9 12 2 2 4-4\"/>" },
  { name: "badge-check", label: "Verified", body: "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\"/><path d=\"m9 12 2 2 4-4\"/>" },
  { name: "star", label: "Star", body: "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/>" },
  { name: "heart", label: "Heart", body: "<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/>" },
  { name: "sparkles", label: "Sparkles", body: "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/><path d=\"M20 2v4\"/><path d=\"M22 4h-4\"/><circle cx=\"4\" cy=\"20\" r=\"2\"/>" },
  { name: "sparkle", label: "Sparkle", body: "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/>" },
  { name: "award", label: "Award", body: "<path d=\"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526\"/><circle cx=\"12\" cy=\"8\" r=\"6\"/>" },
  { name: "crown", label: "Crown", body: "<path d=\"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z\"/><path d=\"M5 21h14\"/>" },
  { name: "gem", label: "Gem", body: "<path d=\"M10.5 3 8 9l4 13 4-13-2.5-6\"/><path d=\"M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z\"/><path d=\"M2 9h20\"/>" },
  { name: "thumbs-up", label: "Thumbs up", body: "<path d=\"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z\"/><path d=\"M7 10v12\"/>" },
  { name: "smile", label: "Smile", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"/><line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\"/><line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\"/>" },
  { name: "leaf", label: "Leaf", body: "<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"/>" },
  { name: "sprout", label: "Sprout", body: "<path d=\"M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3\"/><path d=\"M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4\"/><path d=\"M5 21h14\"/>" },
  { name: "flower", label: "Flower", body: "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5\"/><path d=\"M12 7.5V9\"/><path d=\"M7.5 12H9\"/><path d=\"M16.5 12H15\"/><path d=\"M12 16.5V15\"/><path d=\"m8 8 1.88 1.88\"/><path d=\"M14.12 9.88 16 8\"/><path d=\"m8 16 1.88-1.88\"/><path d=\"M14.12 14.12 16 16\"/>" },
  { name: "flower-2", label: "Flower stem", body: "<path d=\"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1\"/><circle cx=\"12\" cy=\"8\" r=\"2\"/><path d=\"M12 10v12\"/><path d=\"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z\"/><path d=\"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z\"/>" },
  { name: "clover", label: "Clover", body: "<path d=\"M16.17 7.83 2 22\"/><path d=\"M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12\"/><path d=\"m7.83 7.83 8.34 8.34\"/>" },
  { name: "trees", label: "Trees", body: "<path d=\"M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z\"/><path d=\"M7 16v6\"/><path d=\"M13 19v3\"/><path d=\"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5\"/>" },
  { name: "feather", label: "Feather", body: "<path d=\"M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z\"/><path d=\"M16 8 2 22\"/><path d=\"M17.5 15H9\"/>" },
  { name: "vegan", label: "Vegan", body: "<path d=\"M16 8q6 0 6-6-6 0-6 6\"/><path d=\"M17.41 3.59a10 10 0 1 0 3 3\"/><path d=\"M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14\"/>" },
  { name: "rabbit", label: "Cruelty free", body: "<path d=\"M13 16a3 3 0 0 1 2.24 5\"/><path d=\"M18 12h.01\"/><path d=\"M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3\"/><path d=\"M20 8.54V4a2 2 0 1 0-4 0v3\"/><path d=\"M7.612 12.524a3 3 0 1 0-1.6 4.3\"/>" },
  { name: "recycle", label: "Recycle", body: "<path d=\"M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5\"/><path d=\"M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12\"/><path d=\"m14 16-3 3 3 3\"/><path d=\"M8.293 13.596 7.196 9.5 3.1 10.598\"/><path d=\"m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843\"/><path d=\"m13.378 9.633 4.096 1.098 1.097-4.096\"/>" },
  { name: "droplet", label: "Droplet", body: "<path d=\"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z\"/>" },
  { name: "droplets", label: "Droplets", body: "<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"/><path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"/>" },
  { name: "waves", label: "Waves", body: "<path d=\"M2 12q2.5 2 5 0t5 0 5 0 5 0\"/><path d=\"M2 19q2.5 2 5 0t5 0 5 0 5 0\"/><path d=\"M2 5q2.5 2 5 0t5 0 5 0 5 0\"/>" },
  { name: "wind", label: "Wind", body: "<path d=\"M12.8 19.6A2 2 0 1 0 14 16H2\"/><path d=\"M17.5 8a2.5 2.5 0 1 1 2 4H2\"/><path d=\"M9.8 4.4A2 2 0 1 1 11 8H2\"/>" },
  { name: "sun", label: "Sun", body: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m17.66 17.66 1.41 1.41\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"m6.34 17.66-1.41 1.41\"/><path d=\"m19.07 4.93-1.41 1.41\"/>" },
  { name: "sun-medium", label: "Sun protection", body: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 3v1\"/><path d=\"M12 20v1\"/><path d=\"M3 12h1\"/><path d=\"M20 12h1\"/><path d=\"m18.364 5.636-.707.707\"/><path d=\"m6.343 17.657-.707.707\"/><path d=\"m5.636 5.636.707.707\"/><path d=\"m17.657 17.657.707.707\"/>" },
  { name: "moon", label: "Moon", body: "<path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>" },
  { name: "cloud-sun", label: "Day", body: "<path d=\"M12 2v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"M20 12h2\"/><path d=\"m19.07 4.93-1.41 1.41\"/><path d=\"M15.947 12.65a4 4 0 0 0-5.925-4.128\"/><path d=\"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z\"/>" },
  { name: "snowflake", label: "Snowflake", body: "<path d=\"m10 20-1.25-2.5L6 18\"/><path d=\"M10 4 8.75 6.5 6 6\"/><path d=\"m14 20 1.25-2.5L18 18\"/><path d=\"m14 4 1.25 2.5L18 6\"/><path d=\"m17 21-3-6h-4\"/><path d=\"m17 3-3 6 1.5 3\"/><path d=\"M2 12h6.5L10 9\"/><path d=\"m20 10-1.5 2 1.5 2\"/><path d=\"M22 12h-6.5L14 15\"/><path d=\"m4 10 1.5 2L4 14\"/><path d=\"m7 21 3-6-1.5-3\"/><path d=\"m7 3 3 6h4\"/>" },
  { name: "flame", label: "Flame", body: "<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\"/>" },
  { name: "zap", label: "Zap", body: "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"/>" },
  { name: "thermometer", label: "Thermometer", body: "<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"/>" },
  { name: "umbrella", label: "Umbrella", body: "<path d=\"M12 13v7a2 2 0 0 0 4 0\"/><path d=\"M12 2v2\"/><path d=\"M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z\"/>" },
  { name: "eye", label: "Eye", body: "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>" },
  { name: "hand", label: "Hand", body: "<path d=\"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2\"/><path d=\"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2\"/><path d=\"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8\"/><path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\"/>" },
  { name: "hand-heart", label: "Care", body: "<path d=\"M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16\"/><path d=\"m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95\"/><path d=\"m2 15 6 6\"/><path d=\"m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91\"/>" },
  { name: "heart-pulse", label: "Health", body: "<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\"/><path d=\"M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27\"/>" },
  { name: "baby", label: "Baby", body: "<path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\"/><path d=\"M15 12h.01\"/><path d=\"M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\"/><path d=\"M9 12h.01\"/>" },
  { name: "user", label: "Person", body: "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>" },
  { name: "users", label: "People", body: "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><path d=\"M16 3.128a4 4 0 0 1 0 7.744\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/>" },
  { name: "brush", label: "Brush", body: "<path d=\"m11 10 3 3\"/><path d=\"M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z\"/><path d=\"M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031\"/>" },
  { name: "paintbrush", label: "Paintbrush", body: "<path d=\"m14.622 17.897-10.68-2.913\"/><path d=\"M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z\"/><path d=\"M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15\"/>" },
  { name: "palette", label: "Palette", body: "<path d=\"M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z\"/><circle cx=\"13.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"17.5\" cy=\"10.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"6.5\" cy=\"12.5\" r=\".5\" fill=\"currentColor\"/><circle cx=\"8.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/>" },
  { name: "scissors", label: "Scissors", body: "<circle cx=\"6\" cy=\"6\" r=\"3\"/><path d=\"M8.12 8.12 12 12\"/><path d=\"M20 4 8.12 15.88\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><path d=\"M14.8 14.8 20 20\"/>" },
  { name: "spray-can", label: "Spray", body: "<path d=\"M3 3h.01\"/><path d=\"M7 5h.01\"/><path d=\"M11 7h.01\"/><path d=\"M3 7h.01\"/><path d=\"M7 9h.01\"/><path d=\"M3 11h.01\"/><rect width=\"4\" height=\"4\" x=\"15\" y=\"5\"/><path d=\"m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2\"/><path d=\"m13 14 8-2\"/><path d=\"m13 19 8-2\"/>" },
  { name: "bath", label: "Bath", body: "<path d=\"M10 4 8 6\"/><path d=\"M17 19v2\"/><path d=\"M2 12h20\"/><path d=\"M7 19v2\"/><path d=\"M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5\"/>" },
  { name: "shower-head", label: "Shower", body: "<path d=\"m4 4 2.5 2.5\"/><path d=\"M13.5 6.5a4.95 4.95 0 0 0-7 7\"/><path d=\"M15 5 5 15\"/><path d=\"M14 17v.01\"/><path d=\"M10 16v.01\"/><path d=\"M13 13v.01\"/><path d=\"M16 10v.01\"/><path d=\"M11 20v.01\"/><path d=\"M17 14v.01\"/><path d=\"M20 11v.01\"/>" },
  { name: "flask-conical", label: "Formula", body: "<path d=\"M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2\"/><path d=\"M6.453 15h11.094\"/><path d=\"M8.5 2h7\"/>" },
  { name: "test-tube", label: "Test tube", body: "<path d=\"M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2\"/><path d=\"M8.5 2h7\"/><path d=\"M14.5 16h-5\"/>" },
  { name: "microscope", label: "Tested", body: "<path d=\"M6 18h8\"/><path d=\"M3 22h18\"/><path d=\"M14 22a7 7 0 1 0 0-14h-1\"/><path d=\"M9 14h2\"/><path d=\"M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z\"/><path d=\"M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3\"/>" },
  { name: "pill", label: "Pill", body: "<path d=\"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z\"/><path d=\"m8.5 8.5 7 7\"/>" },
  { name: "stethoscope", label: "Dermatologist", body: "<path d=\"M11 2v2\"/><path d=\"M5 2v2\"/><path d=\"M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1\"/><path d=\"M8 15a6 6 0 0 0 12 0v-3\"/><circle cx=\"20\" cy=\"10\" r=\"2\"/>" },
  { name: "dna", label: "DNA", body: "<path d=\"m10 16 1.5 1.5\"/><path d=\"m14 8-1.5-1.5\"/><path d=\"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993\"/><path d=\"m16.5 10.5 1 1\"/><path d=\"m17 6-2.891-2.891\"/><path d=\"M2 15c6.667-6 13.333 0 20-6\"/><path d=\"m20 9 .891.891\"/><path d=\"M3.109 14.109 4 15\"/><path d=\"m6.5 12.5 1 1\"/><path d=\"m7 18 2.891 2.891\"/><path d=\"M9 22c1.798-1.998 2.518-3.995 2.807-5.993\"/>" },
  { name: "atom", label: "Science", body: "<circle cx=\"12\" cy=\"12\" r=\"1\"/><path d=\"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z\"/><path d=\"M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z\"/>" },
  { name: "milk", label: "Bottle", body: "<path d=\"M8 2h8\"/><path d=\"M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2\"/><path d=\"M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0\"/>" },
  { name: "milk-off", label: "Dairy free", body: "<path d=\"M8 2h8\"/><path d=\"M9 2v1.343M15 2v2.789a4 4 0 0 0 .672 2.219l.656.984a4 4 0 0 1 .672 2.22v1.131M7.8 7.8l-.128.192A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3\"/><path d=\"M7 15a6.47 6.47 0 0 1 5 0 6.472 6.472 0 0 0 3.435.435\"/><line x1=\"2\" x2=\"22\" y1=\"2\" y2=\"22\"/>" },
  { name: "wheat-off", label: "Gluten free", body: "<path d=\"m2 22 10-10\"/><path d=\"m16 8-1.17 1.17\"/><path d=\"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"/><path d=\"m8 8-.53.53a3.5 3.5 0 0 0 0 4.94L9 15l1.53-1.53c.55-.55.88-1.25.98-1.97\"/><path d=\"M10.91 5.26c.15-.26.34-.51.56-.73L13 3l1.53 1.53a3.5 3.5 0 0 1 .28 4.62\"/><path d=\"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z\"/><path d=\"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"/><path d=\"m16 16-.53.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.49 3.49 0 0 1 1.97-.98\"/><path d=\"M18.74 13.09c.26-.15.51-.34.73-.56L21 11l-1.53-1.53a3.5 3.5 0 0 0-4.62-.28\"/><line x1=\"2\" x2=\"22\" y1=\"2\" y2=\"22\"/>" },
  { name: "ban", label: "Free from", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M4.929 4.929 19.07 19.071\"/>" },
  { name: "shield", label: "Shield", body: "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>" },
  { name: "shield-check", label: "Protected", body: "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/>" },
  { name: "lock", label: "Secure", body: "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>" },
  { name: "truck", label: "Delivery", body: "<path d=\"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2\"/><path d=\"M15 18H9\"/><path d=\"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14\"/><circle cx=\"17\" cy=\"18\" r=\"2\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/>" },
  { name: "package", label: "Package", body: "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\"/><path d=\"M12 22V12\"/><polyline points=\"3.29 7 12 12 20.71 7\"/><path d=\"m7.5 4.27 9 5.15\"/>" },
  { name: "box", label: "Box", body: "<path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\"/><path d=\"m3.3 7 8.7 5 8.7-5\"/><path d=\"M12 22V12\"/>" },
  { name: "gift", label: "Gift", body: "<path d=\"M12 7v14\"/><path d=\"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"/><path d=\"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5\"/><rect x=\"3\" y=\"7\" width=\"18\" height=\"4\" rx=\"1\"/>" },
  { name: "shopping-bag", label: "Shopping bag", body: "<path d=\"M16 10a4 4 0 0 1-8 0\"/><path d=\"M3.103 6.034h17.794\"/><path d=\"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z\"/>" },
  { name: "tag", label: "Tag", body: "<path d=\"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z\"/><circle cx=\"7.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\"/>" },
  { name: "badge-percent", label: "Discount", body: "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\"/><path d=\"m15 9-6 6\"/><path d=\"M9 9h.01\"/><path d=\"M15 15h.01\"/>" },
  { name: "percent", label: "Percent", body: "<line x1=\"19\" x2=\"5\" y1=\"5\" y2=\"19\"/><circle cx=\"6.5\" cy=\"6.5\" r=\"2.5\"/><circle cx=\"17.5\" cy=\"17.5\" r=\"2.5\"/>" },
  { name: "wallet", label: "Wallet", body: "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\"/><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\"/>" },
  { name: "credit-card", label: "Card", body: "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\"/><line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\"/>" },
  { name: "rotate-ccw", label: "Return", body: "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/>" },
  { name: "refresh-cw", label: "Exchange", body: "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/><path d=\"M21 3v5h-5\"/><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/><path d=\"M8 16H3v5\"/>" },
  { name: "clock", label: "Clock", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>" },
  { name: "timer", label: "Timer", body: "<line x1=\"10\" x2=\"14\" y1=\"2\" y2=\"2\"/><line x1=\"12\" x2=\"15\" y1=\"14\" y2=\"11\"/><circle cx=\"12\" cy=\"14\" r=\"8\"/>" },
  { name: "hourglass", label: "Long lasting", body: "<path d=\"M5 22h14\"/><path d=\"M5 2h14\"/><path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\"/><path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\"/>" },
  { name: "calendar", label: "Calendar", body: "<path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/>" },
  { name: "map-pin", label: "Location", body: "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>" },
  { name: "globe", label: "Worldwide", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"/><path d=\"M2 12h20\"/>" },
  { name: "phone", label: "Phone", body: "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\"/>" },
  { name: "message-circle", label: "Message", body: "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"/>" },
  { name: "info", label: "Info", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>" },
  { name: "circle-alert", label: "Notice", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"/><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"/>" },
  { name: "triangle-alert", label: "Warning", body: "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/><path d=\"M12 9v4\"/><path d=\"M12 17h.01\"/>" },
  { name: "lightbulb", label: "Tip", body: "<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"/><path d=\"M9 18h6\"/><path d=\"M10 22h4\"/>" },
  { name: "list-checks", label: "Checklist", body: "<path d=\"M13 5h8\"/><path d=\"M13 12h8\"/><path d=\"M13 19h8\"/><path d=\"m3 17 2 2 4-4\"/><path d=\"m3 7 2 2 4-4\"/>" },
  { name: "ruler", label: "Size", body: "<path d=\"M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z\"/><path d=\"m14.5 12.5 2-2\"/><path d=\"m11.5 9.5 2-2\"/><path d=\"m8.5 6.5 2-2\"/><path d=\"m17.5 15.5 2-2\"/>" },
  { name: "weight", label: "Weight", body: "<circle cx=\"12\" cy=\"5\" r=\"3\"/><path d=\"M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z\"/>" },
  { name: "shirt", label: "Clothing", body: "<path d=\"M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z\"/>" },
  { name: "watch", label: "Watch", body: "<path d=\"M12 10v2.2l1.6 1\"/><path d=\"m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05\"/><path d=\"m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/>" },
  { name: "glasses", label: "Glasses", body: "<circle cx=\"6\" cy=\"15\" r=\"4\"/><circle cx=\"18\" cy=\"15\" r=\"4\"/><path d=\"M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2\"/><path d=\"M2.5 13 5 7c.7-1.3 1.4-2 3-2\"/><path d=\"M21.5 13 19 7c-.7-1.3-1.5-2-3-2\"/>" },
  { name: "footprints", label: "Footwear", body: "<path d=\"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z\"/><path d=\"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z\"/><path d=\"M16 17h4\"/><path d=\"M4 13h4\"/>" },
  { name: "home", label: "Home", body: "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>" },
  { name: "house", label: "House", body: "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>" },
  { name: "activity", label: "Activity", body: "<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\"/>" },
  { name: "amphora", label: "Amphora", body: "<path d=\"M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8\"/><path d=\"M10 5H8a2 2 0 0 0 0 4h.68\"/><path d=\"M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8\"/><path d=\"M14 5h2a2 2 0 0 1 0 4h-.68\"/><path d=\"M18 22H6\"/><path d=\"M9 2h6\"/>" },
  { name: "apple", label: "Apple", body: "<path d=\"M12 6.528V3a1 1 0 0 1 1-1h0\"/><path d=\"M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21\"/>" },
  { name: "backpack", label: "Backpack", body: "<path d=\"M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z\"/><path d=\"M8 10h8\"/><path d=\"M8 18h8\"/><path d=\"M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6\"/><path d=\"M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2\"/>" },
  { name: "balloon", label: "Balloon", body: "<path d=\"M12 16v1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v1\"/><path d=\"M12 6a2 2 0 0 1 2 2\"/><path d=\"M18 8c0 4-3.5 8-6 8s-6-4-6-8a6 6 0 0 1 12 0\"/>" },
  { name: "bandage", label: "Bandage", body: "<path d=\"M10 10.01h.01\"/><path d=\"M10 14.01h.01\"/><path d=\"M14 10.01h.01\"/><path d=\"M14 14.01h.01\"/><path d=\"M18 6v12\"/><path d=\"M6 6v12\"/><rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\"/>" },
  { name: "banknote", label: "Banknote", body: "<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M6 12h.01M18 12h.01\"/>" },
  { name: "battery-charging", label: "Battery charging", body: "<path d=\"m11 7-3 5h4l-3 5\"/><path d=\"M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935\"/><path d=\"M22 14v-4\"/><path d=\"M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936\"/>" },
  { name: "battery-full", label: "Battery full", body: "<path d=\"M10 10v4\"/><path d=\"M14 10v4\"/><path d=\"M22 14v-4\"/><path d=\"M6 10v4\"/><rect x=\"2\" y=\"6\" width=\"16\" height=\"12\" rx=\"2\"/>" },
  { name: "beaker", label: "Beaker", body: "<path d=\"M4.5 3h15\"/><path d=\"M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3\"/><path d=\"M6 14h12\"/>" },
  { name: "bean", label: "Bean", body: "<path d=\"M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z\"/><path d=\"M5.341 10.62a4 4 0 1 0 5.279-5.28\"/>" },
  { name: "bed", label: "Bed", body: "<path d=\"M2 4v16\"/><path d=\"M2 8h18a2 2 0 0 1 2 2v10\"/><path d=\"M2 17h20\"/><path d=\"M6 8v9\"/>" },
  { name: "bike", label: "Bike", body: "<circle cx=\"18.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"5.5\" cy=\"17.5\" r=\"3.5\"/><circle cx=\"15\" cy=\"5\" r=\"1\"/><path d=\"M12 17.5V14l-3-3 4-3 2 3h2\"/>" },
  { name: "blend", label: "Blend", body: "<circle cx=\"9\" cy=\"9\" r=\"7\"/><circle cx=\"15\" cy=\"15\" r=\"7\"/>" },
  { name: "bluetooth", label: "Bluetooth", body: "<path d=\"m7 7 10 10-5 5V2l5 5L7 17\"/>" },
  { name: "bone", label: "Bone", body: "<path d=\"M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z\"/>" },
  { name: "book-open", label: "Book open", body: "<path d=\"M12 7v14\"/><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\"/>" },
  { name: "bottle-wine", label: "Bottle wine", body: "<path d=\"M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a6 6 0 0 0 1.2 3.6l.6.8A6 6 0 0 1 17 13v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a6 6 0 0 1 1.2-3.6l.6-.8A6 6 0 0 0 10 5z\"/><path d=\"M17 13h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4\"/>" },
  { name: "briefcase", label: "Briefcase", body: "<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"/>" },
  { name: "briefcase-business", label: "Briefcase business", body: "<path d=\"M12 12h.01\"/><path d=\"M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2\"/><path d=\"M22 13a18.15 18.15 0 0 1-20 0\"/><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"/>" },
  { name: "bubbles", label: "Bubbles", body: "<path d=\"M7.001 15.085A1.5 1.5 0 0 1 9 16.5\"/><circle cx=\"18.5\" cy=\"8.5\" r=\"3.5\"/><circle cx=\"7.5\" cy=\"16.5\" r=\"5.5\"/><circle cx=\"7.5\" cy=\"4.5\" r=\"2.5\"/>" },
  { name: "bug", label: "Bug", body: "<path d=\"M12 20v-9\"/><path d=\"M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z\"/><path d=\"M14.12 3.88 16 2\"/><path d=\"M21 21a4 4 0 0 0-3.81-4\"/><path d=\"M21 5a4 4 0 0 1-3.55 3.97\"/><path d=\"M22 13h-4\"/><path d=\"M3 21a4 4 0 0 1 3.81-4\"/><path d=\"M3 5a4 4 0 0 0 3.55 3.97\"/><path d=\"M6 13H2\"/><path d=\"m8 2 1.88 1.88\"/><path d=\"M9 7.13V6a3 3 0 1 1 6 0v1.13\"/>" },
  { name: "bug-off", label: "Bug off", body: "<path d=\"M12 20v-8\"/><path d=\"M12.656 7H14a4 4 0 0 1 4 4v1.344\"/><path d=\"M14.12 3.88 16 2\"/><path d=\"M17.123 17.123A6 6 0 0 1 6 14v-3a4 4 0 0 1 1.72-3.287\"/><path d=\"m2 2 20 20\"/><path d=\"M21 5a4 4 0 0 1-3.55 3.97\"/><path d=\"M22 13h-3.344\"/><path d=\"M3 21a4 4 0 0 1 3.81-4\"/><path d=\"M3 5a4 4 0 0 0 3.55 3.97\"/><path d=\"M6 13H2\"/><path d=\"m8 2 1.88 1.88\"/><path d=\"M9.712 4.06A3 3 0 0 1 15 6v1.13\"/>" },
  { name: "bus", label: "Bus", body: "<path d=\"M8 6v6\"/><path d=\"M15 6v6\"/><path d=\"M2 12h19.6\"/><path d=\"M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3\"/><circle cx=\"7\" cy=\"18\" r=\"2\"/><path d=\"M9 18h5\"/><circle cx=\"16\" cy=\"18\" r=\"2\"/>" },
  { name: "cake", label: "Cake", body: "<path d=\"M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8\"/><path d=\"M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1\"/><path d=\"M2 21h20\"/><path d=\"M7 8v3\"/><path d=\"M12 8v3\"/><path d=\"M17 8v3\"/><path d=\"M7 4h.01\"/><path d=\"M12 4h.01\"/><path d=\"M17 4h.01\"/>" },
  { name: "calendar-check", label: "Calendar check", body: "<path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/><path d=\"m9 16 2 2 4-4\"/>" },
  { name: "calendar-days", label: "Calendar days", body: "<path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/><path d=\"M8 14h.01\"/><path d=\"M12 14h.01\"/><path d=\"M16 14h.01\"/><path d=\"M8 18h.01\"/><path d=\"M12 18h.01\"/><path d=\"M16 18h.01\"/>" },
  { name: "calendar-heart", label: "Calendar heart", body: "<path d=\"M12.127 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.125\"/><path d=\"M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z\"/><path d=\"M16 2v4\"/><path d=\"M3 10h18\"/><path d=\"M8 2v4\"/>" },
  { name: "calendar-range", label: "Calendar range", body: "<rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M16 2v4\"/><path d=\"M3 10h18\"/><path d=\"M8 2v4\"/><path d=\"M17 14h-6\"/><path d=\"M13 18H7\"/><path d=\"M7 14h.01\"/><path d=\"M17 18h.01\"/>" },
  { name: "camera", label: "Camera", body: "<path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/>" },
  { name: "candy", label: "Candy", body: "<path d=\"M10 7v10.9\"/><path d=\"M14 6.1V17\"/><path d=\"M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4\"/><path d=\"M16.536 7.465a5 5 0 0 0-7.072 0l-2 2a5 5 0 0 0 0 7.07 5 5 0 0 0 7.072 0l2-2a5 5 0 0 0 0-7.07\"/><path d=\"M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4\"/>" },
  { name: "car", label: "Car", body: "<path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\"/><circle cx=\"7\" cy=\"17\" r=\"2\"/><path d=\"M9 17h6\"/><circle cx=\"17\" cy=\"17\" r=\"2\"/>" },
  { name: "carrot", label: "Carrot", body: "<path d=\"M15 16a1 1 0 0 0-7-7q-4 4-5.987 12.385a.5.5 0 0 0 .602.602Q11 20 15 16l-3-3\"/><path d=\"M15 9q4 4 7 0-3-4-7 0 4-4 0-7-4 3 0 7\"/><path d=\"m8 15-2.58-2.58\"/>" },
  { name: "check-check", label: "Check check", body: "<path d=\"M18 6 7 17l-5-5\"/><path d=\"m22 10-7.5 7.5L13 16\"/>" },
  { name: "cherry", label: "Cherry", body: "<path d=\"M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z\"/><path d=\"M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z\"/><path d=\"M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12\"/><path d=\"M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z\"/>" },
  { name: "circle", label: "Circle", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/>" },
  { name: "circle-dashed", label: "Circle dashed", body: "<path d=\"M10.1 2.182a10 10 0 0 1 3.8 0\"/><path d=\"M13.9 21.818a10 10 0 0 1-3.8 0\"/><path d=\"M17.609 3.721a10 10 0 0 1 2.69 2.7\"/><path d=\"M2.182 13.9a10 10 0 0 1 0-3.8\"/><path d=\"M20.279 17.609a10 10 0 0 1-2.7 2.69\"/><path d=\"M21.818 10.1a10 10 0 0 1 0 3.8\"/><path d=\"M3.721 6.391a10 10 0 0 1 2.7-2.69\"/><path d=\"M6.391 20.279a10 10 0 0 1-2.69-2.7\"/>" },
  { name: "circle-dot", label: "Circle dot", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/>" },
  { name: "circle-off", label: "Circle off", body: "<path d=\"m2 2 20 20\"/><path d=\"M8.35 2.69A10 10 0 0 1 21.3 15.65\"/><path d=\"M19.08 19.08A10 10 0 1 1 4.92 4.92\"/>" },
  { name: "circle-slash", label: "Circle slash", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"9\" x2=\"15\" y1=\"15\" y2=\"9\"/>" },
  { name: "citrus", label: "Citrus", body: "<path d=\"M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z\"/><path d=\"M19.65 15.66A8 8 0 0 1 8.35 4.34\"/><path d=\"m14 10-5.5 5.5\"/><path d=\"M14 17.85V10H6.15\"/>" },
  { name: "clock-alert", label: "Clock alert", body: "<path d=\"M12 6v6l4 2\"/><path d=\"M20 12v5\"/><path d=\"M20 21h.01\"/><path d=\"M21.25 8.2A10 10 0 1 0 16 21.16\"/>" },
  { name: "cloud", label: "Cloud", body: "<path d=\"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z\"/>" },
  { name: "cloud-fog", label: "Cloud fog", body: "<path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\"/><path d=\"M16 17H7\"/><path d=\"M17 21H9\"/>" },
  { name: "cloud-rain", label: "Cloud rain", body: "<path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\"/><path d=\"M16 14v6\"/><path d=\"M8 14v6\"/><path d=\"M12 16v6\"/>" },
  { name: "coffee", label: "Coffee", body: "<path d=\"M10 2v2\"/><path d=\"M14 2v2\"/><path d=\"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1\"/><path d=\"M6 2v2\"/>" },
  { name: "compass", label: "Compass", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\"/>" },
  { name: "contrast", label: "Contrast", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 18a6 6 0 0 0 0-12v12z\"/>" },
  { name: "diamond", label: "Diamond", body: "<path d=\"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z\"/>" },
  { name: "droplet-off", label: "Droplet off", body: "<path d=\"M18.715 13.186C18.29 11.858 17.384 10.607 16 9.5c-2-1.6-3.5-4-4-6.5a10.7 10.7 0 0 1-.884 2.586\"/><path d=\"m2 2 20 20\"/><path d=\"M8.795 8.797A11 11 0 0 1 8 9.5C6 11.1 5 13 5 15a7 7 0 0 0 13.222 3.208\"/>" },
  { name: "drum", label: "Drum", body: "<path d=\"m2 2 8 8\"/><path d=\"m22 2-8 8\"/><ellipse cx=\"12\" cy=\"9\" rx=\"10\" ry=\"5\"/><path d=\"M7 13.4v7.9\"/><path d=\"M12 14v8\"/><path d=\"M17 13.4v7.9\"/><path d=\"M2 9v8a10 5 0 0 0 20 0V9\"/>" },
  { name: "dumbbell", label: "Dumbbell", body: "<path d=\"M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z\"/><path d=\"m2.5 21.5 1.4-1.4\"/><path d=\"m20.1 3.9 1.4-1.4\"/><path d=\"M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z\"/><path d=\"m9.6 14.4 4.8-4.8\"/>" },
  { name: "eraser", label: "Eraser", body: "<path d=\"M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21\"/><path d=\"m5.082 11.09 8.828 8.828\"/>" },
  { name: "eye-closed", label: "Eye closed", body: "<path d=\"m15 18-.722-3.25\"/><path d=\"M2 8a10.645 10.645 0 0 0 20 0\"/><path d=\"m20 15-1.726-2.05\"/><path d=\"m4 15 1.726-2.05\"/><path d=\"m9 18 .722-3.25\"/>" },
  { name: "flame-kindling", label: "Flame kindling", body: "<path d=\"M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z\"/><path d=\"m5 22 14-4\"/><path d=\"m5 18 14 4\"/>" },
  { name: "gamepad-2", label: "Gamepad 2", body: "<line x1=\"6\" x2=\"10\" y1=\"11\" y2=\"11\"/><line x1=\"8\" x2=\"8\" y1=\"9\" y2=\"13\"/><line x1=\"15\" x2=\"15.01\" y1=\"12\" y2=\"12\"/><line x1=\"18\" x2=\"18.01\" y1=\"10\" y2=\"10\"/><path d=\"M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z\"/>" },
  { name: "glass-water", label: "Glass water", body: "<path d=\"M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z\"/><path d=\"M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0\"/>" },
  { name: "graduation-cap", label: "Graduation cap", body: "<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\"/><path d=\"M22 10v6\"/><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\"/>" },
  { name: "grid-3x3", label: "Grid 3x3", body: "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M3 15h18\"/><path d=\"M9 3v18\"/><path d=\"M15 3v18\"/>" },
  { name: "grip", label: "Grip", body: "<circle cx=\"12\" cy=\"5\" r=\"1\"/><circle cx=\"19\" cy=\"5\" r=\"1\"/><circle cx=\"5\" cy=\"5\" r=\"1\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"19\" cy=\"12\" r=\"1\"/><circle cx=\"5\" cy=\"12\" r=\"1\"/><circle cx=\"12\" cy=\"19\" r=\"1\"/><circle cx=\"19\" cy=\"19\" r=\"1\"/><circle cx=\"5\" cy=\"19\" r=\"1\"/>" },
  { name: "hand-fist", label: "Hand fist", body: "<path d=\"M12.035 17.012a3 3 0 0 0-3-3l-.311-.002a.72.72 0 0 1-.505-1.229l1.195-1.195A2 2 0 0 1 10.828 11H12a2 2 0 0 0 0-4H9.243a3 3 0 0 0-2.122.879l-2.707 2.707A4.83 4.83 0 0 0 3 14a8 8 0 0 0 8 8h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v2a2 2 0 1 0 4 0\"/><path d=\"M13.888 9.662A2 2 0 0 0 17 8V5A2 2 0 1 0 13 5\"/><path d=\"M9 5A2 2 0 1 0 5 5V10\"/><path d=\"M9 7V4A2 2 0 1 1 13 4V7.268\"/>" },
  { name: "handbag", label: "Handbag", body: "<path d=\"M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z\"/><path d=\"M8 11V6a4 4 0 0 1 8 0v5\"/>" },
  { name: "handshake", label: "Handshake", body: "<path d=\"m11 17 2 2a1 1 0 1 0 3-3\"/><path d=\"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4\"/><path d=\"m21 3 1 11h-2\"/><path d=\"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3\"/><path d=\"M3 4h8\"/>" },
  { name: "hard-hat", label: "Hard hat", body: "<path d=\"M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5\"/><path d=\"M14 6a6 6 0 0 1 6 6v3\"/><path d=\"M4 15v-3a6 6 0 0 1 6-6\"/><rect x=\"2\" y=\"15\" width=\"20\" height=\"4\" rx=\"1\"/>" },
  { name: "hat-glasses", label: "Hat glasses", body: "<path d=\"M14 18a2 2 0 0 0-4 0\"/><path d=\"m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11\"/><path d=\"M2 11h20\"/><circle cx=\"17\" cy=\"18\" r=\"3\"/><circle cx=\"7\" cy=\"18\" r=\"3\"/>" },
  { name: "headphones", label: "Headphones", body: "<path d=\"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3\"/>" },
  { name: "heart-crack", label: "Heart crack", body: "<path d=\"M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15\"/><path d=\"M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z\"/>" },
  { name: "heart-handshake", label: "Heart handshake", body: "<path d=\"M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762\"/>" },
  { name: "heart-plus", label: "Heart plus", body: "<path d=\"m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49\"/><path d=\"M15 15h6\"/><path d=\"M18 12v6\"/>" },
  { name: "hexagon", label: "Hexagon", body: "<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"/>" },
  { name: "house-heart", label: "House heart", body: "<path d=\"M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>" },
  { name: "house-plus", label: "House plus", body: "<path d=\"M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35\"/><path d=\"M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8\"/><path d=\"M15 18h6\"/><path d=\"M18 15v6\"/>" },
  { name: "house-wifi", label: "House wifi", body: "<path d=\"M9.5 13.866a4 4 0 0 1 5 .01\"/><path d=\"M12 17h.01\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><path d=\"M7 10.754a8 8 0 0 1 10 0\"/>" },
  { name: "infinity", label: "Infinity", body: "<path d=\"M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8\"/>" },
  { name: "landmark", label: "Landmark", body: "<path d=\"M10 18v-7\"/><path d=\"M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z\"/><path d=\"M14 18v-7\"/><path d=\"M18 18v-7\"/><path d=\"M3 22h18\"/><path d=\"M6 18v-7\"/>" },
  { name: "laptop", label: "Laptop", body: "<path d=\"M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z\"/><path d=\"M20.054 15.987H3.946\"/>" },
  { name: "layers", label: "Layers", body: "<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\"/><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\"/><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\"/>" },
  { name: "layers-2", label: "Layers 2", body: "<path d=\"M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z\"/><path d=\"m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845\"/>" },
  { name: "layers-plus", label: "Layers plus", body: "<path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 .83.18 2 2 0 0 0 .83-.18l8.58-3.9a1 1 0 0 0 0-1.831z\"/><path d=\"M16 17h6\"/><path d=\"M19 14v6\"/><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 .825.178\"/><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l2.116-.962\"/>" },
  { name: "leafy-green", label: "Leafy green", body: "<path d=\"M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22\"/><path d=\"M2 22 17 7\"/>" },
  { name: "line-squiggle", label: "Line squiggle", body: "<path d=\"M7 3.5c5-2 7 2.5 3 4C1.5 10 2 15 5 16c5 2 9-10 14-7s.5 13.5-4 12c-5-2.5.5-11 6-2\"/>" },
  { name: "link", label: "Link", body: "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>" },
  { name: "luggage", label: "Luggage", body: "<path d=\"M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2\"/><path d=\"M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14\"/><path d=\"M10 20h4\"/><circle cx=\"16\" cy=\"20\" r=\"2\"/><circle cx=\"8\" cy=\"20\" r=\"2\"/>" },
  { name: "mars", label: "Mars", body: "<path d=\"M16 3h5v5\"/><path d=\"m21 3-6.75 6.75\"/><circle cx=\"10\" cy=\"14\" r=\"6\"/>" },
  { name: "martini", label: "Martini", body: "<path d=\"M12 12 4.207 4.207A.707.707 0 0 1 4.707 3h14.586a.707.707 0 0 1 .5 1.207z\"/><path d=\"M12 12v10\"/><path d=\"M7 22h10\"/>" },
  { name: "maximize-2", label: "Maximize 2", body: "<path d=\"M15 3h6v6\"/><path d=\"m21 3-7 7\"/><path d=\"m3 21 7-7\"/><path d=\"M9 21H3v-6\"/>" },
  { name: "meh", label: "Meh", body: "<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"8\" x2=\"16\" y1=\"15\" y2=\"15\"/><line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\"/><line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\"/>" },
  { name: "message-circle-heart", label: "Message circle heart", body: "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"/><path d=\"M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z\"/>" },
  { name: "minimize-2", label: "Minimize 2", body: "<path d=\"m14 10 7-7\"/><path d=\"M20 10h-6V4\"/><path d=\"m3 21 7-7\"/><path d=\"M4 14h6v6\"/>" },
  { name: "minus", label: "Minus", body: "<path d=\"M5 12h14\"/>" },
  { name: "mirror-round", label: "Mirror round", body: "<path d=\"M10 6.6 8.6 8\"/><path d=\"M12 18v4\"/><path d=\"M15 7.5 9.5 13\"/><path d=\"M7 22h10\"/><circle cx=\"12\" cy=\"10\" r=\"8\"/>" },
  { name: "monitor", label: "Monitor", body: "<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\"/><line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\"/><line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\"/>" },
  { name: "moon-star", label: "Moon star", body: "<path d=\"M18 5h4\"/><path d=\"M20 3v4\"/><path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>" },
  { name: "mountain", label: "Mountain", body: "<path d=\"m8 3 4 8 5-5 5 15H2L8 3z\"/>" },
  { name: "move-vertical", label: "Move vertical", body: "<path d=\"M12 2v20\"/><path d=\"m8 18 4 4 4-4\"/><path d=\"m8 6 4-4 4 4\"/>" },
  { name: "nut", label: "Nut", body: "<path d=\"M12 4V2\"/><path d=\"M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592A7.003 7.003 0 0 0 19 14v-4\"/><path d=\"M12 4C8 4 4.5 6 4 8c-.243.97-.919 1.952-2 3 1.31-.082 1.972-.29 3-1 .54.92.982 1.356 2 2 1.452-.647 1.954-1.098 2.5-2 .595.995 1.151 1.427 2.5 2 1.31-.621 1.862-1.058 2.5-2 .629.977 1.162 1.423 2.5 2 1.209-.548 1.68-.967 2-2 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4Z\"/>" },
  { name: "parasol", label: "Parasol", body: "<path d=\"M12.5 11.134 18.196 21\"/><path d=\"M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413\"/><path d=\"M21 21H3\"/>" },
  { name: "party-popper", label: "Party popper", body: "<path d=\"M5.8 11.3 2 22l10.7-3.79\"/><path d=\"M4 3h.01\"/><path d=\"M22 8h.01\"/><path d=\"M15 2h.01\"/><path d=\"M22 20h.01\"/><path d=\"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10\"/><path d=\"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17\"/><path d=\"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7\"/><path d=\"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z\"/>" },
  { name: "person-standing", label: "Person standing", body: "<circle cx=\"12\" cy=\"5\" r=\"1\"/><path d=\"m9 20 3-6 3 6\"/><path d=\"m6 8 6 2 6-2\"/><path d=\"M12 10v4\"/>" },
  { name: "piggy-bank", label: "Piggy bank", body: "<path d=\"M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z\"/><path d=\"M16 10h.01\"/><path d=\"M2 8v1a2 2 0 0 0 2 2h1\"/>" },
  { name: "pill-bottle", label: "Pill bottle", body: "<path d=\"M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4\"/><path d=\"M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7\"/><rect width=\"16\" height=\"5\" x=\"4\" y=\"2\" rx=\"1\"/>" },
  { name: "plane", label: "Plane", body: "<path d=\"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\"/>" },
  { name: "plus", label: "Plus", body: "<path d=\"M5 12h14\"/><path d=\"M12 5v14\"/>" },
  { name: "rewind", label: "Rewind", body: "<path d=\"M12 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 12 18z\"/><path d=\"M22 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 22 18z\"/>" },
  { name: "ribbon", label: "Ribbon", body: "<path d=\"M12 11.22C11 9.997 10 9 10 8a2 2 0 0 1 4 0c0 1-.998 2.002-2.01 3.22\"/><path d=\"m12 18 2.57-3.5\"/><path d=\"M6.243 9.016a7 7 0 0 1 11.507-.009\"/><path d=\"M9.35 14.53 12 11.22\"/><path d=\"M9.35 14.53C7.728 12.246 6 10.221 6 7a6 5 0 0 1 12 0c-.005 3.22-1.778 5.235-3.43 7.5l3.557 4.527a1 1 0 0 1-.203 1.43l-1.894 1.36a1 1 0 0 1-1.384-.215L12 18l-2.679 3.593a1 1 0 0 1-1.39.213l-1.865-1.353a1 1 0 0 1-.203-1.422z\"/>" },
  { name: "rocket", label: "Rocket", body: "<path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\"/><path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09\"/><path d=\"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z\"/><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05\"/>" },
  { name: "rocking-chair", label: "Rocking chair", body: "<path d=\"m15 13 3.708 7.416\"/><path d=\"M3 19a15 15 0 0 0 18 0\"/><path d=\"m3 2 3.21 9.633A2 2 0 0 0 8.109 13H18\"/><path d=\"m9 13-3.708 7.416\"/>" },
  { name: "rose", label: "Rose", body: "<path d=\"M17 10h-1a4 4 0 1 1 4-4v.534\"/><path d=\"M17 6h1a4 4 0 0 1 1.42 7.74l-2.29.87a6 6 0 0 1-5.339-10.68l2.069-1.31\"/><path d=\"M4.5 17c2.8-.5 4.4 0 5.5.8s1.8 2.2 2.3 3.7c-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2\"/><path d=\"M9.77 12C4 15 2 22 2 22\"/><circle cx=\"17\" cy=\"8\" r=\"2\"/>" },
  { name: "salad", label: "Salad", body: "<path d=\"M7 21h10\"/><path d=\"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z\"/><path d=\"M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1\"/><path d=\"m13 12 4-4\"/><path d=\"M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2\"/>" },
  { name: "scan-face", label: "Scan face", body: "<path d=\"M3 7V5a2 2 0 0 1 2-2h2\"/><path d=\"M17 3h2a2 2 0 0 1 2 2v2\"/><path d=\"M21 17v2a2 2 0 0 1-2 2h-2\"/><path d=\"M7 21H5a2 2 0 0 1-2-2v-2\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"/><path d=\"M9 9h.01\"/><path d=\"M15 9h.01\"/>" },
  { name: "shell", label: "Shell", body: "<path d=\"M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44\"/>" },
  { name: "shield-alert", label: "Shield alert", body: "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"M12 8v4\"/><path d=\"M12 16h.01\"/>" },
  { name: "shield-ban", label: "Shield ban", body: "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m4.243 5.21 14.39 12.472\"/>" },
  { name: "shield-off", label: "Shield off", body: "<path d=\"m2 2 20 20\"/><path d=\"M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71\"/><path d=\"M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264\"/>" },
  { name: "shield-plus", label: "Shield plus", body: "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"M9 12h6\"/><path d=\"M12 9v6\"/>" },
  { name: "shopping-cart", label: "Shopping cart", body: "<circle cx=\"8\" cy=\"21\" r=\"1\"/><circle cx=\"19\" cy=\"21\" r=\"1\"/><path d=\"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12\"/>" },
  { name: "shrink", label: "Shrink", body: "<path d=\"m15 15 6 6m-6-6v4.8m0-4.8h4.8\"/><path d=\"M9 19.8V15m0 0H4.2M9 15l-6 6\"/><path d=\"M15 4.2V9m0 0h4.8M15 9l6-6\"/><path d=\"M9 4.2V9m0 0H4.2M9 9 3 3\"/>" },
  { name: "signal-high", label: "Signal high", body: "<path d=\"M2 20h.01\"/><path d=\"M7 20v-4\"/><path d=\"M12 20v-8\"/><path d=\"M17 20V8\"/>" },
  { name: "signal-medium", label: "Signal medium", body: "<path d=\"M2 20h.01\"/><path d=\"M7 20v-4\"/><path d=\"M12 20v-8\"/>" },
  { name: "smartphone", label: "Smartphone", body: "<rect width=\"14\" height=\"20\" x=\"5\" y=\"2\" rx=\"2\" ry=\"2\"/><path d=\"M12 18h.01\"/>" },
  { name: "smile-plus", label: "Smile plus", body: "<path d=\"M22 11v1a10 10 0 1 1-9-10\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"/><line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\"/><line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\"/><path d=\"M16 5h6\"/><path d=\"M19 2v6\"/>" },
  { name: "snail", label: "Snail", body: "<path d=\"M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0\"/><circle cx=\"10\" cy=\"13\" r=\"8\"/><path d=\"M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6\"/><path d=\"M18 3 19.1 5.2\"/><path d=\"M22 3 20.9 5.2\"/>" },
  { name: "soap-dispenser-droplet", label: "Soap dispenser droplet", body: "<path d=\"M10.5 2v4\"/><path d=\"M14 2H7a2 2 0 0 0-2 2\"/><path d=\"M19.29 14.76A6.67 6.67 0 0 1 17 11a6.6 6.6 0 0 1-2.29 3.76c-1.15.92-1.71 2.04-1.71 3.19 0 2.22 1.8 4.05 4 4.05s4-1.83 4-4.05c0-1.16-.57-2.26-1.71-3.19\"/><path d=\"M9.607 21H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h7V7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3\"/>" },
  { name: "sofa", label: "Sofa", body: "<path d=\"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3\"/><path d=\"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\"/><path d=\"M4 18v2\"/><path d=\"M20 18v2\"/><path d=\"M12 4v9\"/>" },
  { name: "spline", label: "Spline", body: "<circle cx=\"19\" cy=\"5\" r=\"2\"/><circle cx=\"5\" cy=\"19\" r=\"2\"/><path d=\"M5 17A12 12 0 0 1 17 5\"/>" },
  { name: "split", label: "Split", body: "<path d=\"M16 3h5v5\"/><path d=\"M8 3H3v5\"/><path d=\"M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3\"/><path d=\"m15 9 6-6\"/>" },
  { name: "spool", label: "Spool", body: "<path d=\"M17 13.44 4.442 17.082A2 2 0 0 0 4.982 21H19a2 2 0 0 0 .558-3.921l-1.115-.32A2 2 0 0 1 17 14.837V7.66\"/><path d=\"m7 10.56 12.558-3.642A2 2 0 0 0 19.018 3H5a2 2 0 0 0-.558 3.921l1.115.32A2 2 0 0 1 7 9.163v7.178\"/>" },
  { name: "sport-shoe", label: "Sport shoe", body: "<path d=\"m15 10.42 4.8-5.07\"/><path d=\"M19 18h3\"/><path d=\"M9.5 22 21.414 9.415A2 2 0 0 0 21.2 6.4l-5.61-4.208A1 1 0 0 0 14 3v2a2 2 0 0 1-1.394 1.906L8.677 8.053A1 1 0 0 0 8 9c-.155 6.393-2.082 9-4 9a2 2 0 0 0 0 4h14\"/>" },
  { name: "square", label: "Square", body: "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/>" },
  { name: "stone", label: "Stone", body: "<path d=\"M11.264 2.205A4 4 0 0 0 6.42 4.211l-4 8a4 4 0 0 0 1.359 5.117l6 4a4 4 0 0 0 4.438 0l6-4a4 4 0 0 0 1.576-4.592l-2-6a4 4 0 0 0-2.53-2.53z\"/><path d=\"M11.99 22 14 12l7.822 3.184\"/><path d=\"M14 12 8.47 2.302\"/>" },
  { name: "stretch-horizontal", label: "Stretch horizontal", body: "<rect width=\"20\" height=\"6\" x=\"2\" y=\"4\" rx=\"2\"/><rect width=\"20\" height=\"6\" x=\"2\" y=\"14\" rx=\"2\"/>" },
  { name: "sun-dim", label: "Sun dim", body: "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 4h.01\"/><path d=\"M20 12h.01\"/><path d=\"M12 20h.01\"/><path d=\"M4 12h.01\"/><path d=\"M17.657 6.343h.01\"/><path d=\"M17.657 17.657h.01\"/><path d=\"M6.343 17.657h.01\"/><path d=\"M6.343 6.343h.01\"/>" },
  { name: "sun-moon", label: "Sun moon", body: "<path d=\"M12 2v2\"/><path d=\"M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715\"/><path d=\"M16 12a4 4 0 0 0-4-4\"/><path d=\"m19 5-1.256 1.256\"/><path d=\"M20 12h2\"/>" },
  { name: "sunrise", label: "Sunrise", body: "<path d=\"M12 2v8\"/><path d=\"m4.93 10.93 1.41 1.41\"/><path d=\"M2 18h2\"/><path d=\"M20 18h2\"/><path d=\"m19.07 10.93-1.41 1.41\"/><path d=\"M22 22H2\"/><path d=\"m8 6 4-4 4 4\"/><path d=\"M16 18a4 4 0 0 0-8 0\"/>" },
  { name: "sunset", label: "Sunset", body: "<path d=\"M12 10V2\"/><path d=\"m4.93 10.93 1.41 1.41\"/><path d=\"M2 18h2\"/><path d=\"M20 18h2\"/><path d=\"m19.07 10.93-1.41 1.41\"/><path d=\"M22 22H2\"/><path d=\"m16 6-4 4-4-4\"/><path d=\"M16 18a4 4 0 0 0-8 0\"/>" },
  { name: "swatch-book", label: "Swatch book", body: "<path d=\"M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z\"/><path d=\"M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7\"/><path d=\"M 7 17h.01\"/><path d=\"m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8\"/>" },
  { name: "tally-4", label: "Tally 4", body: "<path d=\"M4 4v16\"/><path d=\"M9 4v16\"/><path d=\"M14 4v16\"/><path d=\"M19 4v16\"/>" },
  { name: "test-tubes", label: "Test tubes", body: "<path d=\"M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2\"/><path d=\"M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2\"/><path d=\"M3 2h7\"/><path d=\"M14 2h7\"/><path d=\"M9 16H4\"/><path d=\"M20 16h-5\"/>" },
  { name: "thermometer-sun", label: "Thermometer sun", body: "<path d=\"M12 2v2\"/><path d=\"M12 8a4 4 0 0 0-1.645 7.647\"/><path d=\"M2 12h2\"/><path d=\"M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m6.34 17.66-1.41 1.41\"/>" },
  { name: "toy-brick", label: "Toy brick", body: "<rect width=\"18\" height=\"12\" x=\"3\" y=\"8\" rx=\"1\"/><path d=\"M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3\"/><path d=\"M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3\"/>" },
  { name: "tree-deciduous", label: "Tree deciduous", body: "<path d=\"M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z\"/><path d=\"M12 19v3\"/>" },
  { name: "tree-palm", label: "Tree palm", body: "<path d=\"M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4\"/><path d=\"M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3\"/><path d=\"M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35\"/><path d=\"M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14\"/>" },
  { name: "tree-pine", label: "Tree pine", body: "<path d=\"m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z\"/><path d=\"M12 22v-3\"/>" },
  { name: "trending-down", label: "Trending down", body: "<path d=\"M16 17h6v-6\"/><path d=\"m22 17-8.5-8.5-5 5L2 7\"/>" },
  { name: "trending-up", label: "Trending up", body: "<path d=\"M16 7h6v6\"/><path d=\"m22 7-8.5 8.5-5-5L2 17\"/>" },
  { name: "trophy", label: "Trophy", body: "<path d=\"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978\"/><path d=\"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978\"/><path d=\"M18 9h1.5a1 1 0 0 0 0-5H18\"/><path d=\"M4 22h16\"/><path d=\"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z\"/><path d=\"M6 9H4.5a1 1 0 0 1 0-5H6\"/>" },
  { name: "undo-2", label: "Undo 2", body: "<path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\"/>" },
  { name: "university", label: "University", body: "<path d=\"M14 21v-3a2 2 0 0 0-4 0v3\"/><path d=\"M18 12h.01\"/><path d=\"M18 16h.01\"/><path d=\"M22 7a1 1 0 0 0-1-1h-2a2 2 0 0 1-1.143-.359L13.143 2.36a2 2 0 0 0-2.286-.001L6.143 5.64A2 2 0 0 1 5 6H3a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z\"/><path d=\"M6 12h.01\"/><path d=\"M6 16h.01\"/><circle cx=\"12\" cy=\"10\" r=\"2\"/>" },
  { name: "unlink", label: "Unlink", body: "<path d=\"m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71\"/><path d=\"m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71\"/><line x1=\"8\" x2=\"8\" y1=\"2\" y2=\"5\"/><line x1=\"2\" x2=\"5\" y1=\"8\" y2=\"8\"/><line x1=\"16\" x2=\"16\" y1=\"19\" y2=\"22\"/><line x1=\"19\" x2=\"22\" y1=\"16\" y2=\"16\"/>" },
  { name: "usb", label: "Usb", body: "<circle cx=\"10\" cy=\"7\" r=\"1\"/><circle cx=\"4\" cy=\"20\" r=\"1\"/><path d=\"M4.7 19.3 19 5\"/><path d=\"m21 3-3 1 2 2Z\"/><path d=\"M9.26 7.68 5 12l2 5\"/><path d=\"m10 14 5 2 3.5-3.5\"/><path d=\"m18 12 1-1 1 1-1 1Z\"/>" },
  { name: "user-check", label: "User check", body: "<path d=\"m16 11 2 2 4-4\"/><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/>" },
  { name: "user-round", label: "User round", body: "<circle cx=\"12\" cy=\"8\" r=\"5\"/><path d=\"M20 21a8 8 0 0 0-16 0\"/>" },
  { name: "user-star", label: "User star", body: "<path d=\"M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z\"/><path d=\"M8 15H7a4 4 0 0 0-4 4v2\"/><circle cx=\"10\" cy=\"7\" r=\"4\"/>" },
  { name: "users-round", label: "Users round", body: "<path d=\"M18 21a8 8 0 0 0-16 0\"/><circle cx=\"10\" cy=\"8\" r=\"5\"/><path d=\"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3\"/>" },
  { name: "utensils", label: "Utensils", body: "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\"/><path d=\"M7 2v20\"/><path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\"/>" },
  { name: "venetian-mask", label: "Venetian mask", body: "<path d=\"M18 11c-1.5 0-2.5.5-3 2\"/><path d=\"M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z\"/><path d=\"M6 11c1.5 0 2.5.5 3 2\"/>" },
  { name: "venus", label: "Venus", body: "<path d=\"M12 15v7\"/><path d=\"M9 19h6\"/><circle cx=\"12\" cy=\"9\" r=\"6\"/>" },
  { name: "venus-and-mars", label: "Venus and mars", body: "<path d=\"M10 20h4\"/><path d=\"M12 16v6\"/><path d=\"M17 2h4v4\"/><path d=\"m21 2-5.46 5.46\"/><circle cx=\"12\" cy=\"11\" r=\"5\"/>" },
  { name: "video", label: "Video", body: "<path d=\"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5\"/><rect x=\"2\" y=\"6\" width=\"14\" height=\"12\" rx=\"2\"/>" },
  { name: "volleyball", label: "Volleyball", body: "<path d=\"M11 7a16 16 20 0 1 10.98 4.362\"/><path d=\"M12 12a13 13 0 0 1-8.66 5\"/><path d=\"M16.83 13.634a16 16 0 0 1-9.267 7.328\"/><path d=\"M20.66 17A13 13 0 0 0 12 12a13 13 0 0 1 0-10\"/><path d=\"M8.17 15.366a16 16 0 0 1-1.713-11.69\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>" },
  { name: "volume-x", label: "Volume x", body: "<path d=\"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z\"/><line x1=\"22\" x2=\"16\" y1=\"9\" y2=\"15\"/><line x1=\"16\" x2=\"22\" y1=\"9\" y2=\"15\"/>" },
  { name: "wand-sparkles", label: "Wand sparkles", body: "<path d=\"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72\"/><path d=\"m14 7 3 3\"/><path d=\"M5 6v4\"/><path d=\"M19 14v4\"/><path d=\"M10 2v2\"/><path d=\"M7 8H3\"/><path d=\"M21 16h-4\"/><path d=\"M11 3H9\"/>" },
  { name: "wheat", label: "Wheat", body: "<path d=\"M2 22 16 8\"/><path d=\"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"/><path d=\"M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"/><path d=\"M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"/><path d=\"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z\"/><path d=\"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"/><path d=\"M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"/><path d=\"M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"/>" },
  { name: "wifi", label: "Wifi", body: "<path d=\"M12 20h.01\"/><path d=\"M2 8.82a15 15 0 0 1 20 0\"/><path d=\"M5 12.859a10 10 0 0 1 14 0\"/><path d=\"M8.5 16.429a5 5 0 0 1 7 0\"/>" },
  { name: "wine", label: "Wine", body: "<path d=\"M8 22h8\"/><path d=\"M7 10h10\"/><path d=\"M12 15v7\"/><path d=\"M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z\"/>" },
  { name: "wine-off", label: "Wine off", body: "<path d=\"M8 22h8\"/><path d=\"M7 10h3m7 0h-1.343\"/><path d=\"M12 15v7\"/><path d=\"M7.307 7.307A12.33 12.33 0 0 0 7 10a5 5 0 0 0 7.391 4.391M8.638 2.981C8.75 2.668 8.872 2.34 9 2h6c1.5 4 2 6 2 8 0 .407-.05.809-.145 1.198\"/><line x1=\"2\" x2=\"22\" y1=\"2\" y2=\"22\"/>" },
];

const ICON_BY_NAME = new Map(DESCRIPTION_ICONS.map((icon) => [icon.name, icon]));

/** The icon as a standalone <svg>, drawn in `stroke`. */
export const descriptionIconSvg = (
  icon: DescriptionIcon,
  stroke = "currentColor",
  attributes = "",
): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${attributes ? ` ${attributes}` : ""}>${icon.body}</svg>`;

/** What the editor saves for an icon: a placeholder naming it and its size. */
export const descriptionIconPlaceholder = (
  name: string,
  size: DescriptionIconSize = DEFAULT_DESCRIPTION_ICON_SIZE,
): string =>
  `<span class="${DESCRIPTION_ICON_CLASS}" data-icon="${name}"${size === DEFAULT_DESCRIPTION_ICON_SIZE ? "" : ` data-size="${size}"`} contenteditable="false">&nbsp;</span>`;

const PLACEHOLDER =
  /<span\b([^>]*\bdata-icon="[a-z0-9-]+"[^>]*)>[^<]*<\/span>/gi;

/**
 * Swaps every icon placeholder in a saved description for its drawing, at the
 * size it was given. A placeholder naming an icon that no longer exists is
 * dropped.
 */
export const renderDescriptionIcons = (html: string): string =>
  html.replace(PLACEHOLDER, (_placeholder, attributes: string) => {
    const name = /\bdata-icon="([a-z0-9-]+)"/i.exec(attributes)?.[1] ?? "";
    const icon = ICON_BY_NAME.get(name.toLowerCase());
    if (!icon) return "";

    const sizeName = /\bdata-size="([a-z0-9]+)"/i.exec(attributes)?.[1];
    const size =
      DESCRIPTION_ICON_SIZES.find((option) => option.value === sizeName) ??
      DESCRIPTION_ICON_SIZES.find(
        (option) => option.value === DEFAULT_DESCRIPTION_ICON_SIZE,
      )!;
    return descriptionIconSvg(
      icon,
      "currentColor",
      `class="${DESCRIPTION_ICON_CLASS}" width="${size.em}em" height="${size.em}em" aria-hidden="true" focusable="false" style="display:inline-block;vertical-align:${descriptionIconAlign(size.em)};flex-shrink:0"`,
    );
  });
