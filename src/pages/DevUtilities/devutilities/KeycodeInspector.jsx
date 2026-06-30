import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

export default function KeycodeInspector() {
  const { dark } = useTheme();

  const theme = {
    light: {
      wrapper: "bg-[#F8F9FA] text-zinc-900",
      card: "bg-white border-zinc-200/85 shadow-sm",
      cardSoft: "bg-zinc-50 border-zinc-200/85",
      border: "border-zinc-200",
      textMuted: "text-zinc-500",
      activeKey: "bg-black text-white border-black shadow-[0_4px_12px_rgba(0,0,0,0.15)] scale-[0.97]",
      inactiveKey: "bg-white border-zinc-250 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50",
      modifierActive: "bg-black text-white border-black font-black",
      modifierInactive: "bg-white border-zinc-250 text-zinc-500",
    },
    dark: {
      wrapper: "bg-[#090A0F] text-zinc-100",
      card: "bg-zinc-900/40 border-zinc-800/85 backdrop-blur-md shadow-lg",
      cardSoft: "bg-zinc-950/50 border-zinc-800/80",
      border: "border-zinc-850",
      textMuted: "text-zinc-500",
      activeKey: "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.35)] scale-[0.97]",
      inactiveKey: "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/80",
      modifierActive: "bg-white text-black border-white font-black",
      modifierInactive: "bg-zinc-900/60 border-zinc-800 text-zinc-500",
    },
  };

  const t = dark ? theme.dark : theme.light;

  const [eventData, setEventData] = useState({
    key: "Press any key",
    code: "-",
    keyCode: "-",
    location: "-",
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target.tagName;

      // Don't intercept if typing in input/textarea
      if (
        target === "INPUT" ||
        target === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Prevent default browser actions for keys that scroll or navigate
      if (["Space", "ArrowUp", "ArrowDown", "Tab", "Backspace"].includes(e.code)) {
        e.preventDefault();
      }

      const locationText =
        e.location === 0
          ? "Standard"
          : e.location === 1
          ? "Left"
          : e.location === 2
          ? "Right"
          : "Numpad";

      setEventData({
        key: e.key === " " ? "Space" : e.key,
        code: e.code,
        keyCode: e.keyCode || e.which,
        location: locationText,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
      });

      setHistory((prev) => [
        {
          key: e.key === " " ? "Space" : e.key,
          code: e.code,
          keyCode: e.keyCode || e.which,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ].slice(0, 10));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Keyboard Rows definition
  const keyboardRows = [
    [
      { label: "Esc", code: "Escape", width: "w-10 md:w-12" },
      { label: "1", code: "Digit1" },
      { label: "2", code: "Digit2" },
      { label: "3", code: "Digit3" },
      { label: "4", code: "Digit4" },
      { label: "5", code: "Digit5" },
      { label: "6", code: "Digit6" },
      { label: "7", code: "Digit7" },
      { label: "8", code: "Digit8" },
      { label: "9", code: "Digit9" },
      { label: "0", code: "Digit0" },
      { label: "⌫", code: "Backspace", width: "flex-1 min-w-[40px]" },
    ],
    [
      { label: "Tab", code: "Tab", width: "w-12 md:w-14" },
      { label: "Q", code: "KeyQ" },
      { label: "W", code: "KeyW" },
      { label: "E", code: "KeyE" },
      { label: "R", code: "KeyR" },
      { label: "T", code: "KeyT" },
      { label: "Y", code: "KeyY" },
      { label: "U", code: "KeyU" },
      { label: "I", code: "KeyI" },
      { label: "O", code: "KeyO" },
      { label: "P", code: "KeyP" },
      { label: "[", code: "BracketLeft" },
      { label: "]", code: "BracketRight" },
    ],
    [
      { label: "Caps", code: "CapsLock", width: "w-14 md:w-16" },
      { label: "A", code: "KeyA" },
      { label: "S", code: "KeyS" },
      { label: "D", code: "KeyD" },
      { label: "F", code: "KeyF" },
      { label: "G", code: "KeyG" },
      { label: "H", code: "KeyH" },
      { label: "J", code: "KeyJ" },
      { label: "K", code: "KeyK" },
      { label: "L", code: "KeyL" },
      { label: ";", code: "Semicolon" },
      { label: "Enter", code: "Enter", width: "flex-1 min-w-[55px]" },
    ],
    [
      { label: "Shift", code: "ShiftLeft", width: "w-16 md:w-20" },
      { label: "Z", code: "KeyZ" },
      { label: "X", code: "KeyX" },
      { label: "C", code: "KeyC" },
      { label: "V", code: "KeyV" },
      { label: "B", code: "KeyB" },
      { label: "N", code: "KeyN" },
      { label: "M", code: "KeyM" },
      { label: ",", code: "Comma" },
      { label: ".", code: "Period" },
      { label: "Shift", code: "ShiftRight", width: "flex-1 min-w-[60px]" },
    ],
    [
      { label: "Ctrl", code: "ControlLeft", width: "w-10 md:w-12" },
      { label: "Win", code: "MetaLeft", width: "w-10 md:w-12" },
      { label: "Alt", code: "AltLeft", width: "w-10 md:w-12" },
      { label: "Space", code: "Space", width: "flex-[4] min-w-[100px]" },
      { label: "Alt", code: "AltRight", width: "w-10 md:w-12" },
      { label: "Win", code: "MetaRight", width: "w-10 md:w-12" },
      { label: "Ctrl", code: "ControlRight", width: "w-10 md:w-12" },
    ],
  ];

  const KeyboardKey = ({ label, code, className = "", width = "w-8 md:w-9 lg:w-10", height = "h-8 md:h-9 lg:h-10" }) => {
    const isActive = eventData.code === code;
    const widthClass = width || "w-8 md:w-9 lg:w-10";
    const heightClass = height || "h-8 md:h-9 lg:h-10";

    return (
      <div
        className={`border rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-100 ${heightClass} ${widthClass} ${
          isActive ? t.activeKey : t.inactiveKey
        } ${className}`}
      >
        {label}
      </div>
    );
  };

  return (
    <div className={`${t.wrapper} min-h-screen w-full font-sans p-4 md:p-8 transition-colors duration-300`}>
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Back Link */}
        <Link
          to="/devutilities"
          className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all duration-300 w-fit ${
            dark ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black"
          }`}
        >
          <span>← Back to Utilities</span>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">
            Keycode Inspector
          </h1>
          <p className={`text-sm font-medium ${t.textMuted}`}>
            Press any key on your keyboard to inspect its event values, keycode, and modifier states.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Dashboard & Modifiers */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Giant Keycode Display & Metadata */}
            <div className={`p-6 sm:p-8 border rounded-3xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 ${t.card}`}>
              
              {/* Big Circle/Square Code Display */}
              <div className={`w-32 h-32 shrink-0 rounded-2xl border flex flex-col items-center justify-center ${t.cardSoft}`}>
                <span className={`text-[10px] font-black uppercase tracking-wider ${t.textMuted}`}>
                  event.keyCode
                </span>
                <span className="text-5xl font-black tracking-tight mt-1 tabular-nums">
                  {eventData.keyCode}
                </span>
              </div>

              {/* Data Table */}
              <div className="w-full grid grid-cols-2 gap-4">
                {[
                  { label: "event.key", value: eventData.key },
                  { label: "event.code", value: eventData.code },
                  { label: "event.location", value: eventData.location },
                  { label: "event.which", value: eventData.keyCode },
                ].map((item) => (
                  <div key={item.label} className="min-w-0">
                    <div className={`text-[10px] font-black uppercase tracking-wider ${t.textMuted}`}>
                      {item.label}
                    </div>
                    <div className="text-base font-bold mt-1 truncate font-mono">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modifier Keys State */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Ctrl", active: eventData.ctrl },
                { name: "Shift", active: eventData.shift },
                { name: "Alt", active: eventData.alt },
                { name: "Meta / Win", active: eventData.meta },
              ].map((mod) => (
                <div
                  key={mod.name}
                  className={`border rounded-2xl py-3 px-4 text-center text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    mod.active ? t.modifierActive : t.modifierInactive
                  }`}
                >
                  {mod.name}
                </div>
              ))}
            </div>

            {/* Visual Keyboard */}
            <div className={`p-5 border rounded-3xl hidden md:flex flex-col gap-2.5 ${t.card}`}>
              <div className="flex justify-between items-center mb-2 px-1">
                <h3 className="text-xs font-black uppercase tracking-wider">
                  Interactive Keyboard Layout
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${t.textMuted}`}>
                  Full Desktop Layout
                </span>
              </div>

              <div className="flex gap-4 lg:gap-6 justify-between items-start w-full select-none">
                {/* Main Keyboard */}
                <div className="flex flex-col gap-1.5 md:gap-2 flex-1 min-w-[500px]">
                  {keyboardRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1 md:gap-1.5 w-full justify-between">
                      {row.map((key) => (
                        <KeyboardKey
                          key={key.code}
                          label={key.label}
                          code={key.code}
                          width={key.width}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Vertical Divider */}
                <div className={`w-[1px] self-stretch ${dark ? "bg-zinc-800" : "bg-zinc-200"}`} />

                {/* Numpad */}
                <div className="grid grid-cols-4 gap-1 md:gap-1.5 w-[130px] md:w-[150px] lg:w-[170px] shrink-0">
                  {/* Row 1 */}
                  <KeyboardKey label="Num" code="NumLock" width="w-full" />
                  <KeyboardKey label="/" code="NumpadDivide" width="w-full" />
                  <KeyboardKey label="*" code="NumpadMultiply" width="w-full" />
                  <KeyboardKey label="-" code="NumpadSubtract" width="w-full" />

                  {/* Row 2 & 3 */}
                  <KeyboardKey label="7" code="Numpad7" width="w-full" />
                  <KeyboardKey label="8" code="Numpad8" width="w-full" />
                  <KeyboardKey label="9" code="Numpad9" width="w-full" />
                  <KeyboardKey label="+" code="NumpadAdd" className="row-span-2" width="w-full" height="h-full" />

                  <KeyboardKey label="4" code="Numpad4" width="w-full" />
                  <KeyboardKey label="5" code="Numpad5" width="w-full" />
                  <KeyboardKey label="6" code="Numpad6" width="w-full" />
                  {/* + spans here */}

                  {/* Row 4 & 5 */}
                  <KeyboardKey label="1" code="Numpad1" width="w-full" />
                  <KeyboardKey label="2" code="Numpad2" width="w-full" />
                  <KeyboardKey label="3" code="Numpad3" width="w-full" />
                  <KeyboardKey label="Enter" code="NumpadEnter" className="row-span-2" width="w-full" height="h-full" />

                  <KeyboardKey label="0" code="Numpad0" className="col-span-2" width="w-full" />
                  <KeyboardKey label="." code="NumpadDecimal" width="w-full" />
                  {/* Enter spans here */}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: History Log */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-wider px-1">
              Key Event History
            </h3>
            
            <div className={`border rounded-3xl overflow-hidden divide-y ${t.card} ${dark ? "divide-zinc-800/60" : "divide-zinc-200"}`}>
              {history.length === 0 ? (
                <div className={`p-8 text-center text-sm font-medium ${t.textMuted}`}>
                  Press any key to record history log...
                </div>
              ) : (
                history.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-5 py-3.5 transition-colors hover:bg-zinc-500/5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold uppercase tracking-tight truncate">
                        {item.key}
                      </p>
                      <p className={`text-[10px] font-mono mt-0.5 ${t.textMuted}`}>
                        {item.code}
                      </p>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold tabular-nums">
                        {item.keyCode}
                      </span>
                      <p className={`text-[9px] mt-0.5 font-medium ${t.textMuted}`}>
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}