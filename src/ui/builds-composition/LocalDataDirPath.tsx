import { appLocalDataDir } from '@tauri-apps/api/path';
let appLocalDataDirPath: string | null = null;

export default async function getAppLocalDataDirPath() {
  if (appLocalDataDirPath) return appLocalDataDirPath;

  appLocalDataDirPath = await appLocalDataDir();
  return appLocalDataDirPath;
}