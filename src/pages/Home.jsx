import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const { dark } = useTheme();

  return (
    <div
      className={`min-h-screen w-full overflow-hidden flex flex-col transition-colors duration-300 ${
        dark ? "bg-zinc-950 text-white" : "bg-[#FDFDFD] text-black"
      }`}
    >
      {/* React 19 Document Metadata Hoisting */}
      <title>
        Dev Tasks — Sleek & High-Performance Developer Todo Application
      </title>

      <meta
        name="description"
        content="Manage your engineering workflow with Dev Tasks (devtasks). The ultimate todo, list-maker, and roadmap tool tailored for modern developer teams."
      />

      <meta
        name="keywords"
        content="dev tasks, devtasks, todo, add lists, addtasks, developer task manager"
      />

      {/* Background Blur */}
      <div
        className={`fixed top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] opacity-50 -z-10 ${
          dark ? "bg-zinc-800" : "bg-neutral-200"
        }`}
      />

      <div
        className={`fixed bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] opacity-50 -z-10 ${
          dark ? "bg-zinc-900" : "bg-neutral-100"
        }`}
      />

      {/* Header */}
      <header className="w-full px-5 sm:px-8 lg:px-14 py-6 flex items-center justify-between">
        <div>
          <h2
            className={`text-xl sm:text-2xl font-black uppercase tracking-tight ${
              dark ? "text-white" : "text-black"
            }`}
          >
            Dev Tasks
          </h2>
        </div>

        <ThemeToggle />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-5 sm:px-8 lg:px-14 py-10">
        <div className="w-[85%] max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">
            {/* LEFT CONTENT */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-5">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-bold uppercase tracking-[0.25em] ${
                    dark
                      ? "border-zinc-700 bg-zinc-900 text-zinc-300"
                      : "border-neutral-200 bg-white text-neutral-500"
                  }`}
                >
                  Productivity • Workflow • Roadmaps
                </div>

                <h1
                  className={`text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.9] uppercase tracking-tight ${
                    dark ? "text-white" : "text-black"
                  }`}
                >
                  Dev <br />
                  <span
                    className={`${dark ? "text-zinc-500" : "text-neutral-300"}`}
                  >
                    Tasks
                  </span>
                </h1>

                <p
                  className={`max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed font-medium ${
                    dark ? "text-zinc-400" : "text-neutral-500"
                  }`}
                >
                  Organize features, track bugs, manage refactors, and build
                  modern developer workflows with a clean and minimal task
                  management experience.
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/dashboard">
                  <button
                    id="get-started-button"
                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer ${
                      dark
                        ? "bg-white text-black hover:bg-zinc-200 shadow-[0_20px_60px_rgba(255,255,255,0.15)]"
                        : "bg-black text-white hover:bg-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                    }`}
                  >
                    Get Started
                  </button>
                </Link>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  {
                    value: "Fast",
                    label: "Performance",
                  },
                  {
                    value: "Clean",
                    label: "UI Design",
                  },
                  {
                    value: "Smart",
                    label: "Workflow",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-3xl p-4 sm:p-5 border transition-all duration-300 ${
                      dark
                        ? "bg-zinc-900 border-zinc-800"
                        : "bg-white border-neutral-100"
                    }`}
                  >
                    <h3 className="text-lg sm:text-2xl font-black">
                      {item.value}
                    </h3>

                    <p
                      className={`text-[11px] sm:text-xs uppercase tracking-widest mt-1 ${
                        dark ? "text-zinc-500" : "text-neutral-400"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="relative w-full">
              <div
                className={`relative rounded-[2rem] border p-5 sm:p-8 shadow-xl transition-colors duration-300 ${
                  dark
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-neutral-100"
                }`}
              >
                {/* TOP BAR */}
                <div className="flex items-center justify-between mb-8">
                  <div
                    className={`h-3 w-28 rounded-full ${
                      dark ? "bg-zinc-700" : "bg-neutral-200"
                    }`}
                  />

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        dark ? "bg-zinc-700" : "bg-neutral-200"
                      }`}
                    />

                    <div
                      className={`w-3 h-3 rounded-full ${
                        dark ? "bg-zinc-700" : "bg-neutral-200"
                      }`}
                    />

                    <div
                      className={`w-3 h-3 rounded-full ${
                        dark ? "bg-zinc-700" : "bg-neutral-200"
                      }`}
                    />
                  </div>
                </div>

                {/* TASKS */}
                <div className="space-y-4">
                  {/* Task 1 */}
                  <div
                    className={`flex items-center gap-4 rounded-2xl border p-4 ${
                      dark
                        ? "bg-zinc-800 border-zinc-700"
                        : "bg-neutral-50 border-neutral-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border-2 ${
                        dark ? "border-zinc-500" : "border-neutral-300"
                      }`}
                    />

                    <div className="flex-1">
                      <div
                        className={`h-3 w-3/4 rounded-full ${
                          dark ? "bg-zinc-600" : "bg-neutral-200"
                        }`}
                      />

                      <div
                        className={`h-2 w-1/3 rounded-full mt-2 ${
                          dark ? "bg-zinc-700" : "bg-neutral-100"
                        }`}
                      />
                    </div>

                    <span className="text-[10px] px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 font-black uppercase">
                      LOW
                    </span>
                  </div>

                  {/* Task 2 */}
                  <div
                    className={`flex items-center gap-4 rounded-2xl border p-4 ${
                      dark
                        ? "bg-zinc-800 border-zinc-700"
                        : "bg-neutral-50 border-neutral-100"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-lg bg-black flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div
                        className={`h-3 w-2/3 rounded-full ${
                          dark ? "bg-zinc-600" : "bg-neutral-200"
                        }`}
                      />

                      <div
                        className={`h-2 w-1/4 rounded-full mt-2 ${
                          dark ? "bg-zinc-700" : "bg-neutral-100"
                        }`}
                      />
                    </div>

                    <span className="text-[10px] px-3 py-1 rounded-full bg-red-500/10 text-red-500 font-black uppercase">
                      HIGH
                    </span>
                  </div>

                  {/* Task 3 */}
                  <div
                    className={`flex items-center gap-4 rounded-2xl border p-4 opacity-60 ${
                      dark
                        ? "bg-zinc-800 border-zinc-700"
                        : "bg-neutral-50 border-neutral-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border-2 ${
                        dark ? "border-zinc-700" : "border-neutral-200"
                      }`}
                    />

                    <div className="flex-1">
                      <div
                        className={`h-3 w-1/2 rounded-full ${
                          dark ? "bg-zinc-700" : "bg-neutral-100"
                        }`}
                      />

                      <div
                        className={`h-2 w-1/4 rounded-full mt-2 ${
                          dark ? "bg-zinc-800" : "bg-neutral-50"
                        }`}
                      />
                    </div>

                    <span className="text-[10px] px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 font-black uppercase">
                      Medium
                    </span>
                  </div>
                </div>

                {/* FOOTER */}
                <div
                  className={`mt-8 pt-6 border-t flex items-center justify-between ${
                    dark ? "border-zinc-800" : "border-neutral-100"
                  }`}
                >
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-full border-2 ${
                          dark
                            ? "bg-zinc-700 border-zinc-900"
                            : "bg-neutral-200 border-white"
                        }`}
                      />
                    ))}
                  </div>

                  <div
                    className={`text-xs font-black uppercase tracking-[0.25em] ${
                      dark ? "text-zinc-500" : "text-neutral-400"
                    }`}
                  >
                    Productivity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BACKGROUND TEXT */}
      <div className="fixed bottom-0 right-0 pointer-events-none select-none opacity-[0.03] -z-10">
        <h2
          className={`text-[28vw] font-black leading-none tracking-tighter ${
            dark ? "text-white" : "text-black"
          }`}
        >
          TASK
        </h2>
      </div>
    </div>
  );
};

export default Home;
