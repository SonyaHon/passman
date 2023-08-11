import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app";
import "./styles.css";
import {invoke} from "@tauri-apps/api";

(window as any).$invoke = async function(command: any, args: any) {
    return await invoke(command, args);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
