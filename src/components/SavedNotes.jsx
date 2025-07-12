import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";

const SavedNotes = ({
  savedNotes,
  onTogglePin,
  onRenameNote,
  onDeleteNote,
  darkMode,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handler = (e) => {
      const openId = openMenuId;
      if (
        openId &&
        menuRefs.current[openId] &&
        !menuRefs.current[openId].contains(e.target)
      ) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [openMenuId]);

  const containerStyle = {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  };

  const noteBoxStyle = {
    position: "relative",
    height: "200px",
    padding: "15px",
    borderRadius: "10px",
    backgroundColor: darkMode ? "#1e1e1e" : "#68338a",
    color: darkMode ? "#eee" : "#eee",
    border: darkMode ? "1px solid #333" : "1px solid #ccc",
    boxShadow: darkMode
      ? "0 2px 6px rgba(255,255,255,0.05)"
      : "0 2px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
  };

  const starStyle = (pinned) => ({
    position: "absolute",
    top: "10px",
    left: "10px",
    fontSize: "18px",
    cursor: "pointer",
    color: pinned ? "#ffd700" : darkMode ? "#888" : "#555",
  });

  const menuButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    color: darkMode ? "#ccc" : "#333",
    fontSize: "18px",
    cursor: "pointer",
  };

  const menuStyle = {
    position: "absolute",
    top: "35px",
    right: "10px",
    background: darkMode ? "#333" : "#f9f9f9",
    border: "1px solid #aaa",
    borderRadius: "6px",
    padding: "5px 0",
    zIndex: 100,
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  };

  const menuItemStyle = {
    padding: "8px 15px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: "14px",
    color: darkMode ? "#eee" : "#000",
  };

  const downloadAsPdf = (content, title) => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, 10);
    doc.save(`${title || "note"}.pdf`);
  };

  const downloadAsTxt = (content, title) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.txt`;
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(event);
  };

  return (
    <div style={containerStyle}>
      {savedNotes.map((note) => (
        <div key={note.id} style={noteBoxStyle}>
          <span
            style={starStyle(note.pinned)}
            onClick={() => onTogglePin(note.id)}
          >
            {note.pinned ? "⭐" : "☆"}
          </span>

          <button
            style={menuButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === note.id ? null : note.id);
            }}
          >
            ⋮
          </button>

          {openMenuId === note.id && (
            <div
              style={menuStyle}
              ref={(el) => (menuRefs.current[note.id] = el)}
            >
              <div
                style={menuItemStyle}
                onClick={() => downloadAsPdf(note.content, note.title)}
              >
                Download PDF
              </div>
              <div
                style={menuItemStyle}
                onClick={() => downloadAsTxt(note.content, note.title)}
              >
                Download TXT
              </div>
              <div style={menuItemStyle} onClick={() => onRenameNote(note.id)}>
                Rename
              </div>
              <div style={menuItemStyle} onClick={() => onDeleteNote(note.id)}>
                Delete
              </div>
            </div>
          )}

          
          <div
            style={{
    whiteSpace: "pre-wrap",
    overflowY: "auto",
    maxHeight: "120px",
    paddingTop: "20px",
    paddingLeft: "5px",
  }}
          >
            {note.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedNotes;
