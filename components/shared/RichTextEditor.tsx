"use client";

import { uploadEditorImageAction } from "@/app/actions/upload";
import {
  DESCRIPTION_FONTS,
  descriptionFontStylesheet,
  type DescriptionFont,
} from "@/lib/descriptionFonts";
import {
  DEFAULT_DESCRIPTION_ICON_SIZE,
  DESCRIPTION_ICONS,
  DESCRIPTION_ICON_CLASS,
  DESCRIPTION_ICON_SIZES,
  descriptionIconAlign,
  descriptionIconPlaceholder,
  descriptionIconSvg,
  type DescriptionIconSize,
} from "@/lib/descriptionIcons";
import {
  DESCRIPTION_BLANK_ATTRIBUTE,
  descriptionContentCss,
  type DescriptionVariant,
} from "@/lib/descriptionStyles";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  /**
   * Which description is being written. "overview" (the default) is the full
   * one: pictures, videos and text + image blocks can go into it. "summary"
   * is the short one: text only — it has no picture or video tools and drops
   * any picture pasted or dragged in. Both have the same tools for text —
   * titles, fonts, sizes, colours, icons, emoji, lists and tables — and both
   * show the text the way the storefront will.
   */
  variant?: DescriptionVariant;
}

interface EditorBlobInfo {
  blob: () => Blob;
  filename: () => string;
}

// Uploads one image, with a toast that stays up for as long as it takes —
// "Uploading image…", then "Image uploaded". On failure the toast is taken
// down and the reason thrown, for the caller to report.
const uploadFile = async (file: Blob, filename: string): Promise<string> => {
  const formData = new FormData();
  formData.set("image", file, filename);

  const toastId = toast.loading("Uploading image…");
  let res: Awaited<ReturnType<typeof uploadEditorImageAction>>;
  try {
    res = await uploadEditorImageAction(formData);
  } catch {
    toast.dismiss(toastId);
    throw "Image upload failed";
  }
  if (!res.ok || !res.data) {
    toast.dismiss(toastId);
    throw res.error || "Image upload failed";
  }
  toast.success("Image uploaded", { id: toastId });
  return res.data.url;
};

// Uploads a pasted/dropped/picked image to the backend (imgbb-hosted) and
// hands TinyMCE back the URL to embed, instead of inlining it as base64.
const handleImageUpload = (blobInfo: EditorBlobInfo): Promise<string> =>
  uploadFile(blobInfo.blob(), blobInfo.filename());

// Backs both the image dialog's "Browse" button and our own text/image
// columns dialog's image field (both use urlinput with filetype: "image").
const handleFilePicker = (
  callback: (url: string, meta?: Record<string, unknown>) => void,
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, file.name);
      callback(url, { alt: file.name.replace(/\.[^.]+$/, "") });
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Image upload failed");
    }
  };
  input.click();
};

const COLUMN_RATIO_OPTIONS = [
  { text: "Text 50% / Image 50%", value: "50-50" },
  { text: "Text 70% / Image 30%", value: "70-30" },
  { text: "Text 60% / Image 40%", value: "60-40" },
  { text: "Text 40% / Image 60%", value: "40-60" },
  { text: "Text 30% / Image 70%", value: "30-70" },
];

