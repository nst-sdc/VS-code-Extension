import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";

const downloadFile = (content, filename, type = "text/plain") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const SavedNotes = ({ savedNotes, darkMode, language, translations, onTogglePin }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredNotes = savedNotes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilename = (content, format) => {
    const firstWord = content.trim().split(/\s+/)[0] || "note";
    return `${firstWord}.${format}`;
  };

  const handleDownload = (note, format) => {
    const filename = getFilename(note.content, format);
    if (!note.content.trim()) return;

    if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFont("Courier", "normal");
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(note.content, 180);
      doc.text(lines, 10, 20);
      doc.save(filename);
    } else {
      const type = format === "md" ? "text/markdown" : "text/plain";
      downloadFile(note.content, filename, type);
    }

    setOpenDropdownId(null);
  };

  const handleTogglePin = (id) => {
    onTogglePin?.(id);
    setOpenDropdownId(null);
  };

  return (
    <div className="tool-container space-y">
      <strong style={{ color: darkMode ? "#fff" : "#111", fontSize: "18px" }}>
        {translations[language].saveNote}:
      </strong>

      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-real-input"
        style={{
          borderRadius: "8px",
          backgroundColor: darkMode ? "#1a1a1a" : "#e6e6e6",
          paddingLeft: "16px",
          color: darkMode ? "#fff" : "#000",
          border: "1px solid #444",
          height: "40px",
        }}
      />

      <div className="tools-grid">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="tool-card"
            style={{
              minHeight: "160px",
              padding: "16px",
              position: "relative",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: darkMode ? "#222" : "#fff",
              color: darkMode ? "#eee" : "#111",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
              ref={dropdownRef}
            >
              <button
                onClick={() => handleTogglePin(note.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: note.pinned ? "#facc15" : darkMode ? "#aaa" : "#444",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                aria-label="Pin note"
              >
                ★
              </button>

              <div style={{ position: "relative" }}>
                <button
                  onClick={() =>
                    setOpenDropdownId((prev) => (prev === note.id ? null : note.id))
                  }
                  style={{
                    background: "transparent",
                    border: "none",
                    color: darkMode ? "#ccc" : "#333",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                  aria-label="More options"
                >
                  ⋮
                </button>

                {openDropdownId === note.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "28px",
                      right: 0,
                      background: darkMode ? "#2e2e2e" : "#ffffff",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "4px 0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      zIndex: 10,
                      minWidth: "140px",
                    }}
                  >
                    {["txt", "md", "pdf"].map((format) => (
                      <button
                        key={format}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleDownload(note, format);
                        }}
                        className="note-action-button"
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "8px 12px",
                          textAlign: "left",
                          background: "transparent",
                          border: "none",
                          fontSize: "14px",
                          color: darkMode ? "#ddd" : "#333",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        Download as .{format}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="tool-card-content" style={{ marginTop: "32px" }}>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: "1.5",
                  wordBreak: "break-word",
                  maxHeight: "80px",
                  overflowY: "auto",
                }}
              >
                {note.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedNotes;
