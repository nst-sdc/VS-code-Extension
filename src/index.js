import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

console.log("React app starting...");

const container = document.getElementById("root");
if (!container) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, creating React root...");
  try {
    const root = createRoot(container);
    root.render(<App />);
    console.log("React app rendered successfully!");
  } catch (error) {
    console.error("Error rendering React app:", error);
  }
}
