import "./App.css";
import LayoutDiv from "./ui/LayoutDiv";
import { appWindow } from '@tauri-apps/api/window';
import { useEffect } from "react";
import Footer from "./Footer";
import { slide as Menu } from 'react-burger-menu';


function App() {
  useEffect(() => {
    appWindow.setAlwaysOnTop(true);
  });

  return (
    <div>
      <Menu right={true}>
        <a className="menu-item" href="/">✏️ Composition Builder</a>
        <a className="menu-item" href="/settings">⚙️ Settings</a>
      </Menu>
      <LayoutDiv />
      <Footer />
    </div>
  );
}

export default App;
