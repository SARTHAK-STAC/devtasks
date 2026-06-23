import { useState } from "react";

const presets = [
  {
    name: "Sunset",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#ff512f", pos: 0 },
      { color: "#dd2476", pos: 100 },
    ],
  },
  {
    name: "Ocean",
    type: "linear",
    angle: 120,
    stops: [
      { color: "#2193b0", pos: 0 },
      { color: "#6dd5ed", pos: 100 },
    ],
  },
  {
    name: "Purple Bliss",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#360033", pos: 0 },
      { color: "#0b8793", pos: 100 },
    ],
  },
];

export default function CssGradientGenerator() {
  const [type, setType] = useState("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState([
    { color: "#ff0000", pos: 0 },
    { color: "#0000ff", pos: 100 },
  ]);

  const gradient = () => {
    const sorted = [...stops].sort((a, b) => a.pos - b.pos);
    const stopStr = sorted.map(s => `${s.color} ${s.pos}%`).join(", ");

    if (type === "radial") {
      return `radial-gradient(circle, ${stopStr})`;
    }
    return `linear-gradient(${angle}deg, ${stopStr})`;
  };

  const addStop = () => {
    setStops([...stops, { color: "#ffffff", pos: 50 }]);
  };

  const updateStop = (i, key, value) => {
    const copy = [...stops];
    copy[i][key] = value;
    setStops(copy);
  };

  const removeStop = (i) => {
    setStops(stops.filter((_, idx) => idx !== i));
  };

  const randomize = () => {
    const randColor = () =>
      "#" + Math.floor(Math.random() * 16777215).toString(16);

    setStops([
      { color: randColor(), pos: 0 },
      { color: randColor(), pos: 50 },
      { color: randColor(), pos: 100 },
    ]);
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(
      `background: ${gradient()};`
    );
  };

  return (
    <div className="p-6 text-white space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-black uppercase">
        CSS Gradient Generator
      </h1>

      {/* CONTROLS */}
      <div className="flex gap-4 flex-wrap">

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="text-black px-2 py-1"
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>

        {type === "linear" && (
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          />
        )}

        <button onClick={addStop} className="bg-blue-600 px-3 py-1">
          Add Stop
        </button>

        <button onClick={randomize} className="bg-purple-600 px-3 py-1">
          Random
        </button>

        <button onClick={copyCSS} className="bg-green-600 px-3 py-1">
          Copy CSS
        </button>
      </div>

      {/* COLOR STOPS */}
      <div className="space-y-2">
        {stops.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">

            <input
              type="color"
              value={s.color}
              onChange={(e) => updateStop(i, "color", e.target.value)}
            />

            <input
              type="number"
              value={s.pos}
              onChange={(e) => updateStop(i, "pos", Number(e.target.value))}
              className="text-black w-20"
            />

            <button
              onClick={() => removeStop(i)}
              className="bg-red-600 px-2"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* PREVIEW */}
      <div
        className="h-48 rounded-xl border"
        style={{ background: gradient() }}
      />

      {/* OUTPUT */}
      <div className="bg-black p-3 rounded text-green-400">
        {`background: ${gradient()};`}
      </div>

      {/* PRESETS */}
      <div className="space-y-2">
        <h2 className="font-bold">Presets</h2>

        <div className="grid grid-cols-2 gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setType(p.type);
                setAngle(p.angle);
                setStops(p.stops);
              }}
              className="p-2 border rounded"
              style={{
                background:
                  p.type === "linear"
                    ? `linear-gradient(${p.angle}deg, ${p.stops
                        .map(s => `${s.color} ${s.pos}%`)
                        .join(", ")})`
                    : `radial-gradient(circle, ${p.stops
                        .map(s => `${s.color} ${s.pos}%`)
                        .join(", ")})`,
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}