import Unit from "./Unit";

enum artifactType {
  ironwall = "IronWall",
  confining = "Confining",
  blazing = "Blazing",
  enlightening = "Enlightening",
  starshard = "Starshard",
  awakening = "Awakening",

  /*Seaons*/
  // Song of Fire
  evocation = "Evocation",
  cascade = "Cascade",
  stormcaller = "Stormcaller",
  quickblade = "Quickblade",
  crescent = "Crescent",
  lightheal = "Lightheal",
}

export default class Loadout {
  units: Unit[];
  name: string;
  description: string;
  artifact: artifactType;

  constructor(units: Unit[], name: string, description: string, artifact: artifactType) {
    this.units = units;
    this.name = name;
    this.description = description;
    this.artifact = artifact;
  }

  static newFromUi(name: string) {
    return new Loadout([], name, "", artifactType.starshard);
  }

  static fromJson(json: any): Loadout {
    return new Loadout(json.units, json.name, json.description, json.artifact);
  }

  toJson(): any {
    return {
      units: this.units,
      name: this.name,
      description: this.description,
      artifact: this.artifact
    };
  }
}