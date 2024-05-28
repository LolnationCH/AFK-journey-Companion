import "./App.css";
import LayoutDiv from "./ui/LayoutDiv";
import { appWindow } from '@tauri-apps/api/window';
import { useEffect } from "react";
import { open } from '@tauri-apps/api/shell';


function App() {
  useEffect(() => {
    appWindow.setAlwaysOnTop(true);
  });

  return (
    <div>
      <LayoutDiv />
      <div id="footer"><hr />Creator <b>LolnationCH</b> : <span className="div-link" onClick={() => open("https://github.com/LolnationCH/AFK-journey-Companion")}>Source Code</span>
      </div>
    </div>
  );
}

export default App;
