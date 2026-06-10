import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

const FLAGS = ["g", "i", "m", "s"];

const RegexTester = () => {
  const { dark } = useTheme();

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 py-8 flex items-center justify-center transition-colors duration-300 overflow-y-auto overflow-x-hidden relative ${
        dark ? "bg-zinc-950" : "bg-[#F7F7F7]"
      }`}
    >
      <title>Regex Tester — Dev Utilities</title>
      <meta
        name="description"
        content="Test and validate regular expressions against a test string with configurable flags."
      />

      {/* Background glows */}
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

      {/* Main card */}
      <div
        className={`relative z-10 w-[85%] max-w-none rounded-[32px] border shadow-2xl overflow-hidden transition-all duration-300 ${
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
        <div className="flex items-start justify-between px-6 sm:px-10 pt-8 sm:pt-10 gap-4">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-black uppercase tracking-tight transition-colors duration-300 ${
                dark ? "text-white" : "text-black"
              }`}
            >
              Regex Tester
            </h1>
          </div>
        </div>

        {/* Content area */}
        <div className="p-6 sm:p-10">

          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6">

            {/* LEFT: Pattern + Flags + Test String */}
            <div className="flex flex-col gap-4">

              {/* Pattern input */}
              <div className="group flex flex-col space-y-2">
                <label
                  className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    dark
                      ? "text-zinc-400 group-focus-within:text-white"
                      : "text-neutral-500 group-focus-within:text-black"
                  }`}
                >
                  Pattern
                </label>
                <input
                  type="text"
                  placeholder="/your-regex-pattern/"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all duration-300 ${
                    dark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-white focus:ring-1 focus:ring-white"
                      : "bg-neutral-50 border-neutral-200 text-zinc-800 placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                />
              </div>

              {/* Flags */}
              <div className="flex flex-col space-y-2">
                <label
                  className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    dark ? "text-zinc-400" : "text-neutral-500"
                  }`}
                >
                  Flags
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLAGS.map((flag) => (
                    <button
                      key={flag}
                      type="button"
                      className={`px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 ${
                        dark
                          ? "border-zinc-700 text-zinc-300 hover:border-white hover:text-white"
                          : "border-neutral-200 text-zinc-600 hover:border-black hover:text-black"
                      }`}
                    >
                      {flag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test String */}
              <div className="group flex flex-col space-y-2">
                <label
                  className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    dark
                      ? "text-zinc-400 group-focus-within:text-white"
                      : "text-neutral-500 group-focus-within:text-black"
                  }`}
                >
                  Test String
                </label>
                <textarea
                  placeholder="Enter test string here..."
                  className={`w-full h-40 px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all duration-300 resize-none ${
                    dark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-white focus:ring-1 focus:ring-white"
                      : "bg-neutral-50 border-neutral-200 text-zinc-800 placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                />
              </div>

            </div>

            {/* RIGHT: Matches output */}
            <div className="group flex flex-col space-y-2">
              <label
                className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                  dark
                    ? "text-zinc-400 group-focus-within:text-white"
                    : "text-neutral-500 group-focus-within:text-black"
                }`}
              >
                Matches
              </label>
              <textarea
                readOnly
                placeholder="Match results will appear here..."
                className={`w-full h-64 px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all duration-300 resize-none ${
                  dark
                    ? "bg-zinc-950/50 border-zinc-800 text-zinc-500"
                    : "bg-neutral-100 border-neutral-200 text-zinc-400"
                }`}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className={`w-40 px-4 py-2 rounded-xl border font-bold text-sm text-center transition-all duration-300 active:scale-95 ${
                    dark
                      ? "border-white text-white hover:bg-white hover:text-black"
                      : "border-black text-black hover:bg-black hover:text-white"
                  }`}
                >
                  Copy
                </button>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {["Test", "Clear"].map((btn) => (
              <button
                key={btn}
                type="button"
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

        {/* Footer navigation */}
        <div
          className={`mt-4 border-t px-6 sm:px-10 pb-8 pt-6 ${
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
            <span>&larr;</span>
            <span>Back to Workspace</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegexTester;
