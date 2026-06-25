import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTheme } from "../../../context/ThemeContext";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SPECIAL = "!@#$%^&*()_+~|}{[]:;?><,./-=";
const SIMILAR = "il1Lo0O";

export default function PasswordGenerator() {
  const { dark } = useTheme();

  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [special, setSpecial] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [testPassword, setTestPassword] = useState("");

  const generatePassword = () => {
    let pool = "";

    if (uppercase) pool += UPPER;
    if (lowercase) pool += LOWER;
    if (numbers) pool += NUMBERS;
    if (special) pool += SPECIAL;

    if (excludeSimilar) {
      pool = [...pool].filter((char) => !SIMILAR.includes(char)).join("");
    }

    if (!pool.length) {
      setGeneratedPassword("");
      return;
    }

    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      result += pool[randomIndex];
    }

    setGeneratedPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, uppercase, lowercase, numbers, special, excludeSimilar]);

  const getPoolSize = (password) => {
    let size = 0;

    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/[0-9]/.test(password)) size += 10;
    if (/[^a-zA-Z0-9]/.test(password)) size += 33;

    return size;
  };

  const calculateEntropy = (password) => {
    const poolSize = getPoolSize(password);

    if (!password || !poolSize) return 0;

    return password.length * Math.log2(poolSize);
  };

  const entropy = calculateEntropy(testPassword);

  const getStrength = () => {
    if (entropy < 40) return "Weak";
    if (entropy < 70) return "Medium";
    if (entropy < 100) return "Strong";
    return "Secure";
  };

  const getCrackTime = () => {
    if (entropy < 40) return "Minutes to Hours";
    if (entropy < 60) return "Days to Months";
    if (entropy < 80) return "Years";
    if (entropy < 100) return "Thousands of Years";
    return "Effectively Uncrackable";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      toast.success("Password copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="w-full p-5 sm:p-8 overflow-y-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="flex flex-col gap-4">
          <div>
            <label
              className={`text-xs font-black uppercase tracking-widest ${
                dark ? "text-zinc-400" : "text-neutral-500"
              }`}
            >
              Password Length
            </label>

            <div
              className={`mt-2 px-4 py-4 rounded-2xl border ${
                dark
                  ? "bg-zinc-950 border-zinc-800"
                  : "bg-neutral-50 border-neutral-300"
              }`}
            >
              <div className="flex justify-between mb-2">
                <span>{length}</span>
                <span>128</span>
              </div>

              <input
                type="range"
                min="6"
                max="128"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-black dark:accent-white"
              />
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              dark
                ? "bg-zinc-950 border-zinc-800"
                : "bg-neutral-50 border-neutral-300"
            }`}
          >
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="h-4 w-4 accent-black dark:accent-white"
              />
              Uppercase (A-Z)
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="h-4 w-4 accent-black dark:accent-white"
              />
              Lowercase (a-z)
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="h-4 w-4 accent-black dark:accent-white"
              />
              Numbers (0-9)
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={special}
                onChange={(e) => setSpecial(e.target.checked)}
                className="h-4 w-4 accent-black dark:accent-white"
              />
              Special Characters
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="h-4 w-4 accent-black dark:accent-white"
              />
              Exclude Similar Characters
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={generatePassword}
              className={`px-4 py-3 rounded-xl border font-bold ${
                dark
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              Generate
            </button>

            <button
              onClick={handleCopy}
              className={`px-4 py-3 rounded-xl border font-bold ${
                dark
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              Copy
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-4">
          <div>
            <label
              className={`text-xs font-black uppercase tracking-widest ${
                dark ? "text-zinc-400" : "text-neutral-500"
              }`}
            >
              Generated Password
            </label>

            <div
              className={`mt-2 p-4 rounded-2xl border break-all font-mono text-lg ${
                dark
                  ? "bg-zinc-950 border-zinc-800 text-white"
                  : "bg-neutral-50 border-neutral-300 text-black"
              }`}
            >
              {generatedPassword}
            </div>
          </div>

          <div>
            <label
              className={`text-xs font-black uppercase tracking-widest ${
                dark ? "text-zinc-400" : "text-neutral-500"
              }`}
            >
              Strength Analyzer
            </label>

            <textarea
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Enter password to analyze..."
              className={`mt-2 w-full h-28 px-4 py-3 rounded-2xl border resize-none ${
                dark
                  ? "bg-zinc-950 border-zinc-800 text-white"
                  : "bg-neutral-50 border-neutral-300 text-black"
              }`}
            />
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              dark
                ? "bg-zinc-950 border-zinc-800"
                : "bg-neutral-50 border-neutral-300"
            }`}
          >
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Strength</span>
                  <span>{getStrength()}</span>
                </div>

                <div
                  className={`h-3 rounded-full ${
                    dark ? "bg-zinc-800" : "bg-neutral-200"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-current"
                    style={{
                      width:
                        getStrength() === "Weak"
                          ? "25%"
                          : getStrength() === "Medium"
                            ? "50%"
                            : getStrength() === "Strong"
                              ? "75%"
                              : "100%",
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <span>Entropy</span>
                <span>{calculateEntropy(testPassword).toFixed(2)} bits</span>
              </div>

              <div className="flex justify-between">
                <span>Crack Time</span>
                <span>{getCrackTime()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
