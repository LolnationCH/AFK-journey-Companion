export default class ArtifactInfo {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static fromJson(json: any): ArtifactInfo {
    return new ArtifactInfo(json.id, json.name);
  }

  static fromJsonArray(json: any): ArtifactInfo[] {
    return json.map(ArtifactInfo.fromJson);
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name
    };
  }
}