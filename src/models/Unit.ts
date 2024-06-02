export default class Unit {
  name: string;
  weaponLvl: number;
  positionX: number;
  positionY: number;

  constructor(name: string, weaponLvl: number, positionX: number, positionY: number) {
    this.name = name;
    this.weaponLvl = weaponLvl;
    this.positionX = positionX;
    this.positionY = positionY;
  }

  static fromJson(json: any): Unit {
    return new Unit(json.name, json.weaponLvl, json.positionX, json.positionY);
  }

  toJson(): any {
    return {
      name: this.name,
      weaponLvl: this.weaponLvl,
      positionX: this.positionX,
      positionY: this.positionY
    };
  }
}