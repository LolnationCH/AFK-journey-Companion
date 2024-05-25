export default class Map {
  grid: number[][];
  rowSkipCell: number[];

  constructor(grid: number[][], rowSkipCell: number[] = []) {
    this.grid = grid;
    this.rowSkipCell = rowSkipCell;
  }

  getCell(x: number, y: number): number {
    return this.grid[y][x];
  }

  getCellRowStart(y: number): number {
    return this.rowSkipCell[y];
  }

  static fromJson(json: any): Map {
    return new Map(json.grid, json.rowSkipCell);
  }

  toJson(): any {
    return {
      grid: this.grid,
      rowSkipCell: this.rowSkipCell
    };
  }
}