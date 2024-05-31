import { BaseDirectory, readBinaryFile, exists } from '@tauri-apps/api/fs';
import { memo } from "react";

function NotFound(e: any) {
  e.target.src = "./img/characters/404.webp";
}

function CharacterImage(props: { imageId: string, alt: string, style: any }) {
  return (
    <div className="character-image">
      <img
        src={`./img/characters/${props.imageId}_sm.webp`}
        alt={props.alt}
        style={props.style}
        onError={({ currentTarget }) => {
          currentTarget.onerror = NotFound; // prevents looping
          let filePath = `data/img/characters/${props.imageId}_sm.webp`;
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
    </div>
  );
}

export default memo(CharacterImage);
