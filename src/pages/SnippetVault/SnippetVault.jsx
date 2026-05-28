import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";

const SnippetVault = () => {
  const { dark } = useTheme();
  const [totalCount, setTotalCount] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("dev_snippets");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTotalCount(parsed.length);

      // Simple category breakdown
      if (parsed.length > 0) {
        const counts = {};
        parsed.forEach((s) => {
          const cat = s.category || "GENERAL";
          counts[cat] = (counts[cat] || 0) + 1;
        });
        const breakdownStr = Object.entries(counts)
          .map(([cat, count]) => `${cat} (${count})`)
          .join(" • ");
        setCategoryBreakdown(breakdownStr);
      } else {
        setCategoryBreakdown("No active snippets");
      }
    } else {
      setCategoryBreakdown("No active snippets");
    }
  }, []);

  const theme = {
    light: {
      wrapper: "bg-white text-black",
      card: "bg-gray-50 border-gray-100 text-black hover:bg-black hover:text-white",
      icon: "bg-white text-black group-hover:bg-white/10 group-hover:text-white",
    },
    dark: {
      wrapper: "bg-black text-white",
      card: "bg-zinc-900 border-zinc-800 text-white hover:bg-white hover:text-black",
      icon: "bg-black text-white group-hover:bg-black/10 group-hover:text-black",
    },
  };
  const t = dark ? theme.dark : theme.light;

  const cards = [
    {
      title: "Add Snippet",
      description: "Store command templates, custom configurations, and reusable code blocks.",
      path: "/snippetvault/add",
      icon: (
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },
    {
      title: "Snippet List",
      description: "Quickly search, double-click edit, filter by tag, and click to copy commands.",
      path: "/snippetvault/list",
      icon: (
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      title: "Delete History",
      description: "Restore deleted snippets and clean obsolete records.",
      path: "/snippetvault/delete-history",
      icon: (
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
    {
      title: "Data Center",
      description: "Import or export snippet directories as portable JSON backup packages.",
      path: "/snippetvault/data-center",
      icon: (
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
            d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zm0 5h16"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`${t.wrapper} min-h-screen md:h-screen w-full font-sans overflow-y-auto md:overflow-hidden flex flex-col p-4 md:p-8 transition-colors duration-300`}
    >
      <title>Snippet Workspace — Dev Snippet Vault</title>
      <meta
        name="description"
        content="Quickly manage, copy, search, edit and backup engineering snippets and configurations."
      />

      <div className="max-w-6xl w-full mx-auto flex flex-col h-full">
        <header className="shrink-0 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
              Snippet Vault
            </h1>
            <p className="text-gray-400 font-medium mb-6">
              Organize, copy, and secure code snippets
            </p>

            <div className="w-full max-w-sm">
              <div className="text-xs font-black uppercase tracking-widest mb-2">
                Vault Status: {totalCount} ACTIVE SNIPPETS
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase truncate">
                {categoryBreakdown}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="text-xs font-bold uppercase tracking-widest hover:underline pb-1"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <div className="grow flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
            {cards.map((card) => (
              <Link
                key={card.title}
                to={card.path}
                id={`snippetvault-card-${card.title.toLowerCase().replace(/\s+/g, "-")}`}
                className={`group relative p-8 border rounded-3xl transition-all duration-500 flex flex-col justify-between h-[320px] ${t.card}`}
              >
                <div>
                  <div
                    className={`mb-8 p-3 w-fit rounded-xl transition-colors shadow-sm ${t.icon}`}
                  >
                    {card.icon}
                  </div>
                  <h2 className="text-xl font-black mb-3 uppercase tracking-tight">
                    {card.title}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore{" "}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="shrink-0 mt-8 pt-8 border-t border-gray-50 opacity-10 hidden md:block">
          <h2 className="text-[12vw] font-black tracking-tighter leading-none select-none text-center">
            VAULT
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SnippetVault;
