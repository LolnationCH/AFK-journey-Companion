import ArtifactInfo from "./ArtifactInfo";

let artifactInfo: ArtifactInfo[] | null = null;

export default class ArtifactInfoFetcher {

  static fetchArtifactInfo(): Promise<ArtifactInfo[]> {
    if (artifactInfo) {
      return Promise.resolve(artifactInfo);
    }

    return fetch("./artifacts.json")
      .then((response) => response.json())
      .then((data) => {
        artifactInfo = ArtifactInfo.fromJsonArray(data);
        return artifactInfo;
      });
  }

  static fetchSeasonalArtifactInfo(): Promise<ArtifactInfo[]> {
    return fetch("./seasonal-artifacts.json")
      .then((response) => response.json())
      .then((data) => {
        return ArtifactInfo.fromJsonArray(data);
      });
  }
}