// Inserts a two-column block: one side a text placeholder, the other an
// uploaded image, at whatever width split the user picks. Built as a plain
// flex <div> with inline styles (rather than a table) so it survives being
// saved as raw HTML and rendered anywhere later.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openTextImageColumnsDialog = (editor: any) => {
  editor.windowManager.open({
    title: "Insert Text + Image Columns",
    body: {
      type: "panel",
      items: [
        {
          type: "selectbox",
          name: "ratio",
          label: "Column widths",
          items: COLUMN_RATIO_OPTIONS,
        },
        {
          type: "selectbox",
          name: "side",
          label: "Layout",
          items: [
            { text: "Text left, Image right", value: "text-left" },
            { text: "Image left, Text right", value: "image-left" },
          ],
        },
        {
          type: "urlinput",
          name: "imageUrl",
          label: "Image",
          filetype: "image",
        },
      ],
    },
    buttons: [
      { type: "cancel", text: "Cancel" },
      { type: "submit", text: "Insert", primary: true },
    ],
    initialData: {
      ratio: "50-50",
      side: "text-left",
      imageUrl: { value: "" },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (api: any) => {
      const data = api.getData();
      const imageUrl = String(data.imageUrl?.value || "").trim();
      if (!imageUrl) {
        editor.notificationManager.open({
          text: "Please choose an image.",
          type: "error",
        });
        return;
      }

      const [textPct, imagePct] = data.ratio.split("-").map(Number);
      const textColumn = `<div style="flex:0 0 ${textPct}%; max-width:${textPct}%; box-sizing:border-box; padding:0 8px;"><p>Write your text here…</p></div>`;
      const imageColumn = `<div style="flex:0 0 ${imagePct}%; max-width:${imagePct}%; box-sizing:border-box; padding:0 8px;"><img src="${imageUrl}" alt="" style="width:100%; height:auto; display:block; border-radius:8px;" /></div>`;

      const columns =
        data.side === "text-left"
          ? textColumn + imageColumn
          : imageColumn + textColumn;

      editor.insertContent(
        `<div style="display:flex; flex-wrap:wrap; align-items:flex-start; gap:16px; margin:16px 0;">${columns}</div><p>&nbsp;</p>`,
      );
      api.close();
    },
  });
};

// The tools, in the order they are reached for: what kind of line it is and
// how it is set, then icons, pictures (the overview only), layout and the
// rest. They sit in one row that scrolls sideways.
const toolbarFor = (variant: DescriptionVariant) =>
  [
    "blocks descriptionfont fontsizeinput",
    "bold italic underline forecolor backcolor",
    "descriptionicon descriptionemoji",
    variant === "overview" ? "image media textimagecolumns" : "",
    "bullist numlist",
    "alignleft aligncenter alignright",
    "link table",
    "removeformat",
  ]
    .filter(Boolean)
    .join(" | ");

// What the "blocks" dropdown offers: a line is normal text or a title. The
// overview, being long, gets one more size of title.
const BLOCK_FORMATS: Record<DescriptionVariant, string> = {
  overview: "Normal text=p; Big title=h2; Title=h3; Small title=h4",
  summary: "Normal text=p; Title=h3; Small title=h4",
};

// Everything that could bring a picture or a player into a text-only field,
// whichever way it arrives — typed, pasted or dropped.
const MEDIA_ELEMENTS =
  "img,picture,figure,video,audio,source,track,iframe,object,embed,svg,canvas";

// Every listed font, from Google Fonts. A font's file is only fetched once
// some text is shown in it.
const DESCRIPTION_FONTS_HREF = descriptionFontStylesheet(DESCRIPTION_FONTS);
const DESCRIPTION_FONTS_LINK_ID = "description-fonts";

// Loads the fonts into the editing area. (An @import has to come before
// every other rule.)
const DESCRIPTION_FONT_IMPORT = `@import url('${DESCRIPTION_FONTS_HREF}');`;

// The font dropdown shows each name in its own font, and the dropdown is
// part of this page rather than the editing area — so the page needs the
// fonts as well. Added once, however many editors there are.
const loadDescriptionFonts = () => {
  if (document.getElementById(DESCRIPTION_FONTS_LINK_ID)) return;
  const link = document.createElement("link");
  link.id = DESCRIPTION_FONTS_LINK_ID;
  link.rel = "stylesheet";
  link.href = DESCRIPTION_FONTS_HREF;
  document.head.appendChild(link);
};

// An emoji put in from the emoji dialog is wrapped in a span of this class,
// so it can be clicked and resized like an icon.
const EMOJI_CLASS = "sd-emoji";

