import LayoutsFetcher from "../libs/LayoutsFetcher";

import { useLocalStorage } from "@uidotdev/usehooks";
import { appWindow } from '@tauri-apps/api/window';
import { memo } from "react";
import getAppLocalDataDirPath from "./builds-composition/LocalDataDirPath";
import { invoke } from "@tauri-apps/api";
import { Zoom, toast } from "react-toastify";

function toastMessage(message: string) {
  toast(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Zoom,
  });
}

async function ResetButton() {
  if (await confirm("Are you sure you want to reset? This action is IRREVERSIBLE")) {
    localStorage.clear();
    await LayoutsFetcher.deleteLayouts();
    toastMessage("✅ Reset successful");
  }
}

async function BackupButton() {
  await LayoutsFetcher.backupLayouts();
  toastMessage("✅ Backup successful");
}

async function RestoreButton() {
  await LayoutsFetcher.restoreLayouts();
  toastMessage("✅ Restored layouts");
}

function Settings() {
  const [alwaysOnTop, setAlwaysOnTop] = useLocalStorage("alwaysOnTop", true);

  const handleAlwaysOnTopChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const alwaysOnTopEnabled = event.target.checked;
    appWindow.setAlwaysOnTop(alwaysOnTopEnabled);
    setAlwaysOnTop(alwaysOnTopEnabled);
  }

  return (
    <div>
      <div>
        <h1>Settings</h1>
        <hr />
        <h2>Appearance</h2>
        <p>
          <input type="checkbox" onChange={handleAlwaysOnTopChange} checked={alwaysOnTop} />
          Always on Top
        </p>
        <hr />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button className="reset-button" onClick={ResetButton}>Reset layouts</button>
          <button className="backup-button" onClick={BackupButton}>Backup layouts</button>
          <button className="restore-button" onClick={RestoreButton}>Restore layouts</button>
          <button className="open-data-button" onClick={openDataFolder()}>Open Data in Explorer</button>
        </div>
      </div>
    </div>
  );
}

export default memo(Settings);

function openDataFolder() {
  return async () => {
    let folderPath = await getAppLocalDataDirPath();
    invoke("open_explorer_folder", { fullPath: folderPath });
  };
}
