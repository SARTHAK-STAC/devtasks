import { useState } from "react";
import { Link } from "react-router-dom";

const AddSnippet = () => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("GIT");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement snippet addition logic and localStorage persistence
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Add New Snippet</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Title:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Git Push Force"
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Code / Command:</label>
          <textarea 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            placeholder="git push origin HEAD --force-with-lease"
            rows={4}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="GIT">GIT</option>
            <option value="DOCKER">DOCKER</option>
            <option value="NPM">NPM</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        <button type="submit">Save Snippet</button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <Link to="/snippetvault">Back to Workspace</Link>
      </div>
    </div>
  );
};

export default AddSnippet;
