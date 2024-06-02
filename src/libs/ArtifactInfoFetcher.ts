import ArtifactInfo from "../models/ArtifactInfo";
import { join } from '@tauri-apps/api/path';
import { writeTextFile, BaseDirectory, createDir, readTextFile, exists } from '@tauri-apps/api/fs';

let artifactInfo: ArtifactInfo[] | null = null;
let seasonalArtifactInfo: ArtifactInfo[] | null = null;

export default class ArtifactInfoFetcher {

  static _getArtifactLocalPath(): Promise<string> {
    return join("data", "artifacts.json");
  }

  static _getSeasonalArtifactLocalPath(): Promise<string> {
    return join("data", "seasonal-artifacts.json");
  }

  static fetchArtifactInfo(): Promise<ArtifactInfo[]> {
    if (artifactInfo) {
      return Promise.resolve(artifactInfo);
    }

    return this._getArtifactLocalPath().then((path) => {
      return exists(path, { dir: BaseDirectory.AppLocalData }).then((exists) => {
        if (!exists) {
          return fetch("./artifacts.json")
            .then((response) => response.json())
            .then((data) => {
              artifactInfo = ArtifactInfo.fromJsonArray(data);
              return artifactInfo;
            });
        }
        else {
          return readTextFile(path, { dir: BaseDirectory.AppLocalData }).then((data) => {
            artifactInfo = ArtifactInfo.fromJsonArray(JSON.parse(data));
            return artifactInfo;
          });
        }
      });
    });
  }

  static async _saveArtifactInfo(artifactInfo: ArtifactInfo[]) {
    return this._getArtifactLocalPath().then((path) => {
      createDir("data", { dir: BaseDirectory.AppLocalData, recursive: true }).then(() => {
        return writeTextFile(path, JSON.stringify(artifactInfo.map(x => x.toJson())), { dir: BaseDirectory.AppLocalData });
      });
    });
  }

  static async _saveSeasonalArtifactInfo(seasonalArtifactInfo: ArtifactInfo[]) {
    return this._getSeasonalArtifactLocalPath().then((path) => {
      createDir("data", { dir: BaseDirectory.AppLocalData, recursive: true }).then(() => {
        return writeTextFile(path, JSON.stringify(seasonalArtifactInfo.map(x => x.toJson())), { dir: BaseDirectory.AppLocalData });
      });
    });
  }

  static async saveArtifactInfo() {
    Promise.all([this.fetchArtifactInfo(), this.fetchSeasonalArtifactInfo()]).then(([artifactInfo, seasonalArtifactInfo]) => {
      this._saveArtifactInfo(artifactInfo);
      this._saveSeasonalArtifactInfo(seasonalArtifactInfo);
    });
  }

  static fetchSeasonalArtifactInfo(): Promise<ArtifactInfo[]> {
    if (seasonalArtifactInfo) {
      return Promise.resolve(seasonalArtifactInfo);
    }

    return this._getSeasonalArtifactLocalPath().then((path) => {
      return exists(path, { dir: BaseDirectory.AppLocalData }).then((exists) => {
        if (!exists) {
          return fetch("./seasonal-artifacts.json")
            .then((response) => response.json())
            .then((data) => {
              seasonalArtifactInfo = ArtifactInfo.fromJsonArray(data);
              return seasonalArtifactInfo;
            });
        }
        else {
          return readTextFile(path, { dir: BaseDirectory.AppLocalData }).then((data) => {
            seasonalArtifactInfo = ArtifactInfo.fromJsonArray(JSON.parse(data));
            return seasonalArtifactInfo;
          });
        }
      });
    });
  }
}
