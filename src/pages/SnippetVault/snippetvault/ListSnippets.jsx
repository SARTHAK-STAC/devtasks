import { useState } from "react";
import { Link } from "react-router-dom";

const ListSnippets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // TODO: Fetch active snippets from localStorage
  const snippets = [
    { id: 1, title: "Git Push Force", cmd: "git push origin HEAD --force-with-lease", category: "GIT" },
    { id: 2, title: "Nuke Node Modules", cmd: "rm -rf node_modules package-lock.json && npm i", category: "NPM" }
  ];

  const handleCopy = (cmd) => {
    // TODO: Implement copy to clipboard logic
  };

  const handleDelete = (id) => {
    // TODO: Implement delete logic (move to deleted_snippets log)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Snippet Library</h1>
      <input 
        type="text" 
        placeholder="Search snippets..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px" }}
      />
      <ul>
        {snippets.map((sn) => (
          <li key={sn.id} style={{ marginBottom: "15px" }}>
            <h3>{sn.title}</h3>
            <pre style={{ background: "#eee", padding: "10px" }}>{sn.cmd}</pre>
            <p>Category: {sn.category}</p>
            <button onClick={() => handleCopy(sn.cmd)}>Copy</button>
            <button onClick={() => handleDelete(sn.id)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "20px" }}>
        <Link to="/snippetvault">Back to Workspace</Link>
      </div>
    </div>
  );
};

export default ListSnippets;
