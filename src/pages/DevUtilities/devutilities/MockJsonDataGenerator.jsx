import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

// ─── Data Generators ────────────────────────────────────────────────────────

const firstNames = ["James","Oliver","Liam","Noah","Ethan","Lucas","Mason","Logan","Aiden","Jackson","Sophia","Emma","Olivia","Ava","Isabella","Mia","Charlotte","Amelia","Harper","Evelyn"];
const lastNames  = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Wilson","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Moore","Young","Allen"];
const domains    = ["gmail.com","yahoo.com","outlook.com","icloud.com","proton.me","hotmail.com","dev.io","mail.com"];
const tlds       = ["com","net","org","io","dev","app"];
const streets    = ["Main St","Oak Ave","Maple Dr","Cedar Ln","Park Blvd","Elm St","River Rd","Lake Dr","Pine Ave","Hill Rd"];
const cities     = ["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","Austin"];
const countries  = ["USA","UK","Canada","Australia","Germany","France","Japan","India","Brazil","Spain"];

const rand  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pad   = (n) => String(n).padStart(2, "0");

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const randomDate = (start = new Date(2000, 0, 1), end = new Date()) => {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const generators = {
  uuid:        () => uuid(),
  id:          () => randInt(1000, 99999),
  firstName:   () => rand(firstNames),
  lastName:    () => rand(lastNames),
  fullName:    () => `${rand(firstNames)} ${rand(lastNames)}`,
  email:       () => {
    const fn = rand(firstNames).toLowerCase();
    const ln = rand(lastNames).toLowerCase();
    return `${fn}.${ln}${randInt(1,99)}@${rand(domains)}`;
  },
  username:    () => {
    const fn = rand(firstNames).toLowerCase();
    const ln = rand(lastNames).toLowerCase();
    return `${fn}_${ln}${randInt(10, 999)}`;
  },
  phone:       () => `+1-${randInt(200,999)}-${randInt(100,999)}-${randInt(1000,9999)}`,
  date:        () => randomDate(),
  randomNumber:() => randInt(1, 100000),
  boolean:     () => Math.random() > 0.5,
  address:     () => `${randInt(1, 9999)} ${rand(streets)}, ${rand(cities)}`,
  city:        () => rand(cities),
  country:     () => rand(countries),
  url:         () => `https://www.${rand(lastNames).toLowerCase()}${rand(tlds) !== "com" ? "." + rand(tlds) : ".com"}`,
  color:       () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6,"0")}`,
};

const FIELD_TYPES = [
  { value: "uuid",         label: "UUID" },
  { value: "id",           label: "ID (Number)" },
  { value: "firstName",    label: "First Name" },
  { value: "lastName",     label: "Last Name" },
  { value: "fullName",     label: "Full Name" },
  { value: "email",        label: "Email" },
  { value: "username",     label: "Username" },
  { value: "phone",        label: "Phone Number" },
  { value: "date",         label: "Date" },
  { value: "randomNumber", label: "Random Number" },
  { value: "boolean",      label: "Boolean" },
  { value: "address",      label: "Address" },
  { value: "city",         label: "City" },
  { value: "country",      label: "Country" },
  { value: "url",          label: "URL" },
  { value: "color",        label: "Color (Hex)" },
];

const ROW_OPTIONS = [10, 25, 50, 100, 500];

const DEFAULT_FIELDS = [
  { id: 1, key: "id",        type: "uuid" },
  { id: 2, key: "firstName", type: "firstName" },
  { id: 3, key: "lastName",  type: "lastName" },
  { id: 4, key: "email",     type: "email" },
  { id: 5, key: "username",  type: "username" },
];

// ─── Syntax Highlighter ──────────────────────────────────────────────────────

const highlight = (json) => {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "json-number";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "json-key" : "json-string";
        } else if (/true|false/.test(match)) {
          cls = "json-boolean";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const MockJsonGenerator = () => {
  const { dark } = useTheme();

  const [fields, setFields]     = useState(DEFAULT_FIELDS);
  const [rowCount, setRowCount] = useState(10);
  const [output, setOutput]     = useState("");
  const [copied, setCopied]     = useState(false);
  const [nextId, setNextId]     = useState(6);

  const theme = {
    light: {
      wrapper:   "bg-[#F8F9FA] text-zinc-900",
      heading:   "text-zinc-900",
      subtext:   "text-zinc-500",
      card:      "bg-white border-zinc-200/85",
      input:     "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none",
      select:    "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-zinc-400 focus:outline-none",
      deleteBtn: "text-zinc-400 hover:text-red-500",
      addBtn:    "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200",
      primaryBtn:"bg-zinc-900 text-white hover:bg-zinc-700",
      outlineBtn:"bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-100",
      rowPill:   "border-zinc-200 text-zinc-600 hover:bg-zinc-100",
      rowActive: "bg-zinc-900 text-white border-zinc-900",
      codeBg:    "bg-zinc-950",
      backLink:  "bg-white border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-350",
    },
    dark: {
      wrapper:   "bg-[#090A0F] text-zinc-100",
      heading:   "text-zinc-100",
      subtext:   "text-zinc-500",
      card:      "bg-zinc-900/50 border-zinc-800/85",
      input:     "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none",
      select:    "bg-zinc-900 border-zinc-700 text-zinc-100 focus:border-zinc-500 focus:outline-none",
      deleteBtn: "text-zinc-600 hover:text-red-400",
      addBtn:    "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700",
      primaryBtn:"bg-white text-zinc-900 hover:bg-zinc-200",
      outlineBtn:"bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700",
      rowPill:   "border-zinc-700 text-zinc-400 hover:bg-zinc-800",
      rowActive: "bg-white text-zinc-900 border-white",
      codeBg:    "bg-zinc-950",
      backLink:  "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600",
    },
  };

  const t = dark ? theme.dark : theme.light;

  // Field management
  const addField = () => {
    setFields([...fields, { id: nextId, key: `field${nextId}`, type: "firstName" }]);
    setNextId(nextId + 1);
  };

  const removeField = (id) => {
    if (fields.length === 1) return;
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id, prop, value) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [prop]: value } : f)));
  };

  // Generation
  const generate = () => {
    const data = Array.from({ length: rowCount }, () => {
      const obj = {};
      fields.forEach(({ key, type }) => {
        const k = key.trim() || "field";
        obj[k] = generators[type] ? generators[type]() : null;
      });
      return obj;
    });
    setOutput(JSON.stringify(data, null, 2));
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `mock-data-${rowCount}-rows.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rowBytes = output ? new Blob([output]).size : 0;
  const sizeLabel = rowBytes > 1024
    ? `${(rowBytes / 1024).toFixed(1)} KB`
    : `${rowBytes} B`;

  return (
    <div className={`min-h-screen ${t.wrapper} px-6 py-10`}>
      <title>Mock JSON Generator — DevTasks</title>
      <meta name="description" content="Generate arrays of mock JSON data for testing APIs and applications." />

      {/* Syntax highlight styles */}
      <style>{`
        .json-key     { color: #7dd3fc; }
        .json-string  { color: #86efac; }
        .json-number  { color: #fbbf24; }
        .json-boolean { color: #f472b6; }
        .json-null    { color: #94a3b8; }
      `}</style>

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/devutilities"
            className={`p-2.5 rounded-xl border transition-all duration-200 active:scale-95 flex items-center justify-center shrink-0 ${t.backLink}`}
            title="Back to Workspace"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className={`text-2xl font-semibold tracking-tight ${t.heading}`}>
              Mock JSON Generator
            </h1>
            <p className={`mt-1 text-sm ${t.subtext}`}>
              Build a schema, set a row count, and generate instant mock data.
            </p>
          </div>
        </div>

        <div className="space-y-5">

          {/* Schema Builder */}
          <div className={`rounded-3xl border ${t.card} p-6`}>
            <p className={`text-xs uppercase tracking-widest font-medium mb-4 ${t.subtext}`}>
              Schema Fields
            </p>

            <div className="space-y-2">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center gap-2">
                  {/* Key name */}
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => updateField(field.id, "key", e.target.value)}
                    placeholder="field name"
                    className={`w-36 px-3 py-2 rounded-xl border text-sm font-mono ${t.input}`}
                  />
                  {/* Type selector */}
                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, "type", e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl border text-sm ${t.select}`}
                  >
                    {FIELD_TYPES.map((ft) => (
                      <option key={ft.value} value={ft.value}>{ft.label}</option>
                    ))}
                  </select>
                  {/* Delete */}
                  <button
                    onClick={() => removeField(field.id)}
                    className={`p-2 rounded-lg transition-colors ${t.deleteBtn}`}
                    title="Remove field"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addField}
              className={`mt-4 w-full py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-95 ${t.addBtn}`}
            >
              + Add Field
            </button>
          </div>

          {/* Row Count + Generate */}
          <div className={`rounded-3xl border ${t.card} p-6`}>
            <p className={`text-xs uppercase tracking-widest font-medium mb-4 ${t.subtext}`}>
              Row Count
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {ROW_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setRowCount(n)}
                  className={`px-5 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    rowCount === n ? t.rowActive : t.rowPill
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={generate}
              className={`w-full py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 ${t.primaryBtn}`}
            >
              Generate {rowCount} rows
            </button>
          </div>

          {/* Output */}
          {output && (
            <div className={`rounded-3xl border ${t.card} p-6`}>
              {/* Output header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-xs uppercase tracking-widest font-medium ${t.subtext}`}>
                    Output
                  </p>
                  <p className={`text-xs mt-0.5 ${t.subtext}`}>
                    {rowCount} objects · {fields.length} fields · {sizeLabel}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 ${
                      copied
                        ? "bg-green-600 text-white border-green-600"
                        : t.outlineBtn
                    }`}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                  <button
                    onClick={downloadJson}
                    className={`px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 ${t.primaryBtn} border-transparent`}
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Code block */}
              <div className={`rounded-2xl overflow-hidden ${t.codeBg}`}>
                <pre
                  className="text-xs font-mono p-4 overflow-auto max-h-96 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlight(output) }}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MockJsonGenerator;