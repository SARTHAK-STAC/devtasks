import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../../context/ThemeContext";

// Lightweight JSONPath evaluator (pure JS, no dependencies)
// Supports: $, .key, ..key (recursive), [*], [n], [n,m], [n:m], ['key'], ?(@.key), ?(@.key op val)
const evaluateJSONPath = (data, path) => {
  if (!path || path.trim() === "$") return data;

  const normalizedPath = path.trim();
  if (!normalizedPath.startsWith("$")) {
    throw new Error("JSONPath must start with $");
  }

  const results = [];

  const step = (node, tokens) => {
    if (tokens.length === 0) {
      results.push(node);
      return;
    }

    const [head, ...rest] = tokens;

    if (head === "..") {
      // Recursive descent: match current node then all descendants
      step(node, rest);
      if (Array.isArray(node)) {
        node.forEach((item) => step(item, tokens));
      } else if (node && typeof node === "object") {
        Object.values(node).forEach((val) => step(val, tokens));
      }
      return;
    }

    if (head === "*") {
      if (Array.isArray(node)) {
        node.forEach((item) => step(item, rest));
      } else if (node && typeof node === "object") {
        Object.values(node).forEach((val) => step(val, rest));
      }
      return;
    }

    // Filter expression: ?(@.key) or ?(@.key op value)
    if (typeof head === "string" && head.startsWith("?(") && head.endsWith(")")) {
      const expr = head.slice(2, -1).trim(); // @.key op val
      const arr = Array.isArray(node) ? node : Object.values(node || {});
      arr.forEach((item) => {
        try {
          if (evalFilter(item, expr)) step(item, rest);
        } catch {}
      });
      return;
    }

    // Array slice: [n:m]
    if (typeof head === "string" && head.includes(":")) {
      if (!Array.isArray(node)) return;
      const [startStr, endStr] = head.split(":");
      const len = node.length;
      const start = startStr === "" ? 0 : parseInt(startStr, 10);
      const end = endStr === "" ? len : parseInt(endStr, 10);
      node.slice(
        start < 0 ? Math.max(0, len + start) : start,
        end < 0 ? len + end : end
      ).forEach((item) => step(item, rest));
      return;
    }

    // Multiple indices: [0,2,4]
    if (typeof head === "string" && head.includes(",")) {
      const indices = head.split(",").map((s) => s.trim());
      indices.forEach((idx) => {
        const parsed = parseInt(idx, 10);
        if (!isNaN(parsed) && Array.isArray(node)) {
          const item = parsed < 0 ? node[node.length + parsed] : node[parsed];
          if (item !== undefined) step(item, rest);
        } else if (isNaN(parsed) && node && typeof node === "object") {
          const val = node[idx.replace(/^['"]|['"]$/g, "")];
          if (val !== undefined) step(val, rest);
        }
      });
      return;
    }

    // Numeric index
    const numIdx = parseInt(head, 10);
    if (!isNaN(numIdx)) {
      if (Array.isArray(node)) {
        const item = numIdx < 0 ? node[node.length + numIdx] : node[numIdx];
        if (item !== undefined) step(item, rest);
      }
      return;
    }

    // Regular key
    if (node && typeof node === "object" && !Array.isArray(node)) {
      const val = node[head];
      if (val !== undefined) step(val, rest);
    }
  };

  const evalFilter = (item, expr) => {
    // Supports @.key, @.key == val, @.key != val, @.key > val, @.key < val
    const opMatch = expr.match(/^@\.([a-zA-Z_$][\w$]*)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    if (opMatch) {
      const [, key, op, rawVal] = opMatch;
      const itemVal = item?.[key];
      let cmpVal;
      if (rawVal === "true") cmpVal = true;
      else if (rawVal === "false") cmpVal = false;
      else if (rawVal === "null") cmpVal = null;
      else if (/^['"]/.test(rawVal)) cmpVal = rawVal.slice(1, -1);
      else cmpVal = parseFloat(rawVal);

      if (op === "==") return itemVal == cmpVal; // eslint-disable-line eqeqeq
      if (op === "!=") return itemVal != cmpVal; // eslint-disable-line eqeqeq
      if (op === ">") return itemVal > cmpVal;
      if (op === "<") return itemVal < cmpVal;
      if (op === ">=") return itemVal >= cmpVal;
      if (op === "<=") return itemVal <= cmpVal;
    }
    // Existence: @.key
    const existMatch = expr.match(/^@\.([a-zA-Z_$][\w$]*)$/);
    if (existMatch) return item?.[existMatch[1]] !== undefined;
    return false;
  };

  // Tokenize the path after $
  const tokenize = (p) => {
    const tokens = [];
    let i = 1; // skip $
    while (i < p.length) {
      if (p[i] === ".") {
        if (p[i + 1] === ".") {
          tokens.push("..");
          i += 2;
          // After .., read the key if present (not [ or end)
          if (i < p.length && p[i] !== "[" && p[i] !== ".") {
            let key = "";
            while (i < p.length && p[i] !== "." && p[i] !== "[") key += p[i++];
            if (key && key !== "*") tokens.push(key);
            else if (key === "*") tokens.push("*");
          }
        } else {
          i++;
          let key = "";
          while (i < p.length && p[i] !== "." && p[i] !== "[") key += p[i++];
          if (key) tokens.push(key);
        }
      } else if (p[i] === "[") {
        i++;
        let inner = "";
        let depth = 0;
        while (i < p.length) {
          if (p[i] === "[") depth++;
          if (p[i] === "]") {
            if (depth === 0) { i++; break; }
            depth--;
          }
          inner += p[i++];
        }
        // Strip surrounding quotes for string keys
        const stripped = inner.replace(/^['"]|['"]$/g, "");
        if (inner === "*") tokens.push("*");
        else tokens.push(stripped);
      } else {
        i++;
      }
    }
    return tokens;
  };

  step(data, tokenize(normalizedPath));

  if (results.length === 0) return [];
  return results.length === 1 ? results[0] : results;
};

const SAMPLE_JSON = `{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J.R.R. Tolkien",
        "title": "The Lord of the Rings",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`;

const EXAMPLE_QUERIES = [
  { label: "All authors", query: "$.store.book[*].author" },
  { label: "All prices", query: "$..price" },
  { label: "First book", query: "$.store.book[0]" },
  { label: "Last book", query: "$.store.book[-1]" },
  { label: "Cheap books", query: "$.store.book[?(@.price < 10)]" },
  { label: "Fiction books", query: '$.store.book[?(@.category == "fiction")]' },
];

const JsonPathEvaluator = () => {
  const { dark } = useTheme();
  const [jsonInput, setJsonInput] = useState("");
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [queryError, setQueryError] = useState("");
  const [copied, setCopied] = useState(false)

  const evaluate = useCallback((rawJson, rawQuery) => {
    setJsonError("");
    setQueryError("");
    setOutput("");

    if (!rawJson.trim() || !rawQuery.trim()) return;

    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (e) {
      setJsonError("Invalid JSON: " + e.message);
      return;
    }

    try {
      const result = evaluateJSONPath(parsed, rawQuery);
      setOutput(JSON.stringify(result, null, 2));
    } catch (e) {
      setQueryError("Invalid JSONPath: " + e.message);
    }
  }, []);

  useEffect(() => {
    evaluate(jsonInput, query);
  }, [jsonInput, query, evaluate]);

  const handleLoadSample = () => {
    setJsonInput(SAMPLE_JSON);
    setQuery("$.store.book[*].author");
  };

  const handleFormat = () => {
    if (!jsonInput.trim()) return;
    try {
      setJsonInput(JSON.stringify(JSON.parse(jsonInput), null, 2));
      setJsonError("");
    } catch (e) {
      setJsonError("Cannot format: " + e.message);
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setQuery("");
    setOutput("");
    setJsonError("");
    setQueryError("");
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const inputBase = `w-full p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors font-mono text-sm`;
  const inputDark = `bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600`;
  const inputLight = `bg-neutral-50 border-neutral-200 text-zinc-800 placeholder-zinc-400`;

  const labelCls = `text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-zinc-500"}`;

  const smallBtnCls = (active) =>
    `px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
      active
        ? dark
          ? "bg-white text-black hover:bg-zinc-200"
          : "bg-black text-white hover:bg-zinc-800"
        : dark
        ? "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white"
        : "bg-white border border-neutral-200 text-zinc-500 hover:text-black"
    }`;

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 font-sans antialiased transition-colors duration-300 overflow-x-hidden ${
        dark ? "bg-zinc-950" : "bg-[#FDFDFD]"
      }`}
    >
      <title>JSONPath Playground | DevTasks</title>
      <meta
        name="description"
        content="Client-side JSONPath query evaluator. Filter nested JSON data with standard JSONPath expressions."
      />

      <div
        className={`w-full max-w-6xl md:mx-auto rounded-3xl sm:rounded-4xl shadow-lg p-4 sm:p-8 border transition-colors duration-300 ${
          dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-neutral-100"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full min-w-0">
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
                JSONPath Playground
              </h1>
            </div>

            {/* Example queries pill strip */}
            <div
              className={`flex items-center gap-1.5 p-1 border rounded-2xl flex-wrap ${
                dark ? "border-zinc-700 bg-zinc-800" : "border-neutral-200 bg-neutral-50"
              }`}
            >
              {EXAMPLE_QUERIES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => setQuery(ex.query)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                    query === ex.query
                      ? dark
                        ? "bg-white text-black"
                        : "bg-black text-white"
                      : dark
                      ? "text-neutral-400 hover:text-white"
                      : "text-neutral-400 hover:text-black"
                  }`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Query Filter Bar */}
        <div className="mb-6">
          <label className={`${labelCls} block mb-2`}>JSONPath Expression</label>
          <div className="relative">
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm font-bold select-none ${
                dark ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              $
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='.store.book[*].author  ·  ..price  ·  .book[?(@.price < 10)]'
              className={`w-full pl-8 pr-4 py-3 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                queryError
                  ? dark
                    ? "border-red-500/60 bg-zinc-950 text-red-300"
                    : "border-red-400 bg-red-50 text-red-700"
                  : dark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600"
                  : "bg-neutral-50 border-neutral-200 text-zinc-800 placeholder-zinc-400"
              }`}
            />
          </div>
          {queryError && (
            <p className={`mt-1.5 text-xs font-medium ${dark ? "text-red-400" : "text-red-500"}`}>
              ⚠ {queryError}
            </p>
          )}
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* LEFT: JSON Input */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3 h-8">
              <label className={labelCls}>JSON Input</label>
              <div className="flex gap-2">
                <button type="button" onClick={handleLoadSample} className={smallBtnCls(false)}>
                  Sample
                </button>
                <button type="button" onClick={handleFormat} className={smallBtnCls(false)}>
                  Format
                </button>
                <button type="button" onClick={handleClear} className={smallBtnCls(false)}>
                  Clear
                </button>
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className={`${inputBase} h-80 ${
                jsonError
                  ? dark
                    ? "border-red-500/60 bg-zinc-950 text-red-300"
                    : "border-red-400 bg-red-50 text-red-700"
                  : dark
                  ? inputDark
                  : inputLight
              }`}
              placeholder={`Paste your JSON here…\n\n{\n  "name": "example",\n  "items": [1, 2, 3]\n}`}
              spellCheck={false}
            />
            {jsonError && (
              <p className={`mt-1.5 text-xs font-medium ${dark ? "text-red-400" : "text-red-500"}`}>
                ⚠ {jsonError}
              </p>
            )}
          </div>

          {/* RIGHT: Output */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3 h-8">
              <label className={labelCls}>Result</label>
              <button type="button" onClick={handleCopy} className={smallBtnCls(true)}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className={`${inputBase} h-80 ${
                dark
                  ? `bg-zinc-900/50 border-zinc-800 ${output ? "text-zinc-200" : "text-zinc-500"}`
                  : `bg-neutral-100 border-neutral-200 ${output ? "text-zinc-800" : "text-zinc-400"}`
              }`}
              placeholder="Filtered result appears here in real-time…"
              spellCheck={false}
            />
            {output && !queryError && !jsonError && (
              <p className={`mt-1.5 text-xs font-medium ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                ✓ Evaluated client-side — no data leaves your browser
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonPathEvaluator;