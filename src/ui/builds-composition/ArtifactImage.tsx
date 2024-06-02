import { memo } from "react";
import { loadLocalImage } from '../../libs/LocalImageHandling';

function NotFound(e: any) {
  e.target.src = "./img/artifacts/404.webp";
}

function loadLocalIfRemoteNotFound(imageId: string) {
  return ({ currentTarget }: { currentTarget: any }) => {
    currentTarget.onerror = NotFound; // prevents looping
    let filePath = `data/img/artifacts/${imageId}_sm.webp`;
    loadLocalImage(filePath, NotFound, currentTarget);
  };
}

function ArtifactImage(props: { imageId: string, title: string | undefined, style?: any }) {
  return (
    <>
      <img
        src={`./img/artifacts/${props.imageId}.webp`}
        title={props.title}
        style={props.style || {}}
        onError={loadLocalIfRemoteNotFound(props.imageId)}
      />
    </>
  );
}

export default memo(ArtifactImage);