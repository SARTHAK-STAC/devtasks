import { useState } from "react";
import { Link } from "react-router-dom";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [convertedDate, setConvertedDate] = useState("");
  const [convertedTimestamp, setConvertedTimestamp] = useState("");

  // Convert timestamp to readable date
  const handleTimestampConvert = () => {
    if (!timestamp) return;

    let ts = Number(timestamp);

    // Support seconds + milliseconds
    if (timestamp.length === 10) {
      ts *= 1000;
    }

    const date = new Date(ts);

    if (isNaN(date.getTime())) {
      setConvertedDate("Invalid Timestamp");
      return;
    }

    setConvertedDate(date.toString());
  };

  // Convert date to Unix timestamp
  const handleDateConvert = () => {
    if (!dateInput) return;

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      setConvertedTimestamp("Invalid Date");
      return;
    }

    setConvertedTimestamp(Math.floor(date.getTime() / 1000));
  };

  // Current timestamp
  const currentUnix = Math.floor(Date.now() / 1000);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "sans-serif",
        background: "#0f172a",
        color: "#f8fafc",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            fontSize: "2rem",
          }}
        >
          Timestamp Converter
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          Convert Unix/Epoch timestamps into readable dates and vice versa.
        </p>

        {/* Timestamp to Date */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "10px" }}>
            Unix Timestamp → Date
          </h2>

          <input
            type="text"
            placeholder="Enter timestamp..."
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #334155",
              marginBottom: "12px",
              background: "#0f172a",
              color: "#fff",
            }}
          />

          <button
            onClick={handleTimestampConvert}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background: "#3b82f6",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Convert to Date
          </button>

          {convertedDate && (
            <div
              style={{
                marginTop: "15px",
                padding: "15px",
                borderRadius: "10px",
                background: "#0f172a",
                border: "1px solid #334155",
              }}
            >
              {convertedDate}
            </div>
          )}
        </div>

        {/* Date to Timestamp */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ marginBottom: "10px" }}>
            Date → Unix Timestamp
          </h2>

          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #334155",
              marginBottom: "12px",
              background: "#0f172a",
              color: "#fff",
            }}
          />

          <button
            onClick={handleDateConvert}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background: "#10b981",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Convert to Timestamp
          </button>

          {convertedTimestamp && (
            <div
              style={{
                marginTop: "15px",
                padding: "15px",
                borderRadius: "10px",
                background: "#0f172a",
                border: "1px solid #334155",
              }}
            >
              {convertedTimestamp}
            </div>
          )}
        </div>

        {/* Current Timestamp */}
        <div
          style={{
            padding: "20px",
            borderRadius: "12px",
            background: "#0f172a",
            border: "1px solid #334155",
            marginBottom: "25px",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>
            Current Unix Timestamp
          </h3>

          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            {currentUnix}
          </p>
        </div>

        {/* Back Link */}
        <Link
          to="/devutilities"
          style={{
            textDecoration: "none",
            color: "#60a5fa",
            fontWeight: "bold",
          }}
        >
          ← Back to Workspace
        </Link>
      </div>
    </div>
  );
};

export default TimestampConverter;