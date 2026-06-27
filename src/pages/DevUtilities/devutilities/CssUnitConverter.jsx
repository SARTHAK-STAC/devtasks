import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../../context/ThemeContext";

const CssUnitConverter = () => {
  const { dark } = useTheme();
  
  // Tab State
  const [activeTab, setActiveTab] = useState("converter"); // "converter" | "fluid"

  // Converter State
  const [baseFontSize, setBaseFontSize] = useState("16");
  const [pxValue, setPxValue] = useState(16);
  const [inputs, setInputs] = useState({
    px: "16.00",
    rem: "1.0000",
    em: "1.0000",
    percent: "100.00",
  });

  // Fluid Typography State
  const [fluidParams, setFluidParams] = useState({
    minFont: "16",
    maxFont: "48",
    minVw: "320",
    maxVw: "1200",
  });
  const [previewVw, setPreviewVw] = useState(768);

  // --- Handlers for Unit Converter ---
  const handleUnitChange = (unit, valStr) => {
    setInputs((prev) => {
      const nextInputs = { ...prev, [unit]: valStr };
      const val = parseFloat(valStr);
      const base = parseFloat(baseFontSize) || 16;
      
      if (isNaN(val)) {
        Object.keys(nextInputs).forEach((key) => {
          if (key !== unit) {
            nextInputs[key] = "";
          }
        });
        setPxValue(0);
        return nextInputs;
      }

      let px;
      switch (unit) {
        case "px":
          px = val;
          break;
        case "rem":
        case "em":
          px = val * base;
          break;
        case "percent":
          px = (val / 100) * base;
          break;
        default:
          px = 0;
      }
      setPxValue(px);

      // Recalculate other fields
      if (unit !== "px") {
        nextInputs.px = px.toFixed(2);
      }
      if (unit !== "rem") {
        nextInputs.rem = (px / base).toFixed(4);
      }
      if (unit !== "em") {
        nextInputs.em = (px / base).toFixed(4);
      }
      if (unit !== "percent") {
        nextInputs.percent = ((px / base) * 100).toFixed(2);
      }

      return nextInputs;
    });
  };

  const handleBaseFontSizeChange = (valStr) => {
    setBaseFontSize(valStr);
    const parsedBase = parseFloat(valStr);
    if (!isNaN(parsedBase) && parsedBase > 0) {
      setInputs((prev) => ({
        ...prev,
        rem: (pxValue / parsedBase).toFixed(4),
        em: (pxValue / parsedBase).toFixed(4),
        percent: ((pxValue / parsedBase) * 100).toFixed(2),
      }));
    }
  };

  // --- Handlers for Fluid Typography ---
  const handleFluidChange = (e) => {
    const { name, value } = e.target;
    setFluidParams((prev) => ({ ...prev, [name]: value }));
  };

  const clampValue = useMemo(() => {
    const minFont = parseFloat(fluidParams.minFont) || 0;
    const maxFont = parseFloat(fluidParams.maxFont) || 0;
    const minVw = parseFloat(fluidParams.minVw) || 0;
    const maxVw = parseFloat(fluidParams.maxVw) || 0;
    const base = parseFloat(baseFontSize) || 16;
    
    if (!minFont || !maxFont || !minVw || !maxVw || maxVw <= minVw || maxFont <= minFont || base <= 0) {
      return "clamp(0rem, 0rem, 0rem)";
    }
    
    const minRem = minFont / base;
    const maxRem = maxFont / base;
    
    const slope = (maxFont - minFont) / (maxVw - minVw);
    const slopeVw = slope * 100;
    
    const intersection = (-1 * minVw * slope + minFont) / base;
    
    return `clamp(${minRem.toFixed(4)}rem, ${intersection.toFixed(4)}rem + ${slopeVw.toFixed(4)}vw, ${maxRem.toFixed(4)}rem)`;
  }, [fluidParams, baseFontSize]);

  const getSimulatedFontSize = useCallback(() => {
    const minFont = parseFloat(fluidParams.minFont) || 0;
    const maxFont = parseFloat(fluidParams.maxFont) || 0;
    const minVw = parseFloat(fluidParams.minVw) || 0;
    const maxVw = parseFloat(fluidParams.maxVw) || 0;
    
    if (minVw === maxVw || maxVw <= minVw) return `${minFont}px`;
    
    const slope = (maxFont - minFont) / (maxVw - minVw);
    const intersection = -1 * minVw * slope + minFont;
    
    const currentVal = intersection + slope * previewVw;
    const clampedVal = Math.max(minFont, Math.min(maxFont, currentVal));
    
    return `${clampedVal.toFixed(2)}px`;
  }, [fluidParams, previewVw]);

  const handleCopyClamp = () => {
    navigator.clipboard.writeText(`font-size: ${clampValue};`)
      .then(() => toast.success("Clamp function copied!"))
      .catch(() => toast.error("Failed to copy."));
  };

  // Input Class helper
  const inputClass = `w-full px-4 py-3 rounded-2xl border text-sm font-mono outline-none transition-all duration-300 ${
    dark
      ? "bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:border-white focus:ring-1 focus:ring-white"
      : "bg-neutral-50 border-neutral-200 text-zinc-800 placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
  }`;

  return (
    <div
      className={`min-h-[calc(100vh-76px)] md:h-[calc(100vh-76px)] px-4 sm:px-6 py-6 transition-colors duration-300 overflow-y-auto overflow-x-hidden md:overflow-hidden relative flex flex-col justify-center ${
        dark ? "bg-zinc-950" : "bg-[#F7F7F7]"
      }`}
    >
      <title>CSS Unit & Fluid Typography — DevTasks</title>

      {/* Background glows */}
      <div
        className={`absolute top-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] opacity-30 transition-colors duration-500 ${
          dark ? "bg-zinc-800" : "bg-neutral-200"
        }`}
      />
      
      {/* Main card */}
      <div
        className={`relative z-10 w-full max-w-5xl md:mx-auto rounded-[32px] border shadow-xl flex flex-col max-h-full md:max-h-[85vh] overflow-hidden transition-all duration-300 ${
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
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full min-w-0">
          <div className="flex items-center gap-3">
            <Link
              to="/devutilities"
              className={`p-2.5 rounded-xl border transition-all duration-200 active:scale-95 flex items-center justify-center shrink-0 ${
                dark
                  ? "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600"
                  : "bg-white border-neutral-200 text-neutral-600 hover:text-black hover:border-neutral-350"
              }`}
              title="Back to Workspace"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex flex-col min-w-0">
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight truncate transition-colors duration-300 ${dark ? "text-white" : "text-black"}`}>
                CSS Unit & Fluid Typography
              </h1>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("converter")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                activeTab === "converter"
                  ? dark ? "bg-white text-black" : "bg-black text-white"
                  : dark ? "bg-zinc-800 text-zinc-400" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              Unit Converter
            </button>
            <button
              onClick={() => setActiveTab("fluid")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                activeTab === "fluid"
                  ? dark ? "bg-white text-black" : "bg-black text-white"
                  : dark ? "bg-zinc-800 text-zinc-400" : "bg-neutral-200 text-neutral-600"
              }`}
            >
              Fluid Typography
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
          <div className="flex flex-col gap-6">
            
            {/* Base Font Size Configuration (Common) */}
            <div className="w-full md:w-1/3">
              <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>
                Base Root Font Size (px)
              </label>
              <input
                type="number"
                value={baseFontSize}
                onChange={(e) => handleBaseFontSizeChange(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* TAB: Unit Converter */}
            {activeTab === "converter" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div>
                    <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>Pixels (px)</label>
                    <input type="number" value={inputs.px} onChange={(e) => handleUnitChange("px", e.target.value)} className={inputClass} />
                 </div>
                 <div>
                    <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>REM (rem)</label>
                    <input type="number" value={inputs.rem} onChange={(e) => handleUnitChange("rem", e.target.value)} className={inputClass} />
                 </div>
                 <div>
                    <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>EM (em)</label>
                    <input type="number" value={inputs.em} onChange={(e) => handleUnitChange("em", e.target.value)} className={inputClass} />
                 </div>
                 <div>
                    <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>Percent (%)</label>
                    <input type="number" value={inputs.percent} onChange={(e) => handleUnitChange("percent", e.target.value)} className={inputClass} />
                 </div>
              </div>
            )}

            {/* TAB: Fluid Typography */}
            {activeTab === "fluid" && (
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-black"}`}>Target Font Sizes (px)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>Min Size</label>
                        <input type="number" name="minFont" value={fluidParams.minFont} onChange={handleFluidChange} className={inputClass} />
                      </div>
                      <div>
                        <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>Max Size</label>
                        <input type="number" name="maxFont" value={fluidParams.maxFont} onChange={handleFluidChange} className={inputClass} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-black"}`}>Viewport Boundaries (px)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>Min Viewport</label>
                        <input type="number" name="minVw" value={fluidParams.minVw} onChange={handleFluidChange} className={inputClass} />
                      </div>
                      <div>
                        <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"} mb-2 block`}>Max Viewport</label>
                        <input type="number" name="maxVw" value={fluidParams.maxVw} onChange={handleFluidChange} className={inputClass} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Output Clamp Code */}
                <div className={`p-6 rounded-2xl border ${dark ? "bg-zinc-950/50 border-zinc-800" : "bg-neutral-100 border-neutral-200"}`}>
                   <div className="flex justify-between items-center mb-4">
                       <span className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"}`}>Generated CSS</span>
                       <button onClick={handleCopyClamp} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${dark ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-white border text-black hover:bg-neutral-50"}`}>
                         Copy Clamp
                       </button>
                    </div>
                    <code className={`block font-mono text-sm p-4 rounded-xl ${dark ? "bg-black text-neon-blue" : "bg-white border"}`}>
                       font-size: {clampValue};
                    </code>
                </div>

                {/* Live Preview Slider */}
                <div className={`p-6 rounded-2xl border flex flex-col gap-4 ${dark ? "bg-zinc-950/50 border-zinc-800" : "bg-neutral-100 border-neutral-200"}`}>
                   <label className={`text-xs font-black uppercase tracking-widest ${dark ? "text-zinc-400" : "text-neutral-500"}`}>Live Preview (Drag Slider)</label>
                   <input
                     type="range"
                     min={(parseFloat(fluidParams.minVw) || 320) - 200}
                     max={(parseFloat(fluidParams.maxVw) || 1200) + 200}
                     value={previewVw}
                     onChange={(e) => setPreviewVw(parseFloat(e.target.value) || 0)}
                     className="w-full"
                   />
                   <div className="mt-4 border-t pt-4 border-dashed" style={{ borderColor: dark ? "#3f3f46" : "#d4d4d8" }}>
                     <p className={`mb-2 text-sm font-mono ${dark ? "text-zinc-500" : "text-zinc-400"}`}>
                       Simulated Viewport: {previewVw}px (Calculated Font Size: {getSimulatedFontSize()})
                     </p>
                     <div 
                        className={`transition-all duration-75 font-semibold ${dark ? "text-white" : "text-black"}`}
                        style={{ fontSize: getSimulatedFontSize() }}
                     >
                       The quick brown fox jumps over the lazy dog.
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssUnitConverter;
