import Loadout from './Loadout';
import Map from './Map';

export default class Layout {
  map: Map;
  name: string;
  filename: string;
  description: string;
  loadouts: Loadout[];

  constructor(map: Map, name: string, filename: string, description: string, loadouts: Loadout[] = []) {
    this.map = map;
    this.name = name;
    this.description = description;
    this.loadouts = loadouts;
    this.filename = filename;
  }

  static fromJson(json: any): Layout {
    return new Layout(Map.fromJson(json.map), json.name, json.filename, json.description, json.loadouts);
  }

  toJson(): any {
    return {
      map: this.map.toJson(),
      name: this.name,
      description: this.description,
      loadouts: this.loadouts,
      filename: this.filename
    };
  }
}