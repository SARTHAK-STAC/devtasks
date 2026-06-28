import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../../context/ThemeContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

const JSX_ATTR_MAP = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  rowspan: "rowSpan",
  colspan: "colSpan",
  usemap: "useMap",
  frameborder: "frameBorder",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  accesskey: "accessKey",
  enctype: "encType",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  autocomplete: "autoComplete",
  srcdoc: "srcDoc",
  srcset: "srcSet",
  noshade: "noShade",
  novalidate: "noValidate",
  allowfullscreen: "allowFullScreen",
};

const EVENT_ATTRS = new Set([
  "onclick", "ondblclick", "onmousedown", "onmouseup", "onmouseover",
  "onmouseout", "onmousemove", "onkeydown", "onkeyup", "onkeypress",
  "onchange", "oninput", "onsubmit", "onreset", "onfocus", "onblur",
  "onload", "onerror", "onscroll", "onresize", "oncontextmenu",
  "ondragstart", "ondrag", "ondragend", "ondrop",
]);

// ─── JSX Helpers ──────────────────────────────────────────────────────────────

const styleStringToObject = (styleStr) => {
  return styleStr
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [prop, ...rest] = pair.split(":");
      const value = rest.join(":").trim();
      // convert kebab-case to camelCase
      const camel = prop.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${camel}: "${value}"`;
    })
    .join(", ");
};

const mapAttr = (name, value, options) => {
  const lower = name.toLowerCase();

  // Event handlers
  if (EVENT_ATTRS.has(lower)) {
    if (!options.attrMapping) return `${name}="${value}"`;
    const camel = lower.replace(/^on/, "on").replace(/^on(.)/, (_, c) => `on${c.toUpperCase()}`);
    return `${camel}={() => ${value}}`;
  }

  // Style attribute
  if (lower === "style" && options.inlineCSS) {
    const obj = styleStringToObject(value);
    return `style={{ ${obj} }}`;
  }

  // Mapped attributes
  if (options.attrMapping && JSX_ATTR_MAP[lower]) {
    return `${JSX_ATTR_MAP[lower]}="${value}"`;
  }

  return `${name}="${value}"`;
};

// Tags whose content should stay on one line (inline elements)
const INLINE_ELEMENTS = new Set([
  "a", "abbr", "acronym", "b", "bdo", "big", "br", "cite", "code",
  "dfn", "em", "i", "img", "input", "kbd", "label", "map", "object",
  "output", "q", "samp", "select", "small", "span", "strong", "sub",
  "sup", "textarea", "time", "tt", "u", "var",
]);

const serializeAttrs = (node, options) =>
  Array.from(node.attributes)
    .map((a) => mapAttr(a.name, a.value, options))
    .join(" ");

const nodeToJSX = (node, indent, options) => {
  const pad = "  ".repeat(indent);

  // Text node
  if (node.nodeType === 3) {
    const text = node.textContent;
    if (!text.trim()) return "";
    return `${pad}${text.trim()}`;
  }

  // Element node
  if (node.nodeType === 1) {
    const tag = node.tagName.toLowerCase();
    const attrStr = serializeAttrs(node, options);
    const attrs = attrStr ? ` ${attrStr}` : "";

    // Self-closing void elements
    if (VOID_ELEMENTS.has(tag)) {
      if (options.selfClosing) return `${pad}<${tag}${attrs} />`;
      return `${pad}<${tag}${attrs}></${tag}>`;
    }

    const childNodes = Array.from(node.childNodes).filter(
      (c) => !(c.nodeType === 3 && !c.textContent.trim())
    );

    if (childNodes.length === 0) {
      return `${pad}<${tag}${attrs}></${tag}>`;
    }

    // Inline element or element with only text/inline children → single line
    const isInline = INLINE_ELEMENTS.has(tag);
    const allInline = childNodes.every(
      (c) =>
        c.nodeType === 3 ||
        (c.nodeType === 1 && INLINE_ELEMENTS.has(c.tagName.toLowerCase()))
    );

    if (isInline || allInline) {
      const inner = childNodes
        .map((c) =>
          c.nodeType === 3
            ? c.textContent.trim()
            : nodeToJSX(c, 0, options).trim()
        )
        .join("");
      return `${pad}<${tag}${attrs}>${inner}</${tag}>`;
    }

    // Block element with block children → multiline
    const children = childNodes
      .map((c) => nodeToJSX(c, indent + 1, options))
      .filter(Boolean);

    return `${pad}<${tag}${attrs}>\n${children.join("\n")}\n${pad}</${tag}>`;
  }

  return "";
};

const convertToJSX = (body, options) => {
  const children = Array.from(body.childNodes)
    .map((c) => nodeToJSX(c, 1, options))
    .filter(Boolean)
    .join("\n");

  if (!children.trim()) return "";

  if (options.wrapper === "fragment") {
    return `<>\n${children}\n</>`;
  }
  if (options.wrapper === "div") {
    return `<div>\n${children}\n</div>`;
  }
  // raw — no wrapper
  return children.trim();
};

// ─── Markdown Helpers ─────────────────────────────────────────────────────────

const nodeToMarkdown = (node, options, listDepth = 0, listType = null) => {
  if (node.nodeType === 3) {
    return node.textContent;
  }

  if (node.nodeType !== 1) return "";

  const tag = node.tagName.toLowerCase();
  const childText = (depth = listDepth, lt = listType) =>
    Array.from(node.childNodes)
      .map((c) => nodeToMarkdown(c, options, depth, lt))
      .join("");

  // Headings
  if (/^h[1-6]$/.test(tag)) {
    const level = parseInt(tag[1]);
    return `${"#".repeat(level)} ${childText().trim()}\n\n`;
  }

  // Paragraph
  if (tag === "p") return `${childText().trim()}\n\n`;

  // Bold / italic
  if (tag === "strong" || tag === "b") return `**${childText().trim()}**`;
  if (tag === "em" || tag === "i") return `_${childText().trim()}_`;

  // Code
  if (tag === "code") return `\`${childText().trim()}\``;
  if (tag === "pre") {
    const inner = node.querySelector("code");
    const lang = inner?.className?.replace("language-", "") ?? "";
    const code = (inner || node).textContent;
    return `\`\`\`${lang}\n${code.trim()}\n\`\`\`\n\n`;
  }

  // Blockquote
  if (tag === "blockquote") {
    return childText()
      .trim()
      .split("\n")
      .map((l) => `> ${l}`)
      .join("\n") + "\n\n";
  }

  // Horizontal rule
  if (tag === "hr") return `---\n\n`;

  // Line break
  if (tag === "br") return "  \n";

  // Links
  if (tag === "a") {
    const href = node.getAttribute("href") || "";
    const text = childText().trim();
    const linkOpt = options.linkFormat;
    if (linkOpt === "text-only") return text;
    return `[${text}](${href})`;
  }

  // Images
  if (tag === "img") {
    const src = node.getAttribute("src") || "";
    const alt = node.getAttribute("alt") || "";
    return `![${alt}](${src})`;
  }

  // Lists
  if (tag === "ul" || tag === "ol") {
    const items = Array.from(node.children)
      .filter((c) => c.tagName.toLowerCase() === "li")
      .map((li, i) => {
        const prefix =
          tag === "ol"
            ? `${i + 1}. `
            : options.listMarker === "*"
            ? "* "
            : "- ";
        const indent = "  ".repeat(listDepth);
        const content = Array.from(li.childNodes)
          .map((c) => nodeToMarkdown(c, options, listDepth + 1, tag))
          .join("")
          .trim();
        return `${indent}${prefix}${content}`;
      })
      .join("\n");
    return `${items}\n\n`;
  }

  // Tables
  if (tag === "table" && options.tableSupport) {
    const rows = Array.from(node.querySelectorAll("tr"));
    if (!rows.length) return "";

    const toCell = (row) =>
      Array.from(row.querySelectorAll("th, td"))
        .map((c) => c.textContent.trim().replace(/\|/g, "\\|"))
        .join(" | ");

    const headerRow = rows[0];
    const headerCells = Array.from(headerRow.querySelectorAll("th, td"));
    const header = toCell(headerRow);
    const divider = headerCells.map(() => "---").join(" | ");
    const bodyRows = rows
      .slice(1)
      .map(toCell)
      .join("\n");

    return `| ${header} |\n| ${divider} |\n${bodyRows ? `| ${bodyRows} |\n` : ""}\n`;
  }

  // div, section, article, main, etc. — just recurse
  return childText();
};

