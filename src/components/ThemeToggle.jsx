import { FaMoon, FaSun, FaGithub } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border transition-all duration-200 hover:scale-105 cursor-pointer ${
          dark
            ? "bg-white text-black border-white hover:bg-gray-100"
            : "bg-black text-white border-black hover:bg-neutral-800"
        }`}
      >
        {dark ? <FaSun className="w-3 h-3" /> : <FaMoon className="w-3 h-3" />}
        {dark ? "Light Mode" : "Dark Mode"}
      </button>

      <a
        href="https://github.com/shamilahmdt/devtasks/"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center p-2 rounded-full border transition-all duration-200 hover:scale-105 cursor-pointer ${
          dark
            ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
            : "bg-white border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-350"
        }`}
        title="View on GitHub"
      >
        <FaGithub className="w-4 h-4" />
      </a>
    </div>
  );
};

export default ThemeToggle;
