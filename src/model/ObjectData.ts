export enum ObjectAddFlags {
  fastCPU,
  extraMemory,
  multiplayer,
  highDetail,
  eyeCandy,
  difficult
}

export enum ObjectDynamicFlags {
  autoHitDamage,
  safe,
  alwaysActive,
  noHit
}

export enum ObjectDrawFlags {
  flash,
  invert,
  mirror,
  noDraw
}

export enum ObjectUserFlags {
  userFlag12,
  userFlag11,
  userFlag10,
  userFlag9,
  userFlag8,
  userFlag7,
  userFlag6,
  userFlag5,
  userFlag4,
  userFlag3,
  userFlag2,
  userFlag1
}

export enum ObjectTypeFlags {
  user4,
  user3,
  user2,
  user1,
  special,
  eshot,
  pshot,
  shot,
  powerup,
  enemy,
  player,
  generic
}

export interface ObjectData {
  id?: number;
  nameStringLength?: number;
  logicStringLength?: number;
  imageSetStringLength?: number;
  animationStringLength?: number;
  x?: number;
  y?: number;
  z?: number;
  frame?: number;
  addFlags?: ObjectAddFlags;
  dynamicFlags?: ObjectDynamicFlags;
  drawFlags?: ObjectDrawFlags;
  userFlags?: ObjectUserFlags;
  score?: number;
  points?: number;
  powerup?: number;
  damage?: number;
  smarts?: number;
  health?: number;
  moveRect?: number[];
  hitRect?: number[];
  attackRect?: number[];
  clipRect?: number[];
  userRect1?: number[];
  userRect2?: number[];
  userValues?: number[];
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
  speedX?: number;
  speedY?: number;
  tweakX?: number;
  tweakY?: number;
  counter?: number;
  speed?: number;
  width?: number;
  height?: number;
  direction?: number;
  faceDir?: number;
  timeDelay?: number;
  frameDelay?: number;
  objectType?: ObjectTypeFlags;
  objectHitType?: ObjectTypeFlags;
  moveResX?: number;
  moveResY?: number;
  name?: string;
  logic?: string;
  imageSet?: string;
  animation?: string;

  image: string;
  texture: string;
}