const convertToMarkdown = (body, options) => {
  const result = Array.from(body.childNodes)
    .map((c) => nodeToMarkdown(c, options))
    .join("");
  return result.replace(/\n{3,}/g, "\n\n").trim();
};

// ─── Plain Text Helpers ───────────────────────────────────────────────────────

const nodeToText = (node, options, listDepth = 0, listIndex = { n: 1 }) => {
  if (node.nodeType === 3) {
    return node.textContent;
  }
  if (node.nodeType !== 1) return "";

  const tag = node.tagName.toLowerCase();
  const childText = (d = listDepth, idx = listIndex) =>
    Array.from(node.childNodes)
      .map((c) => nodeToText(c, options, d, idx))
      .join("");

  if (/^h[1-6]$/.test(tag)) return `${childText().trim()}\n\n`;
  if (tag === "p") return `${childText().trim()}\n\n`;
  if (tag === "br") return "\n";
  if (tag === "hr") return "\n─────────────────────\n\n";

  if (tag === "li") {
    const indent = "  ".repeat(listDepth);
    const text = childText().trim();
    return `${indent}${text}`;
  }

  if (tag === "ul") {
    const items = Array.from(node.children)
      .filter((c) => c.tagName.toLowerCase() === "li")
      .map((li) => {
        const text = nodeToText(li, options, listDepth + 1, listIndex).trim();
        const ind = "  ".repeat(listDepth);
        const marker = options.listStyle;
        return `${ind}${marker} ${text}`;
      })
      .join("\n");
    return `${items}\n\n`;
  }

  if (tag === "ol") {
    let i = 1;
    const items = Array.from(node.children)
      .filter((c) => c.tagName.toLowerCase() === "li")
      .map((li) => {
        const text = nodeToText(li, options, listDepth + 1, listIndex).trim();
        const ind = "  ".repeat(listDepth);
        return `${ind}${i++}. ${text}`;
      })
      .join("\n");
    return `${items}\n\n`;
  }

  if (tag === "a") {
    const href = node.getAttribute("href") || "";
    const text = childText().trim();
    if (options.linkFormat === "inline") return `${text} (${href})`;
    return text;
  }

  if (tag === "img") {
    const alt = node.getAttribute("alt") || "";
    const src = node.getAttribute("src") || "";
    if (options.linkFormat === "inline") return alt ? `[Image: ${alt} (${src})]` : `[Image: ${src}]`;
    return alt ? `[Image: ${alt}]` : "";
  }

  if (tag === "blockquote") {
    return childText()
      .trim()
      .split("\n")
      .map((l) => `  "${l}"`)
      .join("\n") + "\n\n";
  }

  if (tag === "table") {
    const rows = Array.from(node.querySelectorAll("tr"));
    return rows
      .map((r) =>
        Array.from(r.querySelectorAll("th, td"))
          .map((c) => c.textContent.trim())
          .join("\t")
      )
      .join("\n") + "\n\n";
  }

  return childText();
};

