import { useRef } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUpload, HiOutlineDownload, HiArrowLeft } from "react-icons/hi";
import { toast } from "sonner";

const DataCenter = () => {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    // TODO: Implement JSON export function
    toast.success("Export triggered.");
  };

  const handleImport = (e) => {
    // TODO: Implement JSON import and merge validation
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 px-4 py-16">

      {/* Ambient glow — indigo top-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[120px]"
      />

      {/* Ambient glow — emerald bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-400/20 dark:bg-emerald-500/10 blur-[120px]"
      />

      {/* Glassmorphic container */}
      <div className="relative z-10 w-full max-w-2xl rounded-[32px] shadow-2xl backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/60 p-6 sm:p-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Snippet Data Center
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Export your snippets as a JSON backup or restore from a previous save.
          </p>
        </div>

        {/* Dual-card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Export Card */}
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-zinc-50/80 dark:bg-zinc-800/50 p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 ring-1 ring-indigo-200 dark:ring-indigo-700/50">
              <HiOutlineUpload className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="text-center">
              <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                Export Backup
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Download all your snippets as a{" "}
                <code className="font-mono text-indigo-500 dark:text-indigo-400">.json</code>{" "}
                backup file.
              </p>
            </div>

            <button
              onClick={handleExport}
              className="mt-auto w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 active:scale-[0.98]"
            >
              Download JSON
            </button>
          </div>

          {/* Import Card */}
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-700/60 bg-zinc-50/80 dark:bg-zinc-800/50 p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 ring-1 ring-emerald-200 dark:ring-emerald-700/50">
              <HiOutlineDownload className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="text-center">
              <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                Import Backup
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Restore snippets from a previously exported{" "}
                <code className="font-mono text-emerald-500 dark:text-emerald-400">.json</code>{" "}
                backup file.
              </p>
            </div>

            {/* Hidden file input triggered by button below */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="sr-only"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-auto w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 active:scale-[0.98]"
            >
              Upload JSON
            </button>
          </div>

        </div>

        {/* Back link */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/snippetvault"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors duration-200"
          >
            <HiArrowLeft className="w-3.5 h-3.5" />
            Back to Workspace
          </Link>
        </div>

      </div>
    </div>
  );
};

export default DataCenter;