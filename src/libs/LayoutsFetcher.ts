import Layout from "../ui/Layout";
import { join } from '@tauri-apps/api/path';
import { writeTextFile, BaseDirectory, createDir, readTextFile, exists } from '@tauri-apps/api/fs';

export default class LayoutFetcher {
  static fetchLayouts(): Promise<Layout[]> {
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