const convertToText = (body, options) => {
  const result = Array.from(body.childNodes)
    .map((c) => nodeToText(c, options))
    .join("");
  return result.replace(/\n{3,}/g, "\n\n").trim();
};

// ─── Toggle Component ─────────────────────────────────────────────────────────

const Toggle = ({ label, checked, onChange, dark }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
        checked
          ? dark ? "bg-white" : "bg-black"
          : dark ? "bg-zinc-700" : "bg-neutral-300"
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow transition-transform duration-200 ${
          checked
            ? `translate-x-4 ${dark ? "bg-black" : "bg-white"}`
            : `translate-x-0 ${dark ? "bg-zinc-400" : "bg-white"}`
        }`}
      />
    </div>
    <span
      className={`text-xs font-medium ${
        dark ? "text-zinc-300" : "text-neutral-600"
      }`}
    >
      {label}
    </span>
  </label>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const HtmlMultiConverter = () => {
  const { dark } = useTheme();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [format, setFormat] = useState("jsx");

  // JSX options
  const [jsxWrapper, setJsxWrapper] = useState("fragment"); // fragment | div | raw
  const [inlineCSS, setInlineCSS] = useState(true);
  const [attrMapping, setAttrMapping] = useState(true);
  const [selfClosing, setSelfClosing] = useState(true);

  // Markdown options
  const [tableSupport, setTableSupport] = useState(true);
  const [mdLinkFormat, setMdLinkFormat] = useState("standard"); // standard | text-only
  const [mdListMarker, setMdListMarker] = useState("-"); // - | *

  // Plain Text options
  const [txtListStyle, setTxtListStyle] = useState("-"); // - | * | •
  const [txtLinkFormat, setTxtLinkFormat] = useState("inline"); // inline | strip

  const parseHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body;
  };

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error("Paste some HTML first");
      return;
    }
    const body = parseHTML(input);
    let result = "";

    if (format === "jsx") {
      result = convertToJSX(body, { wrapper: jsxWrapper, inlineCSS, attrMapping, selfClosing });
    } else if (format === "markdown") {
      result = convertToMarkdown(body, { tableSupport, linkFormat: mdLinkFormat, listMarker: mdListMarker });
    } else {
      result = convertToText(body, { listStyle: txtListStyle, linkFormat: txtLinkFormat });
    }

    setOutput(result);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleSample = () => {
    setInput(`<div class="container" style="color: red; margin: 10px;">
  <h1>Hello World</h1>
  <p>This is a <strong>sample</strong> paragraph with a <a href="https://example.com">link</a>.</p>
  <ul>
    <li>Item one</li>
    <li>Item two</li>
  </ul>
  <img src="photo.jpg" alt="A photo" />
  <table>
    <tr><th>Name</th><th>Age</th></tr>
    <tr><td>Alice</td><td>30</td></tr>
  </table>
</div>`);
    setOutput("");
  };

  const handleCopy = async () => {
    if (!output) { toast.error("Nothing to copy"); return; }
    try {
      await navigator.clipboard.writeText(output);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleCopyInput = async () => {
    if (!input) { toast.error("Nothing to copy"); return; }
    try {
      await navigator.clipboard.writeText(input);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const radioBase = `text-xs font-medium cursor-pointer transition-colors duration-200 ${
    dark ? "text-zinc-300" : "text-neutral-600"
  }`;

  return (
    <div
      className={`min-h-[calc(100vh-76px)] md:h-[calc(100vh-76px)] px-4 sm:px-6 py-6 transition-colors duration-300 overflow-y-auto overflow-x-hidden md:overflow-hidden relative flex flex-col justify-center ${
        dark ? "bg-zinc-950" : "bg-[#F7F7F7]"
      }`}
    >
      <title>HTML Multi Converter — DevTasks</title>
      <meta
        name="description"
        content="Convert HTML to JSX, Markdown, or Plain Text instantly in your browser."
      />

      {/* Ambient blobs */}
      <div
        className={`absolute top-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] opacity-30 transition-colors duration-500 ${
          dark ? "bg-zinc-800" : "bg-neutral-200"
        }`}
      />
      <div
        className={`absolute bottom-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] opacity-30 transition-colors duration-500 ${
          dark ? "bg-zinc-900" : "bg-neutral-100"
        }`}
      />

      <div
        className={`relative z-10 w-full max-w-5xl md:mx-auto rounded-[32px] border shadow-xl flex flex-col max-h-full md:max-h-[90vh] overflow-hidden transition-all duration-300 ${
          dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-neutral-200"
        }`}
      >
        {/* Top accent bar */}
        <div
          className={`h-2 w-full transition-colors duration-500 ${
            dark ? "bg-white" : "bg-black"
          }`}
        />

        {/* Header */}
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 flex items-center gap-3 w-full min-w-0">
          <Link
            to="/devutilities"
            className={`p-2.5 rounded-xl border transition-all duration-200 active:scale-95 flex items-center justify-center shrink-0 ${
              dark
                ? "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600"
                : "bg-white border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-350"
            }`}
            title="Back to Workspace"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1
            className={`text-xl sm:text-2xl font-black uppercase tracking-tight transition-colors duration-300 min-w-0 flex-1 ${
              dark ? "text-white" : "text-black"
            }`}
          >
            HTML Multi Converter
          </h1>
        </div>

        <div className="w-full p-5 sm:p-8 overflow-y-auto flex flex-col gap-4">

          {/* ── Format selector + action buttons ── */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Format radios */}
            <div className={`flex items-center gap-1 p-1 rounded-xl border ${
              dark ? "bg-zinc-800 border-zinc-700" : "bg-neutral-100 border-neutral-200"
            }`}>
              {["jsx", "markdown", "text"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => { setFormat(f); setOutput(""); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    format === f
                      ? dark ? "bg-white text-black shadow" : "bg-black text-white shadow"
                      : dark ? "text-zinc-400 hover:text-white" : "text-neutral-500 hover:text-black"
                  }`}
                >
                  {f === "text" ? "Plain Text" : f === "jsx" ? "JSX" : "Markdown"}
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConvert}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 active:scale-95 ${
                  dark
                    ? "bg-white text-black border-white hover:bg-zinc-200"
                    : "bg-black text-white border-black hover:bg-zinc-800"
                }`}
              >
                Convert
              </button>
              <button
                type="button"
                onClick={handleSample}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 active:scale-95 ${
                  dark
                    ? "border-zinc-600 text-zinc-300 hover:border-white hover:text-white"
                    : "border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
                }`}
              >
                Sample
              </button>
              <button
                type="button"
                onClick={handleClear}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 active:scale-95 ${
                  dark
                    ? "border-zinc-600 text-zinc-300 hover:border-white hover:text-white"
                    : "border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
                }`}
              >
                Clear
              </button>
            </div>
          </div>

          {/* ── Contextual Options Panel ── */}
          <div className={`rounded-2xl border px-4 py-3 flex flex-wrap gap-x-6 gap-y-3 transition-all duration-300 ${
            dark ? "bg-zinc-800/50 border-zinc-700" : "bg-neutral-50 border-neutral-200"
          }`}>
            <span className={`text-xs font-black uppercase tracking-widest w-full ${
              dark ? "text-zinc-500" : "text-neutral-400"
            }`}>
              {format === "jsx" ? "JSX Options" : format === "markdown" ? "Markdown Options" : "Plain Text Options"}
            </span>

            {/* JSX Options */}
            {format === "jsx" && (
              <>
                {/* Wrapper selector */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-neutral-500"}`}>Wrapper:</span>
                  {[
                    { value: "fragment", label: "<> … </>" },
                    { value: "div", label: "<div>" },
                    { value: "raw", label: "None" },
                  ].map(({ value, label }) => (
                    <label key={value} className={`flex items-center gap-1.5 cursor-pointer ${radioBase}`}>
                      <input
                        type="radio"
                        name="wrapper"
                        value={value}
                        checked={jsxWrapper === value}
                        onChange={() => setJsxWrapper(value)}
                        className="accent-current"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <Toggle label="Convert inline styles" checked={inlineCSS} onChange={setInlineCSS} dark={dark} />
                <Toggle label="Map attributes (class→className)" checked={attrMapping} onChange={setAttrMapping} dark={dark} />
                <Toggle label="Self-close void elements" checked={selfClosing} onChange={setSelfClosing} dark={dark} />
              </>
            )}

            {/* Markdown Options */}
            {format === "markdown" && (
              <>
                <Toggle label="Convert HTML tables" checked={tableSupport} onChange={setTableSupport} dark={dark} />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-neutral-500"}`}>Links:</span>
                  {[
                    { value: "standard", label: "[text](url)" },
                    { value: "text-only", label: "Text only" },
                  ].map(({ value, label }) => (
                    <label key={value} className={`flex items-center gap-1.5 cursor-pointer ${radioBase}`}>
                      <input
                        type="radio"
                        name="mdLink"
                        value={value}
                        checked={mdLinkFormat === value}
                        onChange={() => setMdLinkFormat(value)}
                        className="accent-current"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-neutral-500"}`}>List marker:</span>
                  {["-", "*"].map((m) => (
                    <label key={m} className={`flex items-center gap-1.5 cursor-pointer ${radioBase}`}>
                      <input
                        type="radio"
                        name="mdList"
                        value={m}
                        checked={mdListMarker === m}
                        onChange={() => setMdListMarker(m)}
                        className="accent-current"
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </>
            )}

            {/* Plain Text Options */}
            {format === "text" && (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-neutral-500"}`}>List prefix:</span>
                  {["-", "*", "•"].map((m) => (
                    <label key={m} className={`flex items-center gap-1.5 cursor-pointer ${radioBase}`}>
                      <input
                        type="radio"
                        name="txtList"
                        value={m}
                        checked={txtListStyle === m}
                        onChange={() => setTxtListStyle(m)}
                        className="accent-current"
                      />
                      {m}
                    </label>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium ${dark ? "text-zinc-400" : "text-neutral-500"}`}>Links:</span>
                  {[
                    { value: "inline", label: "Name (URL)" },
                    { value: "strip", label: "Text only" },
                  ].map(({ value, label }) => (
                    <label key={value} className={`flex items-center gap-1.5 cursor-pointer ${radioBase}`}>
                      <input
                        type="radio"
                        name="txtLink"
                        value={value}
                        checked={txtLinkFormat === value}
                        onChange={() => setTxtLinkFormat(value)}
                        className="accent-current"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── IO Panes ── */}
          <div className="flex flex-col md:flex-row gap-4 min-h-0">
            {/* Input */}
            <div className="group w-full flex flex-col space-y-2">
              <div className="flex items-center justify-between h-8">
                <label className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                  dark ? "text-zinc-400 group-focus-within:text-white" : "text-neutral-500 group-focus-within:text-black"
                }`}>
                  HTML Input
                </label>
                <button
                  type="button"
                  onClick={handleCopyInput}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-300 ${
                    dark
                      ? "border-zinc-600 text-zinc-400 hover:border-white hover:text-white"
                      : "border-neutral-300 text-neutral-500 hover:border-black hover:text-black"
                  }`}
                >
                  Copy
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`<div class="card">\n  <h1>Hello</h1>\n  <p>Paste your HTML here.</p>\n</div>`}
                className={`h-52 md:h-64 px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all duration-300 resize-none ${
                  dark
                    ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white"
                    : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                }`}
              />
            </div>

            {/* Output */}
            <div className="group w-full flex flex-col space-y-2">
              <div className="flex items-center justify-between h-8">
                <label className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                  dark ? "text-zinc-400 group-focus-within:text-white" : "text-neutral-500 group-focus-within:text-black"
                }`}>
                  {format === "jsx" ? "JSX" : format === "markdown" ? "Markdown" : "Plain Text"} Output
                </label>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-300 ${
                      dark
                        ? "border-zinc-600 text-zinc-400 hover:border-white hover:text-white"
                        : "border-neutral-300 text-neutral-500 hover:border-black hover:text-black"
                    }`}
                  >
                    Copy
                  </button>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Converted output will appear here…"
                className={`h-52 md:h-64 px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all duration-300 resize-none ${
                  dark
                    ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700"
                    : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400"
                }`}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HtmlMultiConverter;