import "./App.css";
import LayoutDiv from "./ui/LayoutDiv";
import { appWindow } from '@tauri-apps/api/window';
import { useEffect } from "react";


function App() {
  useEffect(() => {
    appWindow.setAlwaysOnTop(true);
  });

  return (
    <div>
      <LayoutDiv />
      <div id="footer"><hr />Creator <b>LolnationCH</b> : <a href="https://github.com/LolnationCH/AFK-journey-Companion">Source Code</a></div>
    </div>
  );
}

export default App;
