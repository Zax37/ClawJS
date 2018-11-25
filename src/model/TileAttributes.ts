export enum TileType {
  clear = 0,
  solid = 1,
  ground = 2,
  climb = 3,
  death = 4
}

export class TileAttributes {
  atrib?: TileType;
  inside?: TileType;
  outside?: TileType;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
