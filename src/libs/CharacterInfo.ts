export default class CharacterInfo {
  name: string;
  id: string;
  class: string;
  type: string;

  constructor(name: string, id: string, classType: string, type: string) {
    this.name = name;
    this.id = id;
    this.class = classType;
    this.type = type;
  }

  static fromJson(json: any): CharacterInfo {
    return new CharacterInfo(json.name, json.id, json.class, json.type);
  }

  static fromJsonArray(json: any[]): CharacterInfo[] {
    return json.map(CharacterInfo.fromJson);
  }

  toJson(): any {
    return {
      name: this.name,
      id: this.id,
      class: this.class,
      type: this.type
    };
  }
}