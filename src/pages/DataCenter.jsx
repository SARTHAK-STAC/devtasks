import { useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const DataCenter = () => {
  const { dark } = useTheme();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    const exportData = {
      exportedAt: new Date().toISOString(),
      tasks,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `devtasks-backup-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);

    toast.success("Tasks exported successfully!", {
      style: {
        background: "#000000",
        color: "#ffffff",
      },
    });
  };

  const handleImport = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
          toast.error("Invalid file format — missing tasks array", {
            style: {
              background: "#000000",
              color: "#ffffff",
            },
          });

          return;
        }

        const isValid = parsed.tasks.every(
          (task) =>
            typeof task.id !== "undefined" &&
            typeof task.text === "string" &&
            ["FEATURE", "BUG", "REFACTOR"].includes(task.category) &&
            ["HIGH", "MEDIUM", "LOW"].includes(task.priority) &&
            typeof task.completed === "boolean",
        );

        if (!isValid) {
          toast.error("File contains invalid task data", {
            style: {
              background: "#000000",
              color: "#ffffff",
            },
          });

          return;
        }

        localStorage.setItem("tasks", JSON.stringify(parsed.tasks));

        toast.success(`${parsed.tasks.length} tasks imported successfully!`, {
          style: {
            background: "#000000",
            color: "#ffffff",
          },
        });
      } catch {
        toast.error("Failed to read file — please upload a valid JSON", {
          style: {
            background: "#000000",
            color: "#ffffff",
          },
        });
      }
    };

    reader.readAsText(file);

    e.target.value = "";
  };

  const actions = [
    {
      id: "export",
      label: "Export Tasks",
      description: "Download your tasks as a secure JSON backup file",
      onClick: handleExport,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
    },
    {
      id: "import",
      label: "Import Tasks",
      description: "Restore tasks from a previously exported backup",
      onClick: () => fileInputRef.current.click(),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-8-8l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 py-8 flex items-center justify-center transition-colors duration-300 overflow-hidden relative ${
        dark ? "bg-zinc-950" : "bg-[#F7F7F7]"
      }`}
    >
      <title>Data Center & Backups — Dev Tasks JSON Portability</title>
      <meta
        name="description"
        content="Import and export your developer roadmaps and task lists as JSON backups. Keep task structures fully portable and safe."
      />
      <meta
        name="keywords"
        content="devtasks, data-center, json export, task backup, restore lists, developer tools"
      />

      {/* BACKGROUND */}
      <div
        className={`absolute top-[-120px] right-[-120px] w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full blur-3xl opacity-40 ${
          dark ? "bg-zinc-800" : "bg-neutral-200"
        }`}
      />

      {/* BACKGROUND */}
      <div
        className={`absolute top-[-120px] right-[-120px] w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full blur-3xl opacity-40 ${
          dark ? "bg-zinc-800" : "bg-neutral-200"
        }`}
      />

      <div
        className={`absolute bottom-[-120px] left-[-120px] w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full blur-3xl opacity-40 ${
          dark ? "bg-zinc-900" : "bg-neutral-100"
        }`}
      />

      {/* CARD */}
      <div
        className={`relative z-10 w-full max-w-2xl rounded-[32px] border shadow-2xl overflow-hidden transition-all duration-300 ${
          dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-neutral-200"
        }`}
      >
        {/* TOP BAR */}
        <div className={`h-2 w-full ${dark ? "bg-white" : "bg-black"}`} />

        {/* HEADER */}
        <div className="flex items-start justify-between px-5 sm:px-8 pt-6 sm:pt-8 gap-4">
          <div>
            <h1
              className={`text-2xl sm:text-4xl font-black uppercase tracking-tight ${
                dark ? "text-white" : "text-black"
              }`}
            >
              Data Center
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 mt-2">
              Backup & restore your roadmap tasks
            </p>
          </div>

          <ThemeToggle />
        </div>

        {/* ACTIONS */}
        <div className="px-5 sm:px-8 py-8 space-y-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              id={`datacenter-action-${action.id}`}
              className={`group w-full rounded-3xl border p-4 sm:p-5 flex items-center gap-4 text-left transition-all duration-300 ${
                dark
                  ? "bg-zinc-800 border-zinc-700 hover:border-white"
                  : "bg-neutral-50 border-neutral-200 hover:border-black"
              }`}
            >
              {/* ICON */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  dark
                    ? "bg-zinc-700 text-white group-hover:bg-white group-hover:text-black"
                    : "bg-white text-black group-hover:bg-black group-hover:text-white"
                }`}
              >
                {action.icon}
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                <h2
                  className={`text-sm sm:text-base font-black uppercase tracking-widest ${
                    dark ? "text-white" : "text-black"
                  }`}
                >
                  {action.label}
                </h2>

                <p
                  className={`mt-1 text-xs sm:text-sm leading-relaxed ${
                    dark ? "text-zinc-400" : "text-neutral-500"
                  }`}
                >
                  {action.description}
                </p>
              </div>

              {/* ARROW */}
              <div
                className={`text-xl transition-all duration-300 group-hover:translate-x-1 ${
                  dark ? "text-zinc-400" : "text-neutral-400"
                }`}
              >
                →
              </div>
            </button>
          ))}
        </div>

        {/* HIDDEN INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        {/* FOOTER */}
        <div className="px-5 sm:px-8 pb-8 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-neutral-100 dark:border-zinc-800 pt-6 mt-4">
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              dark
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex gap-4">
            <Link
              to="/list-tasks"
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                dark
                  ? "text-neutral-400 hover:text-white"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <span>Task List</span>
            </Link>
            <span className={dark ? "text-zinc-700" : "text-neutral-300"}>|</span>
            <Link
              to="/delete-history"
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                dark
                  ? "text-neutral-400 hover:text-white"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <span>Deleted Tasks</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCenter;
