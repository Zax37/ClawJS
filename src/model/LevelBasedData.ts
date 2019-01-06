import { Rect } from './Rect';

export enum DeathType {
  SPIKES,
  GOO
}

export interface LevelData {
  ElevatorDefRect: Rect;
  TogglePegDefRect: Rect;
  CrumblingPegDefRect: Rect;
  SpringBoardDefRect: Rect;
  SteppingStoneDefRect: Rect;
  NearEndPosition?: { x: number, y: number };
  DeathType: DeathType;
  SplashY: number;
  AlternativePegCrumbleSound?: string;
  AlternativePegSlideSound?: string;
}

export const BigElevatorDefRect = new Rect(-88, -20, 94, 20);
export const WaterRockDefRect = new Rect(-25, 90, 25, 175);

export const LevelBasedData: LevelData[] = [
  { // LEVEL 1
    ElevatorDefRect: new Rect(-32, -8, 36, 32),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    NearEndPosition: { x: 17350, y: 1490 },
    DeathType: DeathType.SPIKES,
    SplashY: 0,
  },
  { // LEVEL 2
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -6, 38, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    NearEndPosition: { x: 20070, y: 2050 },
    DeathType: DeathType.GOO,
    SplashY: 50,
    AlternativePegSlideSound: 'LEVEL_PEGSLIDE2',
  },
  { // LEVEL 3
    ElevatorDefRect: new Rect(-34, -16, 36, 32),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    NearEndPosition: { x: 24170, y: 5360 },
    DeathType: DeathType.SPIKES,
    SplashY: 0,
  },
  { // LEVEL 4
    ElevatorDefRect: new Rect(-44, -18, 46, 32),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    NearEndPosition: { x: 15955, y: 1470 },
    DeathType: DeathType.GOO,
    SplashY: 40,
    AlternativePegCrumbleSound: 'LEVEL_PEGCRUMBLE2',
  },
  { // LEVEL 5
    ElevatorDefRect: new Rect(-27, -5, 27, 35),
    TogglePegDefRect: new Rect(-27, -6, 25, 35),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    DeathType: DeathType.SPIKES,
    SplashY: 0,
  },
  { // LEVEL 6
    ElevatorDefRect: new Rect(-36, -3, 35, 66),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-36, -32, 35, 66),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    DeathType: DeathType.GOO,
    SplashY: 10,
  },
  { // LEVEL 7
    ElevatorDefRect: new Rect(-60, 70, 74, 110),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-24, 89, 23, 130),
    SteppingStoneDefRect: new Rect(-7, -10, 22, 30),
    DeathType: DeathType.GOO,
    SplashY: 60,
  },
  { // LEVEL 8
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -8, 32, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    SteppingStoneDefRect: new Rect(-24, -10, 30, 30),
    DeathType: DeathType.GOO,
    SplashY: 0,
  },
  { // LEVEL 9
    ElevatorDefRect: new Rect(-44, -8, 41, 32),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-24, 0, 22, 40),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    DeathType: DeathType.GOO,
    SplashY: 50,
  },
  { // LEVEL 10
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    DeathType: DeathType.SPIKES,
    SplashY: 0,
  },
  { // LEVEL 11
    ElevatorDefRect: new Rect(-32, -6, 30, 40),
    TogglePegDefRect: new Rect(-32, -6, 30, 40),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    DeathType: DeathType.SPIKES,
    SplashY: 0,
    AlternativePegSlideSound: 'LEVEL_PEGSLIDE3',
  },
  { // LEVEL 12
    ElevatorDefRect: new Rect(-22, -18, 18, 40),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-24, 89, 23, 130),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    DeathType: DeathType.GOO,
    SplashY: 50,
  },
  { // LEVEL 13
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    DeathType: DeathType.GOO,
    SplashY: 50,
    AlternativePegCrumbleSound: 'LEVEL_PEGCRUMBLE2',
  },
  { // LEVEL 14
    ElevatorDefRect: new Rect(-34, -6, 23, 40),
    TogglePegDefRect: new Rect(-34, -6, 24, 40),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SpringBoardDefRect: new Rect(-32, 10, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    DeathType: DeathType.GOO,
    SplashY: 50,
    AlternativePegSlideSound: 'LEVEL_PEGSLIDE4',
  },
];