// How an icon placeholder looks while it is being edited: a square the size
// of the text, cut to the icon's outline and filled with the text's colour —
// so an icon in a title is as big and as dark as the title.
const ICON_CONTENT_STYLE = [
  `.${DESCRIPTION_ICON_CLASS} { display: inline-block; position: relative; width: 1.2em; height: 1.2em; vertical-align: -0.22em; overflow: hidden; line-height: 1; white-space: nowrap; cursor: default; }`,
  `.${DESCRIPTION_ICON_CLASS}::before { content: ""; position: absolute; inset: 0; background-color: currentColor; -webkit-mask: var(--sd-icon) center / contain no-repeat; mask: var(--sd-icon) center / contain no-repeat; }`,
  `.${EMOJI_CLASS} { cursor: default; }`,
  ...DESCRIPTION_ICON_SIZES.map(
    (size) =>
      `.${DESCRIPTION_ICON_CLASS}[data-size="${size.value}"] { width: ${size.em}em; height: ${size.em}em; vertical-align: ${descriptionIconAlign(size.em)}; }`,
  ),
  ...DESCRIPTION_ICONS.map(
    (icon) =>
      `.${DESCRIPTION_ICON_CLASS}[data-icon="${icon.name}"] { --sd-icon: url("data:image/svg+xml,${encodeURIComponent(descriptionIconSvg(icon, "#000"))}"); }`,
  ),
].join("\n");

const editorIconName = (name: string) => `sd-${name}`;

const iconSizeButtonName = (size: DescriptionIconSize) => `sdiconsize${size}`;
// What the size buttons read, smallest to biggest.
const ICON_SIZE_BUTTON_TEXT: Record<DescriptionIconSize, string> = {
  sm: "S",
  md: "M",
  lg: "L",
  xl: "XL",
  "2xl": "2XL",
};

// The size the icon dialog opens on: whichever was used last, so a run of
// icons comes out the same size without choosing it each time.
let lastIconSize: DescriptionIconSize = DEFAULT_DESCRIPTION_ICON_SIZE;

const iconChoices = (pattern: string) => {
  const query = pattern.trim().toLowerCase();
  const matches = query
    ? DESCRIPTION_ICONS.filter(
        (icon) =>
          icon.label.toLowerCase().includes(query) ||
          icon.name.replace(/-/g, " ").includes(query),
      )
    : DESCRIPTION_ICONS;
  return matches.map((icon) => ({
    value: icon.name,
    text: icon.label,
    icon: editorIconName(icon.name),
  }));
};

