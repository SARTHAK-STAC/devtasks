import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../../context/ThemeContext";

const Base64Image = () => {
  const { dark } = useTheme();
  const [mode, setMode] = useState("encode"); // encode | decode
  const [inputText, setInputText] = useState(""); // Base64 string for decode
  const [outputText, setOutputText] = useState(""); // Base64 output for encode
  const [previewSrc, setPreviewSrc] = useState(""); // image preview
  const [fileInfo, setFileInfo] = useState(null); // { name, size, type }
  const fileInputRef = useRef(null);

  const resetAll = () => {
    setInputText("");
    setOutputText("");
    setPreviewSrc("");
    setFileInfo(null);
  };

  // === ENCODE: image file → Base64 ===
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate it's an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result; // data:image/png;base64,...
      setOutputText(base64);
      setPreviewSrc(base64);
      toast.success("Image encoded to Base64!");
    };
    reader.onerror = () => {
      toast.error("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Create a synthetic event-like object
      const syntheticEvent = { target: { files: [file] } };
      handleFileChange(syntheticEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  // === DECODE: Base64 string → image preview ===
  const handleDecode = () => {
    if (!inputText.trim()) {
      toast.error("Please enter a Base64 string.");
      return;
    }

    let base64 = inputText.trim();
    // Support both data:image/...;base64,... and raw base64
    if (base64.startsWith("data:image/")) {
      // Already a data URL, use directly
    } else {
      // Raw base64 — try to detect image type from signature
      const signatures = {
        "/9j/": "image/jpeg",
        "iVBORw0KGgo": "image/png",
        "R0lGOD": "image/gif",
        "UklGR": "image/webp",
        "Qk": "image/bmp",
      };
      let mime = "image/png"; // default
      for (const [sig, m] of Object.entries(signatures)) {
        if (base64.startsWith(sig)) {
          mime = m;
          break;
        }
      }
      base64 = `data:${mime};base64,${base64}`;
    }

    setPreviewSrc(base64);
    setOutputText(base64);
    toast.success("Base64 decoded to image!");
  };

  const handleDownloadImage = () => {
    if (!previewSrc) return;
    const a = document.createElement("a");
    a.href = previewSrc;
    const ext = previewSrc.includes("image/png")
      ? "png"
      : previewSrc.includes("image/jpeg")
        ? "jpg"
        : previewSrc.includes("image/gif")
          ? "gif"
          : previewSrc.includes("image/webp")
            ? "webp"
            : "png";
    a.download = `image.${ext}`;
    a.click();
    toast.success("Download started!");
  };

  const handleSampleBase64 = () => {
    // A tiny 1x1 red PNG as a sample
    setInputText(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
    );
    setPreviewSrc("");
    setOutputText("");
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 font-sans antialiased transition-colors duration-300 overflow-x-hidden ${
        dark ? "bg-zinc-950" : "bg-[#FDFDFD]"
      }`}
    >
      <title>Base64 Image Encoder & Decoder | DevTasks</title>
      <meta
        name="description"
        content="Encode images to Base64 and decode Base64 strings back to images. Fully offline."
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
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1
                className={`text-xl sm:text-2xl font-black uppercase tracking-tight transition-colors duration-300 min-w-0 flex-1 ${
                  dark ? "text-white" : "text-black"
                }`}
              >
                Base64 Image Encoder & Decoder
              </h1>
            </div>

            {/* Mode Selector */}
            <div
              className={`flex items-center gap-2 p-1 border rounded-2xl ${
                dark
                  ? "border-zinc-700 bg-zinc-800"
                  : "border-neutral-200 bg-neutral-50"
              }`}
            >
              {[
                { key: "encode", label: "Encode" },
                { key: "decode", label: "Decode" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setMode(opt.key);
                    resetAll();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                    mode === opt.key
                      ? dark
                        ? "bg-white text-black"
                        : "bg-black text-white"
                      : dark
                        ? "text-neutral-400 hover:text-white"
                        : "text-neutral-400 hover:text-black"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mb-8">
          {mode === "encode" ? (
            /* ── ENCODE MODE ── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* LEFT: Drop Zone */}
              <div className="flex flex-col">
                <label
                  className={`mb-3 text-xs font-black uppercase tracking-widest ${
                    dark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Upload Image
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 min-h-[256px] flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                    dark
                      ? "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
                      : "border-neutral-300 bg-neutral-50 hover:border-neutral-400"
                  }`}
                >
                  <svg
                    className={`w-10 h-10 ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span
                    className={`text-sm font-medium ${dark ? "text-zinc-400" : "text-zinc-500"}`}
                  >
                    Drop an image or click to browse
                  </span>
                  <span
                    className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                  >
                    Supports PNG, JPEG, GIF, WebP, BMP, SVG
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                {fileInfo && (
                  <div
                    className={`mt-3 p-3 rounded-xl text-xs border ${
                      dark
                        ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                        : "bg-neutral-50 border-neutral-200 text-zinc-600"
                    }`}
                  >
                    <span className="font-bold">{fileInfo.name}</span> —{" "}
                    {formatBytes(fileInfo.size)} ({fileInfo.type})
                  </div>
                )}
              </div>

              {/* RIGHT: Preview + Base64 Output */}
              <div className="flex flex-col gap-4">
                {/* Preview */}
                <div className="flex flex-col">
                  <label
                    className={`mb-3 text-xs font-black uppercase tracking-widest ${
                      dark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Preview
                  </label>
                  <div
                    className={`flex items-center justify-center min-h-[128px] rounded-xl border ${
                      dark
                        ? "bg-zinc-950 border-zinc-800"
                        : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt="Preview"
                        className="max-w-full max-h-[256px] rounded-lg object-contain"
                      />
                    ) : (
                      <span
                        className={`text-sm ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                      >
                        Image preview will appear here
                      </span>
                    )}
                  </div>
                </div>

                {/* Base64 Output */}
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <label
                      className={`text-xs font-black uppercase tracking-widest ${
                        dark ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      Base64 Output
                    </label>
                    {outputText && (
                      <span
                        className={`text-xs ${dark ? "text-zinc-500" : "text-zinc-400"}`}
                      >
                        {formatBytes(outputText.length)} chars
                      </span>
                    )}
                  </div>
                  <textarea
                    value={outputText}
                    readOnly
                    className={`flex-1 min-h-[96px] p-4 rounded-xl border resize-none focus:outline-none transition-colors text-xs font-mono ${
                      dark
                        ? "bg-zinc-950 border-zinc-800 text-zinc-300"
                        : "bg-neutral-50 border-neutral-200 text-zinc-600"
                    }`}
                    placeholder="The Base64 string will appear here..."
                  />
                </div>
              </div>
            </div>
          ) : (
            /* ── DECODE MODE ── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* LEFT: Base64 Input */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <label
                    className={`text-xs font-black uppercase tracking-widest ${
                      dark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Base64 Input
                  </label>
                  <button
                    type="button"
                    onClick={handleSampleBase64}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      dark
                        ? "bg-white text-black hover:bg-zinc-200"
                        : "bg-black text-white hover:bg-zinc-800"
                    }`}
                  >
                    Sample
                  </button>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className={`w-full h-48 p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors text-xs font-mono ${
                    dark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-200"
                      : "bg-neutral-50 border-neutral-200 text-zinc-800"
                  }`}
                  placeholder="Paste a Base64 string (data:image/... or raw) here..."
                />
              </div>

              {/* RIGHT: Preview */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <label
                    className={`text-xs font-black uppercase tracking-widest ${
                      dark ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    Image Preview
                  </label>
                  {previewSrc && (
                    <button
                      type="button"
                      onClick={handleDownloadImage}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        dark
                          ? "bg-zinc-800 text-zinc-300 hover:text-white"
                          : "bg-neutral-100 text-zinc-600 hover:text-black"
                      }`}
                    >
                      Download
                    </button>
                  )}
                </div>
                <div
                  className={`flex items-center justify-center flex-1 min-h-[192px] rounded-xl border ${
                    dark
                      ? "bg-zinc-950 border-zinc-800"
                      : "bg-neutral-50 border-neutral-200"
                  }`}
                >
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Decoded"
                      className="max-w-full max-h-[320px] rounded-lg object-contain"
                    />
                  ) : (
                    <span
                      className={`text-sm ${dark ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      Image will appear here after decode
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {mode === "encode" ? (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:scale-105 ${
                    dark
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                      : "bg-white border-neutral-200 text-zinc-600 hover:text-black hover:border-neutral-400"
                  }`}
                >
                  Choose File
                </button>
                <button
                  type="button"
                  onClick={handleCopyOutput}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:scale-105 ${
                    dark
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                      : "bg-white border-neutral-200 text-zinc-600 hover:text-black hover:border-neutral-400"
                  }`}
                >
                  Copy
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:scale-105 ${
                    dark
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                      : "bg-white border-neutral-200 text-zinc-600 hover:text-black hover:border-neutral-400"
                  }`}
                >
                  Clear
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleDecode}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:scale-105 ${
                    dark
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  Decode to Image
                </button>
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={!previewSrc}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ${
                    dark
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
                      : "bg-white border-neutral-200 text-zinc-600 hover:text-black hover:border-neutral-400"
                  }`}
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:scale-105 ${
                    dark
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                      : "bg-white border-neutral-200 text-zinc-600 hover:text-black hover:border-neutral-400"
                  }`}
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64Image;
