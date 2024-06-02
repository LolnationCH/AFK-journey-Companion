import CharacterInfo from "../models/CharacterInfo";
import { join } from '@tauri-apps/api/path';
import { writeTextFile, BaseDirectory, createDir, readTextFile, exists } from '@tauri-apps/api/fs';

let characterInfo: CharacterInfo[] | null = null;

let currentSelectedCharacter: CharacterInfo | null = null;

export default class CharacterInfoFetcher {

  static _getCharacterLocalPath(): Promise<string> {
    return join("data", "characters.json");
  }

  static fetchCharacterInfo(): Promise<CharacterInfo[]> {
    if (characterInfo) {
      return Promise.resolve(characterInfo);
    }

    return this._getCharacterLocalPath().then((path) => {
      return exists(path, { dir: BaseDirectory.AppLocalData }).then((exists) => {
        if (!exists) {
          return fetch("./characters.json")
            .then((response) => response.json())
            .then((data) => {
              characterInfo = CharacterInfo.fromJsonArray(data);
              return characterInfo;
            });
        }
        else {
          return readTextFile(path, { dir: BaseDirectory.AppLocalData }).then((data) => {
            characterInfo = CharacterInfo.fromJsonArray(JSON.parse(data));
            return characterInfo;
          });
        }
      });
    });
  }

  static async _saveCharacterInfo(characterInfo: CharacterInfo[]) {
    return this._getCharacterLocalPath().then((path) => {
      createDir("data", { dir: BaseDirectory.AppLocalData, recursive: true }).then(() => {
        return writeTextFile(path, JSON.stringify(characterInfo.map(x => x.toJson())), { dir: BaseDirectory.AppLocalData });
      });
    });
  }

  static async saveCharacterInfo() {
    return this.fetchCharacterInfo().then((characterInfo) => {
      return this._saveCharacterInfo(characterInfo);
    });
  }

  static async selectCharacterInfo(name: string) {
    if (!characterInfo) {
      await CharacterInfoFetcher.fetchCharacterInfo();
    }

    currentSelectedCharacter = characterInfo?.find((c) => c.name === name) || null;
  }

  static getSelectedCharacterInfo(): CharacterInfo | null {
    return currentSelectedCharacter;
  }
}
