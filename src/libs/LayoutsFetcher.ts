import Layout from "../models/Layout";
import { join } from '@tauri-apps/api/path';
import { writeTextFile, BaseDirectory, createDir, readTextFile, exists } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';
import getAppLocalDataDirPath from "../ui/builds-composition/LocalDataDirPath";

export default class LayoutFetcher {
  static async fetchLayouts(): Promise<Layout[]> {
    const response = await fetch("./layouts/index.json");
    const data: string[] = await response.json();

    const path = await getAppLocalDataDirPath();
    const localLayouts = await invoke("get_layouts", { folderPath: path });
    let layoutsFiles = data.concat(localLayouts as string[]);
    layoutsFiles = [...new Set(layoutsFiles)];

    const layouts = await Promise.all(layoutsFiles.map(async (x: string) => {
      const path = await join("layouts", `${x}`);
      const doesFileExist = await exists(path, { dir: BaseDirectory.AppLocalData });

      if (!doesFileExist) {
        const response = await fetch(`./layouts/${x}`);
        const data = await response.json();
        return Layout.fromJson(data);
      } else {
        const data = await readTextFile(path, { dir: BaseDirectory.AppLocalData });
        return Layout.fromJson(JSON.parse(data));
      }
    }));

    return layouts;
  }

  static async saveLayout(layout: Layout) {
    return join("layouts", `${layout.filename}.json`).then((path) => {
      createDir("layouts", { dir: BaseDirectory.AppLocalData, recursive: true }).then(() => {
        return writeTextFile(path, JSON.stringify(layout.toJson()), { dir: BaseDirectory.AppLocalData })
      });
    });
  }
}