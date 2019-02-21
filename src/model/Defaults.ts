const DEFAULTS_BASE = {
  BEHIND: {
    z: 990,
  },
  CRATE: {
    animation: 'GAME_FORWARD100',
  },
  POWERUP: {
    z: 1001, // Should be 1000, but 1001 fixes problem with first coin in Level 12.
  },
  ELEVATORLIKE: {
    z: 2000,
  },
  BULLET: {
    logic: 'Bullet',
    texture: 'GAME',
    image: 'GAME_BULLETS',
    frame: 1,
    z: 3998,
  },
  ENEMY: {
    z: 3999, // Less than 4000, to be under Claw
  },
  CLAW: {
    z: 4000,
  },
  FRONT: {
    z: 5100,
  },
  GOOCOVERUP: {
    z: 8010,
  },
  POINTS: {
    z: 8900,
  },
};

export const DEFAULTS = {
  ...DEFAULTS_BASE,
  BehindCrate: {
    ...DEFAULTS_BASE.BEHIND,
    ...DEFAULTS_BASE.CRATE,
  },
  FrontCrate: {
  ...DEFAULTS_BASE.FRONT,
  ...DEFAULTS_BASE.CRATE,
  }
};
