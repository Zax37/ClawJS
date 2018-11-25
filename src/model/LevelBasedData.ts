import { Rect } from "./Rect";

export interface LevelData {
  ElevatorDefRect: Rect;
  TogglePegDefRect: Rect;
  CrumblingPegDefRect: Rect;
  SteppingStoneDefRect: Rect;
  BigElevatorDefRect: Rect;
}

export const LevelBasedData = [
  { // LEVEL 1
    ElevatorDefRect: new Rect(-32, -8, 36, 32),
    TogglePegDefRect: new Rect(-24, -8, 24, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 2
    ElevatorDefRect: new Rect(-44, -8, 46, 32),
    TogglePegDefRect: new Rect(-24, -6, 38, 32),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 3
    ElevatorDefRect: new Rect(-34, -16, 36, 32),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(0, 0, 0, 0),
  },
  { // LEVEL 4
    ElevatorDefRect: new Rect(-44, -18, 46, 32),
    TogglePegDefRect: new Rect(0, 0, 0, 0),
    CrumblingPegDefRect: new Rect(-24, -46, 24, 32),
    SteppingStoneDefRect: new Rect(0, 0, 0, 0),
    BigElevatorDefRect: new Rect(-16, -1, 16, 32),
  },
];
