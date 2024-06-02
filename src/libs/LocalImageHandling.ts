import { BaseDirectory, readBinaryFile, exists } from '@tauri-apps/api/fs';

export function loadLocalImage(filePath: string, NotFound: Function, currentTarget: any) {
  exists(filePath, { dir: BaseDirectory.AppLocalData }).then((fileExists) => {
    if (fileExists) {
      readBinaryFile(filePath, { dir: BaseDirectory.AppLocalData }).then((data) => {
        let base64Str = btoa(String.fromCharCode(...new Uint8Array(data)));
        currentTarget.src = `data:image/webp;base64,${base64Str}`;
      });
    }
    else {
      NotFound({ target: currentTarget });
    }
  }).catch(() => {
    NotFound({ target: currentTarget });
  });
}