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
                <Link to="/dashboard" className="w-full sm:w-auto">
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
                <a
                  href="https://github.com/shamilahmdt/devtasks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <button
                    id="github-button"
                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer border flex items-center justify-center gap-2 ${
                      dark
                        ? "bg-zinc-900 border-zinc-800 text-zinc-100 hover:text-white hover:bg-zinc-900/80 hover:border-zinc-700 shadow-md"
                        : "bg-white border-neutral-200 text-neutral-800 hover:text-black hover:bg-neutral-50 hover:border-neutral-300 shadow-sm"
                    }`}
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.164 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span>GitHub</span>
                  </button>
                </a>
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
