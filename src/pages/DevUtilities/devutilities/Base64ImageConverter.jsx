import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "sonner";

export default function Base64ImageConverter() {
  const { dark } = useTheme();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
    const [base64, setBase64] = useState("");

const [metadata, setMetadata] = useState({
  name: "",
  type: "",
  size: "",
  width: 0,
  height: 0,
});
  const handleImage = (file) => {
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image must be smaller than 5MB");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const dataUrl = e.target.result;

    setImage(file);
    setPreview(dataUrl);
    setBase64(dataUrl);

    const img = new Image();

    img.onload = () => {
      setMetadata({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        width: img.width,
        height: img.height,
      });
    };

    img.src = dataUrl;
  };

  reader.readAsDataURL(file);
};
const handleCopy = async () => {
  await navigator.clipboard.writeText(base64);
  toast.success("Copied!");
};
const handleClear = () => {
  setImage(null);
  setPreview("");
  setBase64("");

  setMetadata({
    name: "",
    type: "",
    size: "",
    width: 0,
    height: 0,
  });
};

  return (
    <div
      className={`min-h-screen p-6 ${
        dark ? "bg-zinc-950 text-white" : "bg-white text-black"
      }`}
    >
      <Link
        to="/devutilities"
        className="inline-block mb-6 px-4 py-2 rounded-lg border"
      >
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        Base64 Image Encoder & Decoder
      </h1>

      <label
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer ${
          dark ? "border-zinc-600" : "border-zinc-300"
        }`}
      >
        <p className="mb-2 font-semibold">
          Click to upload an image
        </p>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImage(e.target.files[0])}
        />
      </label>

      {preview && (
  <>
    <div className="mt-8 flex justify-center">
      <img
        src={preview}
        alt="Preview"
        className="max-h-80 rounded-xl border"
      />
    </div>

    <div className="mt-6 rounded-xl border p-4">
      <h3 className="text-xl font-bold mb-4">
        Image Details
      </h3>

      <p><strong>Name:</strong> {metadata.name}</p>
      <p><strong>Type:</strong> {metadata.type}</p>
      <p><strong>Size:</strong> {metadata.size}</p>
      <p>
        <strong>Dimensions:</strong>{" "}
        {metadata.width} × {metadata.height}
      </p>
    </div>

    <div className="mt-6">
      <label className="font-bold block mb-2">
        Base64 Output
      </label>

      <textarea
        value={base64}
        readOnly
        rows={8}
        className={`w-full rounded-xl border p-3 ${
          dark
            ? "bg-zinc-900 border-zinc-700 text-white"
            : "bg-white border-zinc-300 text-black"
        }`}
      />
    </div>

    <div className="flex gap-4 mt-4">
      <button
        onClick={handleCopy}
        className="px-4 py-2 rounded-lg bg-black text-white"
      >
        Copy Base64
      </button>

      <button
        onClick={handleClear}
        className="px-4 py-2 rounded-lg border"
      >
        Clear
      </button>
    </div>
  </>
)}
    </div>
  );
}