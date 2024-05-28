import "./App.css";
import LayoutDiv from "./ui/LayoutDiv";
import { appWindow } from '@tauri-apps/api/window';
import { useEffect } from "react";
import Footer from "./Footer";


function App() {
  useEffect(() => {
    appWindow.setAlwaysOnTop(true);
  });

  return (
    <div>
      <LayoutDiv />
      <Footer />
    </div>
  );
}

export default App;
