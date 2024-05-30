import Layout from "../ui/Layout";
import { join } from '@tauri-apps/api/path';
import { writeTextFile, BaseDirectory, createDir, readTextFile, exists } from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri'
import { appLocalDataDir } from '@tauri-apps/api/path';

let appLocalDataDirPath: string | null = null;


async function getAppLocalDataDirPath() {
  if (appLocalDataDirPath) return appLocalDataDirPath;

  appLocalDataDirPath = await appLocalDataDir();
  return appLocalDataDirPath;
}

export default class LayoutFetcher {
  static fetchLayouts(): Promise<Layout[]> {

    getAppLocalDataDirPath().then((path) => {
      invoke("get_layouts", { folderPath: path }).then((response) => {
        console.log(response);
      });
    });


    return fetch("./layouts/index.json")
      .then((response) => response.json())
      .then((data) => {
        return Promise.all(data.map((x: string) => {
          return join("layouts", `${x}`).then((path) => {
            return exists(path, { dir: BaseDirectory.AppLocalData }).then((exists) => {
              if (!exists) {
                return fetch(`./layouts/${x}`)
                  .then((response) => response.json())
                  .then((data) => {
                    return Layout.fromJson(data);
                  });
              }
              else {
                return readTextFile(path, { dir: BaseDirectory.AppLocalData }).then((data) => {
                  return Layout.fromJson(JSON.parse(data));
                });
              }
            });
          });
        }));
      });
  }

  static async saveLayout(layout: Layout) {
    console.log({ "save": "save", layout });
    // Save the layout to the local data directory
    return join("layouts", `${layout.filename}.json`).then((path) => {
      createDir("layouts", { dir: BaseDirectory.AppLocalData, recursive: true }).then(() => {
        return writeTextFile(path, JSON.stringify(layout.toJson()), { dir: BaseDirectory.AppLocalData })
      });
    });
  }
}