// The icon picker: a wide dialog with a search box, a size choice and every
// icon in a grid. Clicking an icon drops it in at the cursor.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openDescriptionIconDialog = (editor: any) => {
  const dialog = editor.windowManager.open({
    title: "Insert icon",
    size: "medium",
    body: {
      type: "panel",
      items: [
        {
          type: "grid",
          columns: 2,
          items: [
            {
              type: "input",
              name: "pattern",
              label: "Search",
              placeholder: "e.g. delivery, leaf, secure",
            },
            {
              type: "listbox",
              name: "size",
              label: "Icon size",
              items: DESCRIPTION_ICON_SIZES.map((size) => ({
                text: size.label,
                value: size.value,
              })),
            },
          ],
        },
        { type: "collection", name: "results", label: "Icons" },
      ],
    },
    buttons: [{ type: "cancel", text: "Close", primary: true }],
    initialData: {
      pattern: "",
      size: lastIconSize,
      results: iconChoices(""),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (api: any, details: { name: string }) => {
      if (details.name !== "pattern") return;
      api.setData({ results: iconChoices(String(api.getData().pattern ?? "")) });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAction: (api: any, details: { name: string; value: string }) => {
      if (details.name !== "results") return;
      lastIconSize = api.getData().size as DescriptionIconSize;
      // A space follows the icon, so the text typed next doesn't touch it.
      editor.insertContent(
        `${descriptionIconPlaceholder(details.value, lastIconSize)}&nbsp;`,
      );
      api.close();
    },
  });
  dialog.focus("pattern");
};

interface EditorEmoji {
  char: string;
  title: string;
  keywords?: string[];
  category: string;
}

const ALL_EMOJI_CATEGORIES = "all";
const EMOJI_SEARCH_DELAY_MS = 200;

// An emoji is text, so its size is a font size — worked out from the icon
// sizes, so an emoji and an icon of the same size come out about as big.
const emojiStyles = (size: DescriptionIconSize) => {
  if (size === DEFAULT_DESCRIPTION_ICON_SIZE) {
    return { "font-size": "", "line-height": "", "vertical-align": "" };
  }
  const base = DESCRIPTION_ICON_SIZES.find(
    (option) => option.value === DEFAULT_DESCRIPTION_ICON_SIZE,
  )!;
  const chosen = DESCRIPTION_ICON_SIZES.find(
    (option) => option.value === size,
  )!;
  return {
    "font-size": `${Math.round((chosen.em / base.em) * 100) / 100}em`,
    // A big emoji shouldn't push its line apart from the ones around it.
    "line-height": "1",
    "vertical-align": chosen.em > base.em ? "middle" : "",
  };
};

const emojiHtml = (char: string, size: DescriptionIconSize) => {
  const style = Object.entries(emojiStyles(size))
    .filter(([, value]) => value)
    .map(([property, value]) => `${property}: ${value};`)
    .join(" ");
  return `<span class="${EMOJI_CLASS}"${style ? ` style="${style}"` : ""} contenteditable="false">${char}</span>`;
};

// The emoji picker — the same layout as the icon one: search, category and
// size across the top, every emoji in a grid below.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openEmojiDialog = async (editor: any) => {
  let emojis: EditorEmoji[] = [];
  try {
    emojis = await editor.plugins.emoticons.getAllEmojis();
  } catch {
    editor.notificationManager.open({
      text: "Could not load the emoji list.",
      type: "error",
    });
    return;
  }

  const categories = [...new Set(emojis.map((emoji) => emoji.category))];
  const emojiChoices = (pattern: string, category: string) => {
    const query = pattern.trim().toLowerCase();
    return emojis
      .filter(
        (emoji) =>
          (category === ALL_EMOJI_CATEGORIES || emoji.category === category) &&
          (!query ||
            emoji.title.toLowerCase().includes(query) ||
            (emoji.keywords ?? []).some((keyword) =>
              keyword.toLowerCase().includes(query),
            )),
      )
      .map((emoji) => ({
        value: emoji.char,
        text: emoji.title,
        icon: emoji.char,
      }));
  };

  let searchTimer: ReturnType<typeof setTimeout> | undefined;
  const dialog = editor.windowManager.open({
    title: "Insert emoji",
    size: "medium",
    body: {
      type: "panel",
      items: [
        {
          type: "grid",
          columns: 3,
          items: [
            {
              type: "input",
              name: "pattern",
              label: "Search",
              placeholder: "e.g. heart, flower, star",
            },
            {
              type: "listbox",
              name: "category",
              label: "Category",
              items: [
                { text: "All", value: ALL_EMOJI_CATEGORIES },
                ...categories.map((category) => ({
                  text: category,
                  value: category,
                })),
              ],
            },
            {
              type: "listbox",
              name: "size",
              label: "Emoji size",
              items: DESCRIPTION_ICON_SIZES.map((size) => ({
                text: size.label,
                value: size.value,
              })),
            },
          ],
        },
        { type: "collection", name: "results", label: "Emojis" },
      ],
    },
    buttons: [{ type: "cancel", text: "Close", primary: true }],
    initialData: {
      pattern: "",
      category: ALL_EMOJI_CATEGORIES,
      size: lastIconSize,
      results: emojiChoices("", ALL_EMOJI_CATEGORIES),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (api: any, details: { name: string }) => {
      if (details.name !== "pattern" && details.name !== "category") return;
      // The list is long — wait for a pause in the typing before redrawing it.
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        const data = api.getData();
        api.setData({
          results: emojiChoices(
            String(data.pattern ?? ""),
            String(data.category ?? ALL_EMOJI_CATEGORIES),
          ),
        });
      }, EMOJI_SEARCH_DELAY_MS);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAction: (api: any, details: { name: string; value: string }) => {
      if (details.name !== "results") return;
      lastIconSize = api.getData().size as DescriptionIconSize;
      editor.insertContent(`${emojiHtml(details.value, lastIconSize)}&nbsp;`);
      api.close();
    },
    onClose: () => clearTimeout(searchTimer),
  });
  dialog.focus("pattern");
};

