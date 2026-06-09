import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import ThemeToggle from "../../../components/ThemeToggle";

const Base64Url = () => {
  const { dark } = useTheme();

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 font-sans antialiased transition-colors duration-300 ${
        dark ? "bg-zinc-950" : "bg-[#FDFDFD]"
      }`}
    >
      <title>Base64 & URL Converter | DevTasks</title>
      <meta name="description" content="Offline Base64 and URL encoding/decoding utility tool." />

      <div
        className={`w-[90%] max-w-6xl mx-auto rounded-3xl sm:rounded-4xl shadow-lg p-4 sm:p-8 border transition-colors duration-300 ${
          dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-neutral-100"
        }`}
      >
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1
            className={`text-2xl sm:text-3xl font-black uppercase ${
              dark ? "text-white" : "text-black"
            }`}
          >
            Base64 Encoder & Decoder
          </h1>
          <ThemeToggle />
        </div>

        {/* Content Area */}
        <div className="mb-8">
          
          {/* 2-Column Grid Layout matching the reference image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            
            {/* LEFT COLUMN: Input */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Input
                </label>
                <button className={`text-xs font-bold transition-colors ${dark ? "text-zinc-500 hover:text-white" : "text-zinc-400 hover:text-black"}`}>
                
                </button>
              </div>
              <textarea
                className={`w-full h-64 p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-colors ${
                  dark ? "bg-zinc-950 border-zinc-800 text-zinc-200" : "bg-neutral-50 border-neutral-200 text-zinc-800"
                }`}
                placeholder="Enter text or Base64 here"
              ></textarea>
            </div>

            {/* RIGHT COLUMN: Output */}
            <div className="flex flex-col">
              <label className={`text-xs font-black uppercase tracking-widest mb-3 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                Output
              </label>
              <textarea
                readOnly
                className={`w-full h-64 p-4 rounded-xl border resize-none focus:outline-none transition-colors ${
                  dark ? "bg-zinc-900/50 border-zinc-800 text-zinc-500" : "bg-neutral-100 border-neutral-200 text-zinc-400"
                }`}
                placeholder="Result will appear here..."
              ></textarea>
            </div>
            
          </div>

          {/* Action Buttons (Centered at bottom) */}
          <div className="flex flex-wrap justify-center gap-4">
            {["Encode", "Decode"].map((btn) => (
              <button
                key={btn}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 hover:scale-105 ${
                  dark
                    ? "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
                    : "bg-white border-neutral-200 text-zinc-600 hover:text-black hover:border-neutral-400"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

        </div>

        {/* Footer Navigation */}
        <div
          className={`mt-12 border-t pt-6 ${
            dark ? "border-zinc-800" : "border-neutral-100"
          }`}
        >
          <Link
            to="/devutilities"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              dark
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <span>←</span>
            <span>Back to Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Base64Url;