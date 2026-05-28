import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const Dashboard = () => {
  const { dark } = useTheme();
  
  // --- STATE FOR TASK PROGRESS ---
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, percentage: 0 });

  // --- STATE FOR SNIPPET STATS ---
  const [snippetStats, setSnippetStats] = useState({ total: 0, breakdown: "No active snippets" });

  // --- LOAD INITIAL DATA ---
  useEffect(() => {
    // Tasks Stats
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      const total = parsed.length;
      const completed = parsed.filter((t) => t.completed).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      setTaskStats({ total, completed, percentage });
    }

    // Snippets Stats
    const savedSnippets = localStorage.getItem("dev_snippets");
    if (savedSnippets) {
      const parsed = JSON.parse(savedSnippets);
      const total = parsed.length;
      if (total > 0) {
        const counts = {};
        parsed.forEach((s) => {
          const cat = s.category || "GENERAL";
          counts[cat] = (counts[cat] || 0) + 1;
        });
        const breakdownStr = Object.keys(counts).slice(0, 3).join(" • ");
        setSnippetStats({
          total,
          breakdown: breakdownStr + (Object.keys(counts).length > 3 ? "..." : "")
        });
      } else {
        setSnippetStats({ total: 0, breakdown: "Empty vault directory" });
      }
    }
  }, []);

  // --- THEME SETTING ---
  const theme = {
    light: {
      wrapper: "bg-white text-black",
      cardInteractive: "bg-gray-50 border-gray-100 hover:bg-black hover:text-white hover:border-black",
    },
    dark: {
      wrapper: "bg-black text-white",
      cardInteractive: "bg-zinc-900 border-zinc-800 hover:bg-white hover:text-black hover:border-white",
    },
  };
  const t = dark ? theme.dark : theme.light;

  return (
    <div
      className={`${t.wrapper} min-h-screen w-full font-sans overflow-y-auto flex flex-col p-4 md:p-8 transition-colors duration-300`}
    >
      <title>Developer Command Center — Dev Tasks Control Center</title>
      <meta
        name="description"
        content="Integrated engineering cockpit for managing developer roadmap task boards and snippet code registries."
      />

      <div className="max-w-4xl w-full mx-auto flex flex-col grow justify-between">
        <header className="shrink-0 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400 font-medium">
              Manage your engineering command center
            </p>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/"
              className="text-xs font-bold uppercase tracking-widest hover:underline pb-1"
            >
              Exit to Site
            </Link>
          </div>
        </header>

        {/* SYMMETRICAL DUAL WORKSPACE GRID */}
        <div className="grow grid grid-cols-1 md:grid-cols-2 gap-8 py-4 items-stretch max-w-4xl w-full">
          
          {/* WORKSPACE 1: TASK MANAGEMENT */}
          <Link
            to="/taskmanage"
            id="taskmanage-workspace-card"
            className={`group relative p-8 border rounded-[32px] transition-all duration-500 flex flex-col justify-between min-h-[380px] ${t.cardInteractive}`}
          >
            <div>
              <div
                className={`mb-6 p-3 w-fit rounded-xl transition-colors shadow-sm ${
                  dark ? "bg-zinc-800 text-white group-hover:bg-zinc-700" : "bg-gray-100 text-black group-hover:bg-neutral-800 group-hover:text-white"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              
              <h2 className="text-xl font-black mb-3 uppercase tracking-tight">
                Task Workspace
              </h2>
              <p className="text-xs font-medium text-gray-500 group-hover:text-neutral-400 transition-colors leading-relaxed mb-6">
                Developer roadmap planners, custom category groups, backup portability, and deletion safety logs.
              </p>
            </div>

            <div className="mt-auto w-full">
              {/* Task statistics */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] font-black tracking-widest mb-1.5 uppercase opacity-85">
                  <span>Task Completion</span>
                  <span>{taskStats.percentage}%</span>
                </div>
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${dark ? 'bg-zinc-800' : 'bg-neutral-200'}`}>
                  <div
                    className={`h-full transition-all duration-1000 ${
                      dark ? "bg-white group-hover:bg-black" : "bg-black group-hover:bg-white"
                    }`}
                    style={{ width: `${taskStats.percentage}%` }}
                  />
                </div>
                <div className="text-[9px] font-bold text-gray-400 group-hover:text-neutral-300 mt-2 uppercase">
                  {taskStats.completed} of {taskStats.total} active tasks completed
                </div>
              </div>

              <div className="flex items-center text-xs font-black uppercase tracking-widest mt-4">
                Enter Workspace{" "}
                <span className="ml-2 group-hover:translate-x-1.5 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* WORKSPACE 2: SNIPPET VAULT */}
          <Link
            to="/snippetvault"
            id="snippetvault-workspace-card"
            className={`group relative p-8 border rounded-[32px] transition-all duration-500 flex flex-col justify-between min-h-[380px] ${t.cardInteractive}`}
          >
            <div>
              <div
                className={`mb-6 p-3 w-fit rounded-xl transition-colors shadow-sm ${
                  dark ? "bg-zinc-800 text-white group-hover:bg-zinc-700" : "bg-gray-100 text-black group-hover:bg-neutral-800 group-hover:text-white"
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              
              <h2 className="text-xl font-black mb-3 uppercase tracking-tight">
                Snippet Workspace
              </h2>
              <p className="text-xs font-medium text-gray-500 group-hover:text-neutral-400 transition-colors leading-relaxed mb-6">
                Fast search templates, double-click inline script updates, clickable clipboards, and JSON restorations.
              </p>
            </div>

            <div className="mt-auto w-full">
              {/* Snippet statistics */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-4xl font-black leading-none">{snippetStats.total}</span>
                  <span className="text-[10px] font-black tracking-widest uppercase opacity-75">
                    {snippetStats.total === 1 ? "Active Snippet" : "Active Snippets"}
                  </span>
                </div>
                <div className="text-[9px] font-bold text-gray-400 group-hover:text-neutral-300 uppercase truncate">
                  Categories: {snippetStats.breakdown}
                </div>
              </div>

              <div className="flex items-center text-xs font-black uppercase tracking-widest mt-4">
                Enter Vault Workspace{" "}
                <span className="ml-2 group-hover:translate-x-1.5 transition-transform">
                  →
                </span>
              </div>
            </div>
          </Link>

        </div>

        {/* FOOTER */}
        <div className="shrink-0 mt-8 pt-8 border-t border-gray-50 opacity-10 hidden md:block">
          <h2 className="text-[12vw] font-black tracking-tighter leading-none select-none text-center">
            FLOW
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
