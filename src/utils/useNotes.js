import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { showMessage } from "./helpers.js";

export const useNotes = () => {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useLocalStorage("my-vscode-notes", []);
  const [warning, setWarning] = useState("");

  const handleSave = () => {
    if (note.trim() === "") {
      setWarning("Cannot save an empty note!");
      return;
    }

    const newNote = {
      id: Date.now(),
      content: note.trim(),
      pinned: false,
    };

    setSavedNotes((prev) => {
      const pinned = prev.filter((n) => n.pinned);
      const unpinned = prev.filter((n) => !n.pinned);
      return [...pinned, newNote, ...unpinned];
    });

    setNote("");
    setWarning("");
    showMessage("✅ Note Saved!");
  };

  const handleClear = () => {
    setSavedNotes([]);
    setWarning("");
    showMessage("🧹 All notes cleared.");
  };

  const togglePin = (id) => {
    setSavedNotes((prev) =>
      prev
        .map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
        .sort((a, b) => b.pinned - a.pinned || b.id - a.id)
    );
  };

  return {
    note,
    setNote,
    savedNotes,
    warning,
    handleSave,
    handleClear,
    togglePin,
  };
};