// Adds the "Icon" and "Emoji" buttons, and the S / M / L… bar that appears
// over an icon or an emoji when it is clicked, for making it smaller or
// bigger.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registerDescriptionIcons = (editor: any) => {
  DESCRIPTION_ICONS.forEach((icon) => {
    // The outline is set on a group inside the <svg>: the editor's own
    // stylesheet gives every toolbar <svg> a solid fill.
    editor.ui.registry.addIcon(
      editorIconName(icon.name),
      `<svg width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon.body}</g></svg>`,
    );
  });

  editor.ui.registry.addButton("descriptionicon", {
    icon: editorIconName("sparkles"),
    text: "Icon",
    tooltip: "Insert icon",
    onAction: () => openDescriptionIconDialog(editor),
  });

  editor.ui.registry.addButton("descriptionemoji", {
    icon: "emoji",
    text: "Emoji",
    tooltip: "Insert emoji",
    onAction: () => void openEmojiDialog(editor),
  });

  const isIcon = (node: Element | null | undefined): node is Element =>
    Boolean(node?.classList?.contains(DESCRIPTION_ICON_CLASS));
  const isEmoji = (node: Element | null | undefined): node is Element =>
    Boolean(node?.classList?.contains(EMOJI_CLASS));

  DESCRIPTION_ICON_SIZES.forEach((size) => {
    editor.ui.registry.addButton(iconSizeButtonName(size.value), {
      text: ICON_SIZE_BUTTON_TEXT[size.value],
      tooltip: size.label,
      onAction: () => {
        const node: Element | null = editor.selection.getNode();
        if (!isIcon(node) && !isEmoji(node)) return;
        editor.undoManager.transact(() => {
          if (isEmoji(node)) {
            editor.dom.setStyles(node, emojiStyles(size.value));
            return;
          }
          editor.dom.setAttrib(
            node,
            "data-size",
            size.value === DEFAULT_DESCRIPTION_ICON_SIZE ? null : size.value,
          );
        });
        lastIconSize = size.value;
        editor.nodeChanged();
      },
    });
  });

  editor.ui.registry.addContextToolbar("descriptioniconsize", {
    predicate: (node: Element) => isIcon(node) || isEmoji(node),
    items: DESCRIPTION_ICON_SIZES.map((size) =>
      iconSizeButtonName(size.value),
    ).join(" "),
    position: "node",
    scope: "node",
  });
};

const FONT_BUTTON_TEXT = "Font";

const fontFamilyValue = (font: DescriptionFont) =>
  `${font.name}, ${font.fallback}`;

