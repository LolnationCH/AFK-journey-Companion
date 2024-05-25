import Unit from "./Unit";

export default class Loadout {
  units: Unit[];
  name: string;
  description: string;

  constructor(units: Unit[], name: string, description: string) {
    this.units = units;
    this.name = name;
    this.description = description;
  }

  static fromJson(json: any): Loadout {
    return new Loadout(json.units, json.name, json.description);
  }

  toJson(): any {
    return {
      units: this.units,
      name: this.name,
      description: this.description
    };
  }
}