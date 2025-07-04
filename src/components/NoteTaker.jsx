import React from "react";

const NoteTaker = ({
  note,
  setNote,
  onSave,
  onClear,
  warning,
  darkMode,
  language,
  translations,
}) => {
  return (
    <div className="tool-container space-y">
      <textarea
        className="search-real-input"
        placeholder={translations[language].placeholder}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ minHeight: "150px" }}
      />

      <div className="note-buttons" style={{ display: "flex", gap: "10px" }}>
        <button
          className="back-button"
          style={{
            background: "#22c55e", // Tailwind green-500
            color: "white",
            flex: 1,
            fontSize: "13px",
            padding: "6px 10px",
          }}
          onClick={onSave}
        >
           {translations[language].saveButton}
        </button>
        <button
          className="back-button"
          style={{
            background: "#ef4444", // Tailwind red-500
            color: "white",
            flex: 1,
            fontSize: "13px",
            padding: "6px 10px",
          }}
          onClick={onClear}
        >
           {translations[language].clearButton}
        </button>
      </div>

      {warning && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            color: "#856404",
            padding: "10px",
            borderLeft: "4px solid #ffa502",
            borderRadius: "8px",
            fontSize: "0.85rem",
          }}
        >
          {warning}
        </div>
      )}
    </div>
  );
};

export default NoteTaker;
