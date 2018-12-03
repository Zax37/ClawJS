import { Rect } from "./Rect";

export interface LevelData {
  ElevatorDefRect: Rect;
  TogglePegDefRect: Rect;
  CrumblingPegDefRect: Rect;
  SteppingStoneDefRect: Rect;
  BigElevatorDefRect: Rect;
  NearEndPosition?: { x: number, y: number };
}

export const LevelBasedData = [
  { // LEVEL 1
    ElevatorDefRect: new Rect(-32, -8, 36, 32),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
    NearEndPosition: { x: 17350, y: 1490 },
  },
  { // LEVEL 2
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -6, 38, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
    NearEndPosition: { x: 20070, y: 2050 },
  },
  { // LEVEL 3
    ElevatorDefRect: new Rect(-34, -16, 36, 32),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
    NearEndPosition: { x: 24170, y: 5360 },
  },
  { // LEVEL 4
    ElevatorDefRect: new Rect(-44, -18, 46, 32),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 5
    ElevatorDefRect: new Rect(-27, -5, 27, 35),
    TogglePegDefRect: new Rect(-27, -6, 25, 35),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 6
    ElevatorDefRect: new Rect(-36, -3, 35, 66),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-36, -32, 35, 66),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 7
    ElevatorDefRect: new Rect(-60, 70, 74, 110),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(-7, -10, 22, 30),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 8
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -8 ,32,32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(-24, -10, 30, 30),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 9
    ElevatorDefRect: new Rect(-44, -8, 41, 32),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 10
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    BigElevatorDefRect: new Rect(-88, -20, 94, 20),
  },
  { // LEVEL 11
    ElevatorDefRect: new Rect(-32, -6, 30, 40),
    TogglePegDefRect: new Rect(-32, -6, 30, 40),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 12
    ElevatorDefRect: new Rect(-22, -18, 18, 40),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 13
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 14
    ElevatorDefRect: new Rect(-34, -6, 23, 40),
    TogglePegDefRect: new Rect(-34, -6, 24, 40),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(-16, -1, 16, 32),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
];
