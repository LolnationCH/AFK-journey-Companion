import { BaseDirectory, readBinaryFile, exists } from '@tauri-apps/api/fs';
import { memo } from "react";

function NotFound(e: any) {
  e.target.src = "./img/artifacts/404.webp";
}

function ArtifactImage(props: { imageId: string, title: string | undefined, style?: any }) {
  return (
    <>
      <img
        src={`./img/artifacts/${props.imageId}.webp`}
        title={props.title}
        style={props.style || {}}
        onError={({ currentTarget }) => {
          currentTarget.onerror = NotFound; // prevents looping
          let filePath = `data/img/artifacts/${props.imageId}.webp`;
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
          }).catch((e) => {
            NotFound({ target: currentTarget });
          });
        }}
      />
    </>
  );
}

export default memo(ArtifactImage);