// The listed font the text at the cursor is set in, or "" if it is in none
// of them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentFontName = (editor: any): string => {
  const first = String(editor.queryCommandValue("FontName") || "")
    .split(",")[0]
    .replace(/['"]/g, "")
    .trim()
    .toLowerCase();
  return (
    DESCRIPTION_FONTS.find((font) => font.name.toLowerCase() === first)?.name ??
    ""
  );
};

// Adds the font dropdown: every description font, each shown in its own
// face, with a search box over the list. The button reads the font of the
// text the cursor is in.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registerFontMenu = (editor: any) => {
  editor.ui.registry.addMenuButton("descriptionfont", {
    text: FONT_BUTTON_TEXT,
    tooltip: "Font",
    search: { placeholder: "Search fonts" },
    fetch: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (items: any[]) => void,
      fetchContext?: { pattern?: string },
    ) => {
      const query = (fetchContext?.pattern ?? "").trim().toLowerCase();
      const current = currentFontName(editor);
      const matches = query
        ? DESCRIPTION_FONTS.filter((font) =>
            font.name.toLowerCase().includes(query),
          )
        : DESCRIPTION_FONTS;
      callback(
        matches.map((font) => ({
          type: "togglemenuitem",
          text: font.name,
          active: font.name === current,
          // Draws the name in the font itself.
          meta: {
            style: {
              tag: "span",
              styles: { "font-family": fontFamilyValue(font) },
            },
          },
          onAction: () =>
            editor.execCommand("FontName", false, fontFamilyValue(font)),
        })),
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSetup: (api: any) => {
      const showCurrent = () =>
        api.setText(currentFontName(editor) || FONT_BUTTON_TEXT);
      editor.on("NodeChange", showCurrent);
      return () => editor.off("NodeChange", showCurrent);
    },
  });
};

// How far the mouse has to move, in px, before a press on the toolbar counts
// as dragging it rather than clicking a tool.
const TOOLBAR_DRAG_THRESHOLD = 5;

// Lets the one-row toolbar be scrolled by pressing on it and dragging
// sideways, as well as with its scrollbar. A press that doesn't move still
// clicks the tool under it.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const enableToolbarDragScroll = (editor: any) => {
  editor.on("init", () => {
    const toolbar: HTMLElement | null = editor
      .getContainer()
      ?.querySelector(".tox-toolbar--scrolling");
    if (!toolbar) return;

    let startX = 0;
    let startScroll = 0;
    let pressed = false;
    let dragging = false;

    // Swallows the click a drag ends with, so letting go over a tool doesn't
    // also press it.
    const swallowClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!pressed) return;
      const moved = event.clientX - startX;
      if (!dragging && Math.abs(moved) < TOOLBAR_DRAG_THRESHOLD) return;
      if (!dragging) {
        dragging = true;
        toolbar.style.cursor = "grabbing";
        toolbar.style.userSelect = "none";
      }
      event.preventDefault();
      toolbar.scrollLeft = startScroll - moved;
    };

    const onMouseUp = () => {
      if (!pressed) return;
      pressed = false;
      if (!dragging) return;
      dragging = false;
      toolbar.style.cursor = "";
      toolbar.style.userSelect = "";
      toolbar.addEventListener("click", swallowClick, true);
      // The click, if there is one, comes right after this mouseup.
      setTimeout(() => toolbar.removeEventListener("click", swallowClick, true));
    };

    const onMouseDown = (event: MouseEvent) => {
      // Left button only, and not in the size box — dragging there selects
      // its number.
      if (event.button !== 0) return;
      if ((event.target as HTMLElement | null)?.closest("input, textarea")) {
        return;
      }
      // Nothing to scroll: every tool already fits.
      if (toolbar.scrollWidth <= toolbar.clientWidth) return;
      pressed = true;
      dragging = false;
      startX = event.clientX;
      startScroll = toolbar.scrollLeft;
    };

    toolbar.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    editor.on("remove", () => {
      toolbar.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    });
  });
};

// Marks a picture or video that is still loading. TinyMCE leaves every
// data-mce-* attribute out of the saved text, so the mark never gets saved.
const MEDIA_LOADING_ATTRIBUTE = "data-mce-loading";
// A player inside a frame doesn't always say when it has loaded; after this
// long the mark comes off regardless.
const MEDIA_LOADING_TIMEOUT_MS = 15000;

// How something still loading looks in the text: a pale box with a light
// sweeping across it, in place of an empty gap.
const MEDIA_LOADING_STYLE = [
  `[${MEDIA_LOADING_ATTRIBUTE}] { min-width: 140px; min-height: 90px; border-radius: 8px; outline: 1px dashed #cbd5e1; background: linear-gradient(90deg, #eef1f5 25%, #f8fafc 37%, #eef1f5 63%) 0 0 / 400% 100%; animation: media-loading 1.2s ease-in-out infinite; }`,
  "@keyframes media-loading { from { background-position: 100% 0; } to { background-position: 0 0; } }",
].join("\n");

