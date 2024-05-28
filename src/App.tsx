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
    </div>
  );
}

export default App;
