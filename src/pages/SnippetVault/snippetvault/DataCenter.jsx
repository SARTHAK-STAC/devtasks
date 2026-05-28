import { Link } from "react-router-dom";

const DataCenter = () => {
  const handleExport = () => {
    // TODO: Implement JSON export function
  };

  const handleImport = (e) => {
    // TODO: Implement JSON import and merge validation
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Snippet Data Center</h1>
      <div style={{ marginBottom: "20px" }}>
        <h2>Export Backup</h2>
        <button onClick={handleExport}>Download JSON</button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h2>Import Backup</h2>
        <input type="file" accept=".json" onChange={handleImport} />
      </div>
      <div>
        <Link to="/snippetvault">Back to Workspace</Link>
      </div>
    </div>
  );
};

export default DataCenter;
