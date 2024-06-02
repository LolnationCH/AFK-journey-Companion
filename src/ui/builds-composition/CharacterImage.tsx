import { memo } from "react";
import { loadLocalImage } from '../../libs/LocalImageHandling';

function NotFound(e: any) {
  e.target.src = "./img/characters/404.webp";
}

function loadLocalIfRemoteNotFound(imageId: string) {
  return ({ currentTarget }: { currentTarget: any }) => {
    currentTarget.onerror = NotFound; // prevents looping
    let filePath = `data/img/characters/${imageId}_sm.webp`;
    loadLocalImage(filePath, NotFound, currentTarget);
  };
}

function CharacterImage(props: { imageId: string, alt: string, style: any }) {
  return (
    <div className="character-image">
      <img
        src={`./img/characters/${props.imageId}_sm.webp`}
        alt={props.alt}
        style={props.style}
        onError={loadLocalIfRemoteNotFound(props.imageId)}
      />
    </div>
  );
}

export default memo(CharacterImage);

