import "./App.css";
import { slide as Menu } from 'react-burger-menu';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Settings from "./ui/Settings";
import LayoutDiv from "./ui/builds-composition/LayoutDiv";
import Footer from "./Footer";

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <LayoutDiv />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);


function App() {
  return (
    <div>
      <Menu right={true}>
        <a className="menu-item" href="/">✏️ Composition Builder</a>
        <a className="menu-item" href="/settings">⚙️ Settings</a>
      </Menu>
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
}

export default App;