// Shows every picture and video in the text as loading until it has arrived —
// one just inserted by link or upload, and the ones already there when a
// product is opened. A picture that fails to load is reported.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trackMediaLoading = (editor: any) => {
  // Each element with the address it was last seen with: a new address on
  // the same element (an upload finishing, a link edited) is a new load.
  const watched = new WeakMap<Element, string>();
  // Failures are only reported for what the author adds, not for what was
  // already in the text when the editor opened.
  let reportFailures = false;

  const watch = (element: HTMLElement) => {
    const source = element.getAttribute("src") ?? "";
    if (watched.get(element) === source) return;
    watched.set(element, source);

    // Compared by tag name: these belong to the editing area's own window.
    const tag = element.tagName;
    if (tag === "IMG" && (element as HTMLImageElement).complete) return;
    if (tag === "VIDEO" && (element as HTMLVideoElement).readyState >= 1) {
      return;
    }

    const loadEvent = tag === "VIDEO" ? "loadedmetadata" : "load";
    const finish = () => {
      clearTimeout(timer);
      element.removeEventListener(loadEvent, finish);
      element.removeEventListener("error", fail);
      element.removeAttribute(MEDIA_LOADING_ATTRIBUTE);
    };
    const fail = () => {
      finish();
      if (!reportFailures) return;
      toast.error(
        tag === "IMG"
          ? "That image couldn't be loaded — check the link, or upload it again."
          : "That video couldn't be loaded — check the link.",
      );
    };
    const timer = setTimeout(finish, MEDIA_LOADING_TIMEOUT_MS);
    element.setAttribute(MEDIA_LOADING_ATTRIBUTE, "true");
    element.addEventListener(loadEvent, finish);
    element.addEventListener("error", fail);
  };

  const scan = () => {
    editor
      .getBody()
      ?.querySelectorAll("img, iframe, video")
      .forEach((element: HTMLElement) => watch(element));
  };

  editor.on("init", () => {
    scan();
    setTimeout(() => {
      reportFailures = true;
    });
  });
  editor.on("SetContent NodeChange", scan);
};

// While it is being edited, a video sits inside a wrapper TinyMCE puts round
// it (so a click selects it instead of playing it). The wrapper is made a
// full-width block, so the video in it can fill the width as it will on the
// storefront.
const MEDIA_PREVIEW_STYLE = [
  "body .mce-preview-object { display: block; margin: 12px 0; border: 0; line-height: 0; }",
  "body .mce-preview-object :is(iframe, video) { margin: 0; }",
].join("\n");

// Marks the blank lines in the text — paragraphs and titles with nothing in
// them — so they are drawn shorter than a full line, as the storefront draws
// them. The one the cursor is in is left full height, so the line being
// typed on doesn't change size under the cursor.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const markBlankLines = (editor: any) => {
  const isBlank = (block: HTMLElement) =>
    (block.textContent ?? "").replace(/[\s\u00a0\ufeff]/g, "") === "" &&
    !block.querySelector("img, iframe, video, table, span[data-icon]");

  const scan = () => {
    const body: HTMLElement | null = editor.getBody();
    if (!body) return;
    const current: HTMLElement | null =
      editor.selection?.getNode()?.closest?.("p, h1, h2, h3, h4, h5, h6") ??
      null;
    body
      .querySelectorAll<HTMLElement>("p, h1, h2, h3, h4, h5, h6")
      .forEach((block) => {
        const blank = block !== current && isBlank(block);
        if (blank === block.hasAttribute(DESCRIPTION_BLANK_ATTRIBUTE)) return;
        if (blank) block.setAttribute(DESCRIPTION_BLANK_ATTRIBUTE, "true");
        else block.removeAttribute(DESCRIPTION_BLANK_ATTRIBUTE);
      });
  };

  editor.on("init SetContent NodeChange input", scan);
};

