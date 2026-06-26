import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../../context/ThemeContext";

const MODES = [
  { key: "encode", label: "Image → Base64" },
  { key: "decode", label: "Base64 → Image" },
];


const Base64ImageConverter = () => {
  const { dark } = useTheme();
  const [mode, setMode] = useState("encode");
  const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");
const [base64Output, setBase64Output] = useState("");
const [decodeInput, setDecodeInput] = useState("");
const [decodedPreview, setDecodedPreview] = useState("");

  const handleModeChange = (newMode) => {
  setMode(newMode);
  setBase64Output("");
  setDecodeInput("");
  setDecodedPreview("");
  setImagePreview("");
  setImageFile(null);
};

  
 const handleClear = () => {
  setImageFile(null);
  setImagePreview("");
  setBase64Output("");
  setDecodeInput("");
  setDecodedPreview("");
};

  const handleCopy = async () => {
  if (!base64Output) return;

  try {
    await navigator.clipboard.writeText(base64Output);
    toast.success("Copied to clipboard");
  } catch {
    toast.error("Failed to copy");
  }
};
const handleImageUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Please select an image smaller than 5 MB.");
    return;
  }

  setImageFile(file);

  const reader = new FileReader();

  reader.onload = () => {
    if (typeof reader.result === "string") {
      setImagePreview(reader.result);
      setBase64Output(reader.result);
    }
  };

  reader.readAsDataURL(file);
};
  const actionButtons = [
  { label: "Clear", onClick: handleClear },
  { label: "Copy", onClick: handleCopy },
];

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 font-sans antialiased transition-colors duration-300 overflow-x-hidden ${
        dark ? "bg-zinc-950" : "bg-[#FDFDFD]"
      }`}
    >
      <title>Base64 Image Encoder & Decoder | DevTasks</title>
      <meta
        name="description"
        content="Offline Base64 and URL encoding/decoding utility tool."
      />

      <div
        className={`w-full max-w-6xl md:mx-auto rounded-3xl sm:rounded-4xl shadow-lg p-4 sm:p-8 border transition-colors duration-300 ${
          dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-neutral-100"
        }`}
      >
        {/* Header Area */}
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
              {MODES.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleModeChange(opt.key)}
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
          {/* 2-Column Grid Layout matching the reference image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* LEFT COLUMN: Input */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3 h-8">
                <label
                  className={`text-xs font-black uppercase tracking-widest ${
                    dark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  Input
                </label>

                
              </div>
              <div
  className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center p-6 transition-all duration-300 ${
    dark
      ? "border-zinc-700 hover:border-white hover:bg-zinc-800/30"
      : "border-zinc-300 hover:border-black hover:bg-neutral-50"
  }`}
>
  {imagePreview ? (
  <>
    <img
      src={imagePreview}
      alt="Preview"
      className="max-h-44 max-w-full rounded-lg object-contain"
    />

    {imageFile && (
      <p
        className={`mt-3 text-sm ${
          dark ? "text-zinc-400" : "text-zinc-600"
        }`}
      >
        {imageFile.name}
      </p>
    )}

    <label className="mt-4 cursor-pointer text-sm font-semibold underline">
      Upload another image
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleImageUpload}
      />
    </label>
  </>
) : (
  <label className="cursor-pointer flex flex-col items-center justify-center h-full w-full">
    <input
      type="file"
      accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
      className="hidden"
      onChange={handleImageUpload}
    />

    <svg
      className="w-12 h-12 mb-4 text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
      />
    </svg>

    <p className="font-semibold">Click to upload an image</p>

    <p className="text-sm text-zinc-500">
      PNG, JPG, GIF, SVG, WEBP
    </p>
  </label>
)}

</div>   {/* closes upload box */}

</div>   {/* <-- ADD THIS: closes LEFT COLUMN */}

{/* RIGHT COLUMN: Output */}
<div className="flex flex-col">
              <div className="flex items-center mb-3 h-8">
                <label
                  className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-zinc-500"}`}
                >
                  Base64 Output
                </label>
              </div>
              <textarea
                value={base64Output}
                readOnly
                className={`w-full h-64 p-4 rounded-xl border resize-none focus:outline-none transition-colors ${
                  dark
                    ? `bg-zinc-900/50 border-zinc-800 ${base64Output ? "text-zinc-200" : "text-zinc-500"}`
                    : `bg-neutral-100 border-neutral-200 ${base64Output ? "text-zinc-800" : "text-zinc-400"}`
                }`}
                placeholder="Result will appear here..."
              ></textarea>
              <div
  className={`mt-2 text-right text-xs ${
    dark ? "text-zinc-500" : "text-zinc-500"
  }`}
>
  {base64Output.length.toLocaleString()} characters
</div>
            </div>
          </div>

          {/* Action Buttons (Centered at bottom) */}
          <div className="flex flex-wrap justify-center gap-4">
            {actionButtons.map((btn) => (
              <button
  key={btn.label}
  type="button"
  onClick={btn.onClick}
  disabled={btn.label === "Copy" && !base64Output}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 ${
  btn.label === "Copy" && !base64Output
    ? "opacity-40 cursor-not-allowed"
    : "hover:scale-105"
} ${
  dark
    ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
    : "bg-white border-neutral-200 text-zinc-600 hover:text-black hover:border-neutral-400"
}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64ImageConverter;