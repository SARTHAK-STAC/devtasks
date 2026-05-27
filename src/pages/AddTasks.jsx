import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import { useCategory } from "../context/CategoryContext";
import ThemeToggle from "../components/ThemeToggle";

const AddTasks = () => {
  const { dark } = useTheme();
  const { categories, addCategory, deleteCategory } = useCategory();
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("FEATURE");
  const [priority, setPriority] = useState("MEDIUM");
  const [newCategoryInput, setNewCategoryInput] = useState("");
const [showInput, setShowInput] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.trim()) {
      toast.error("Task cannot be empty.", {
        style: { background: "#000000", color: "#ffffff" },
      });
      return;
    }

    const newTask = {
      id: Date.now(),
      text: task,
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    toast.success("Task successfully added to roadmap.", {
      style: { background: "#000000", color: "#ffffff" },
    });
    setTask("");
  };

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    addCategory(newCategoryInput);
    setCategory(newCategoryInput.trim().toUpperCase());
    setNewCategoryInput("");
    setShowInput(false);
    toast.success("Category added.", {
      style: { background: "#000000", color: "#ffffff" },
    });
  };

  const handleDeleteCategory = (cat) => {
    const success = deleteCategory(cat, tasks);
    if (!success) {
      toast.error("Cannot delete — category is in use by a task.", {
        style: { background: "#000000", color: "#ffffff" },
      });
    } else {
      if (category === cat) setCategory(categories[0]);
      toast.success("Category removed.", {
        style: { background: "#000000", color: "#ffffff" },
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 selection:bg-black selection:text-white font-sans antialiased transition-colors duration-300 ${dark ? "bg-zinc-950" : "bg-[#FDFDFD]"}`}>
      {/* React 19 Document Metadata Hoisting */}
      <title>Add Tasks — Dev Tasks Roadmap Planner</title>
      <meta name="description" content="Add new items, track features, outline bugs, refactor listings, and add lists to your developer todo list instantly on Dev Tasks (addtasks)." />
      <meta name="keywords" content="addtasks, add tasks, add lists, devtasks, dev tasks todo, create roadmap, bug tracker" />

      <div className={`w-full max-w-[480px] rounded-5xl p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border flex flex-col items-center text-center relative overflow-hidden transition-colors duration-300 ${dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-neutral-100"}`}>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-black dark:bg-white" />
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="space-y-3 mt-5 mb-12">
          <h1 className={`text-4xl font-black tracking-tight uppercase ${dark ? "text-white" : "text-black"}`}>
            Add Task
          </h1>
          <p className="text-neutral-400 font-medium text-lg">
            What's on your mind today?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="relative group text-left">
            <label
              htmlFor="task-input"
              className="block text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] mb-3 ml-6"
            >
              Task Description
            </label>
            <input
              id="task-input"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Optimize database queries"
              className={`w-full border-2 border-transparent rounded-4xl px-8 py-5 placeholder:text-neutral-300 focus:border-current transition-all duration-300 outline-none font-semibold text-lg shadow-sm ${dark ? "bg-zinc-800 text-white focus:bg-zinc-700" : "bg-neutral-50 text-black focus:bg-white focus:border-black"}`}
              autoFocus
            />
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] mb-3 ml-6">
              Category
            </label>
            <div className="flex flex-wrap items-center gap-3 ml-6">
              {categories.map((opt) => (
                <div key={opt} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCategory(opt)}
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer border ${
                      category === opt
                        ? dark
                          ? "bg-black text-white border-black"
                          : "bg-black text-white border-black"
                        : dark
                          ? "bg-zinc-700 text-neutral-300 border-transparent hover:bg-zinc-600"
                          : "bg-neutral-100 text-neutral-600 border-transparent hover:bg-neutral-200"
                    }`}
                  >
                    {opt}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(opt)}
                    className="text-neutral-400 hover:text-red-500 text-sm font-black transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
              ))}

              {showInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                    placeholder="NEW..."
                    autoFocus
                    className={`w-24 px-2 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 outline-none transition-all duration-200 ${dark ? "bg-zinc-800 text-white border-zinc-600 focus:border-white" : "bg-neutral-50 text-black border-neutral-300 focus:border-black"}`}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border transition-all duration-200 ${dark ? "bg-white text-black" : "bg-black text-white"}`}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInput(false)}
                    className="text-neutral-400 hover:text-red-500 text-sm font-black"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowInput(true)}
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 border-dashed transition-all duration-200 ${dark ? "border-zinc-600 text-zinc-400 hover:border-white hover:text-white" : "border-neutral-300 text-neutral-400 hover:border-black hover:text-black"}`}
                >
                  + Add
                </button>
              )}
            </div>
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] mb-3 ml-6">
              Priority
            </label>

            <div className="flex items-center gap-3 ml-6">
              {[
                { value: "HIGH", color: "bg-red-500 text-white border-red-500/20", inactive: "bg-red-500/10 text-red-500 border-red-200 hover:bg-red-500/20" },
                { value: "MEDIUM", color: "bg-yellow-500 text-white border-yellow-500/20", inactive: "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20" },
                { value: "LOW", color: "bg-blue-500 text-white border-blue-500/20", inactive: "bg-blue-500/10 text-blue-500 border-blue-200 hover:bg-blue-500/20" },
              ].map(({ value, color, inactive }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setPriority(value)}
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer border ${
                    priority === value ? color : inactive
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            id="submit-task-button"
            className={`group w-full font-black py-6 rounded-4xl shadow-2xl active:scale-[0.98] transition-all duration-500 flex items-center justify-center space-x-4 text-xl tracking-wide ${dark ? "bg-white text-black hover:bg-gray-100 shadow-white/20" : "bg-black text-white hover:bg-neutral-800 shadow-black/40"}`}
          >
            <span>CREATE TASK</span>
            <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform duration-300">
              <svg
                className={`w-6 h-6 ${dark ? "text-black" : "text-white"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </form>

        <Link
          to="/dashboard"
          className={`mt-12 font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 ${dark ? "text-neutral-400 hover:text-white" : "text-neutral-400 hover:text-black"}`}
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className={`fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] -z-10 opacity-60 ${dark ? "bg-zinc-800" : "bg-neutral-100"}`} />
      <div className={`fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] -z-10 opacity-60 ${dark ? "bg-zinc-900" : "bg-neutral-50"}`} />
    </div>
  );
};

export default AddTasks;