// Adds the "text + image columns" button (the overview only).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registerTextImageColumns = (editor: any) => {
  editor.ui.registry.addIcon(
    "textImageColumns",
    '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Zm2 1v12h4V6H5Z" fill-rule="evenodd"/><path d="M13 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V5Z"/></svg>',
  );
  editor.ui.registry.addButton("textimagecolumns", {
    icon: "textImageColumns",
    tooltip: "Insert text + image columns",
    onAction: () => openTextImageColumnsDialog(editor),
  });
};

// Self-hosted TinyMCE — assets are copied into public/tinymce on `npm install`
// (see scripts/copy-tinymce.mjs), so this needs no Tiny Cloud API key and
// shows no eval-mode nag banner.
const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  height = 320,
  variant = "overview",
}: RichTextEditorProps) => {
  useEffect(() => {
    loadDescriptionFonts();
  }, []);

  const allowMedia = variant === "overview";

  // TinyMCE reads its settings once, when the editor is created.
  const mediaInit = allowMedia
    ? {
        // Images upload through handleImageUpload instead of being inlined
        // as base64, so saved content stays small.
        images_upload_handler: handleImageUpload,
        automatic_uploads: true,
        // Video: pasting/inserting a YouTube/Vimeo/mp4 URL via the "media"
        // toolbar button embeds a player — no file hosting needed for that.
        media_live_embeds: true,
        // A picture or video goes in without a width and height of its own,
        // so it takes the standard size: the full width of the text. (Drag a
        // picture's corner afterwards to give it a size of its own.)
        image_dimensions: false,
        media_dimensions: false,
        // Powers the "Browse" button on any image urlinput field (the
        // built-in image dialog's Source field, and our columns dialog's
        // Image field).
        file_picker_types: "image",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        file_picker_callback: (callback: any) => handleFilePicker(callback),
      }
    : {
        // Text only: a pasted or dropped picture is left out rather than
        // inlined, and any media tag in the content is stripped.
        paste_data_images: false,
        invalid_elements: MEDIA_ELEMENTS,
      };

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: false,
        statusbar: false,
        placeholder,
        // "emoticons" is loaded for its emoji list; the Emoji button is ours.
        plugins: [
          "lists",
          "link",
          "autolink",
          "table",
          "emoticons",
          ...(allowMedia ? ["image", "media"] : []),
        ],
        toolbar: toolbarFor(variant),
        // One row of tools, most used first; the rest are a sideways scroll
        // away rather than hidden behind a "more" button.
        toolbar_mode: "scrolling",
        block_formats: BLOCK_FORMATS[variant],
        // The size box steps in pixels: − and + either side of the number.
        font_size_input_default_unit: "px",
        // The text is drawn with the storefront's own rules for this kind of
        // description, so it is written the way it will be read.
        content_style: [
          DESCRIPTION_FONT_IMPORT,
          // (Scoped to the editing area's own body class, which lets these
          // rules outrank TinyMCE's built-in ones for the same elements.)
          descriptionContentCss("body.mce-content-body", variant),
          ICON_CONTENT_STYLE,
          MEDIA_LOADING_STYLE,
          MEDIA_PREVIEW_STYLE,
        ].join("\n"),
        branding: false,
        // Table toolbar/menu shown when a table cell is focused.
        table_toolbar:
          "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
        // An icon is one piece — it can't be typed into — but colouring the
        // text around it colours it too.
        format_noneditable_selector: `span.${DESCRIPTION_ICON_CLASS}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setup: (editor: any) => {
          registerFontMenu(editor);
          registerDescriptionIcons(editor);
          markBlankLines(editor);
          if (allowMedia) {
            registerTextImageColumns(editor);
            trackMediaLoading(editor);
          }
          enableToolbarDragScroll(editor);
        },
        ...mediaInit,
      }}
    />
  );
};

export default RichTextEditor;
