import Game from '../game';
import { isNumber } from '../util';

export default class AnimationManager {
  gameAnimsLoaded = false;
  anims = {};

  constructor(private game: Game) {

  }

  loadBase() {
    /*
       * global animations should be created only once after loading first level,
       * they live even after leaving this scene and are same for all levels
       */
    if (!this.gameAnimsLoaded) {
      this.gameAnimsLoaded = true;

      this.game.anims.create({
        key: 'ClawStand',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 11, end: 18 }),
        frameRate: 9,
        repeat: -1,
      });

      this.game.anims.create({
        key: 'ClawWalk',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 1, end: 10 }),
        frameRate: 12,
        repeat: -1,
      });

      this.game.anims.create({
        key: 'ClawWalkCatnip',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 1, end: 10 }),
        frameRate: 16,
        repeat: -1,
      });

      this.game.anims.create({
        key: 'ClawJump',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 271, end: 278 }),
        frameRate: 15,
        repeat: 0,
      });

      this.game.anims.create({
        key: 'ClawFall',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 279, end: 282 }),
        frameRate: 15,
        repeat: -1,
      });


      this.game.anims.create({
        key: 'ClawFallDeath',
        frames: [
          {
            key: 'CLAW',
            frame: 'CLAW_402'
          },
        ],
        repeat: -1,
      });

      this.game.anims.create({
        key: 'ClawClimb',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 371, end: 382 }),
        frameRate: 18,
        repeat: -1,
      });

      this.game.anims.create({
        key: 'ClawStandAttack1',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 24, end: 26 }),
        frameRate: 32,
      }).addFrame([{
        key: 'CLAW',
        frame: 'CLAW_27',
        duration: 100,
      }, {
        key: 'CLAW',
        frame: 'CLAW_26',
        duration: 20,
      }]);

      this.game.anims.create({
        key: 'ClawStandAttack2',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 35, end: 36 }),
        frameRate: 12,
      }).frames[1].duration = 50;

      this.game.anims.create({
        key: 'ClawStandAttack3',
        frames: [
          {
            key: 'CLAW',
            frame: 'CLAW_37',
            duration: 20,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_38',
            duration: 120,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_37',
            duration: 20,
          },
        ],
      });

      this.game.anims.create({
        key: 'ClawStandAttack4',
        frames: this.game.anims.generateFrameNames('CLAW',
          { prefix: 'CLAW_', start: 57, end: 60 }),
        frameRate: 24,
      }).frames[2].duration = 60;

      this.game.anims.create({
        key: 'ClawDuck',
        frames: [
          {
            key: 'CLAW',
            frame: 'CLAW_67',
            duration: 250,
          },
        ],
      });

      this.game.anims.create({
        key: 'ClawDuckSwipe',
        frames: [
          {
            key: 'CLAW',
            frame: 'CLAW_74',
            duration: 25,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_75',
            duration: 25,
            //SOUND: CLAW_SWORDSWISH
          },
          {
            key: 'CLAW',
            frame: 'CLAW_76',
            duration: 100,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_75',
            duration: 12,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_74',
            duration: 20,
          },
        ],
      });

      this.game.anims.create({
        key: 'ClawSpikeDeath',
        frames: [
          {
            key: 'CLAW',
            frame: 'CLAW_403',
            duration: 1000,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_406',
            duration: 2000,
          },
        ],
      });

      this.game.anims.create({
        key: 'ClawJumpAttack',
        frames: [
          {
            key: 'CLAW',
            frame: 'CLAW_284',
            duration: 25,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_283',
            duration: 75,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_284',
            duration: 40,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_285',
            duration: 30,
          },
        ],
      });

      this.game.anims.create({
        key: 'CheckpointRise',
        frames: this.game.anims.generateFrameNames('GAME',
          { prefix: 'GAME_CHECKPOINTFLAG', start: 1, end: 7 }),
        frameRate: 7,
      });

      this.game.anims.create({
        key: 'CheckpointWave',
        frames: this.game.anims.generateFrameNames('GAME',
          { prefix: 'GAME_CHECKPOINTFLAG', start: 8, end: 13 }),
        frameRate: 7,
        repeat: -1,
      });

      this.game.anims.create({
        key: 'SuperCheckpointRise',
        frames: this.game.anims.generateFrameNames('GAME',
          { prefix: 'GAME_SUPERCHECKPOINT', start: 1, end: 7 }),
        frameRate: 7,
      });

      this.game.anims.create({
        key: 'SuperCheckpointWave',
        frames: this.game.anims.generateFrameNames('GAME',
          { prefix: 'GAME_SUPERCHECKPOINT', start: 8, end: 13 }),
        frameRate: 7,
        repeat: -1,
      });
    }
  }

  requestEnemyAnimations(texture: string, image: string) {
    if (!this.anims[texture]) {
      this.anims[texture] = {};
    }

    if (!this.anims[texture][image]) {
      this.anims[texture][image] = {};
      const textureFrames = this.game.textures.get(texture).getFrameNames();
      const animFrames = textureFrames
        .filter(frameName => frameName.startsWith(image) && isNumber(frameName.charAt(image.length)))
        .map(frameName => ({ key: texture, frame: frameName, order: Number.parseInt(frameName.substr(image.length), 0) }))
        .sort((a, b) => a.order - b.order);

      if (!animFrames.length) return false;

      this.createEnemyAnimation(texture, image, animFrames.reduce((framesGroup: Frame[], frame: Frame) => {
        if (framesGroup.length) {
          if (Math.floor(frame.order / 50) === Math.floor(framesGroup[0].order / 50)) {
            return [ frame, ...framesGroup ];
          } else {
            this.createEnemyAnimation(texture, image, framesGroup);
            return [ frame ];
          }
        } else {
          return [ frame ];
        }
      }, []));
    }

    return this.anims[texture][image];
  }

  requestBeastieAnimations(texture: string, image: string, animations: string[]) {
    if (!this.anims[texture]) {
      this.anims[texture] = {};
    }

    if (!this.anims[texture][image]) {
      this.anims[texture][image] = {};
      const textureFrames = this.game.textures.get(texture).getFrameNames();
      const animFrames = textureFrames
        .filter(frameName => frameName.startsWith(image) && isNumber(frameName.charAt(image.length)))
        .map(frameName => ({ key: texture, frame: frameName, order: Number.parseInt(frameName.substr(image.length), 0) }))
        .sort((a, b) => a.order - b.order);

      if (!animFrames.length) return false;

      this.anims[texture][image] = {};
      animations.forEach((anim) => {
        switch (anim) {
          default:
            break;
          case 'LEVEL_RAT_WALK':
            this.anims[texture][image]['walk'] = this.game.anims.create({
              key: texture + image + 'walk',
              frames: [
                { ...animFrames[7], duration: 150 },
                { ...animFrames[8], duration: 150 },
                { ...animFrames[9], duration: 150 },
              ],
              frameRate: 60,
              repeat: -1,
            });
            break;
          case 'LEVEL_RAT_THROW':
            this.anims[texture][image]['throw'] = this.game.anims.create({
              key: texture + image + 'throw',
              frames: [
                { ...animFrames[10], duration: 500 },
                { ...animFrames[11], duration: 1000 },
                { ...animFrames[12], duration: 250 },
              ],
              frameRate: 60,
            });
            break;
          case 'LEVEL_PUNKRAT_STRIKE':
            this.anims[texture][image]['strike'] = this.game.anims.create({
              key: texture + image + 'strike',
              frames: [
                { ...animFrames[2], duration: 1000 },
                { ...animFrames[3], duration: 250 },
                { ...animFrames[4], duration: 500 },
              ],
              frameRate: 60,
            });
            break;
          case 'LEVEL_PUNKRAT_RECOIL':
            this.anims[texture][image]['recoil'] = this.game.anims.create({
              key: texture + image + 'recoil',
              frames: [
                { ...animFrames[10], duration: 250 },
                { ...animFrames[11], duration: 250 },
              ],
              frameRate: 60,
            });
            break;
        }
      });
    }

    return this.anims[texture][image];
  }

  request(texture: string, image: string, animation?: string) {
    if (!this.anims[texture]) {
      this.anims[texture] = {};
    }

    if (!this.anims[texture][image]) {
      const textureFrames = this.game.textures.get(texture).getFrameNames();
      let animFrames = textureFrames
        .filter(frameName => frameName.startsWith(image) && isNumber(frameName.charAt(image.length)))
        .map(frameName => ({ key: texture, frame: frameName, order: Number.parseInt(frameName.substr(image.length), 0) }))
        .sort((a, b) => a.order - b.order);

      if (!animFrames.length) return false;

      if (animation) {
        switch (animation) {
          case 'GAME_BACKWARD50':
          case 'GAME_BACKWARD100':
          case 'GAME_BACKWARD200':
          case 'GAME_BACKWARD500':
          case 'GAME_REVERSECYCLE50':
          case 'GAME_REVERSECYCLE100':
          case 'GAME_REVERSECYCLE200':
          case 'GAME_REVERSECYCLE500':
            animFrames.reverse();
            break;
          case 'LEVEL_RATBOMB':
            return this.anims[texture][image] = this.game.anims.create({
              key: texture + image,
              frames: [
                { ...animFrames[18], duration: 50 },
                { ...animFrames[19], duration: 50 },
                { ...animFrames[20], duration: 50 },
                { ...animFrames[21], duration: 50 },
                { ...animFrames[22], duration: 50 },
              ],
              frameRate: 60,
              repeat: -1,
            });
          case 'LEVEL_HAND_HAND1':
            return this.anims[texture][image] = this.game.anims.create({
              key: texture + image,
              frames: [
                { ...animFrames[2], duration: 400 },
                { ...animFrames[3], duration: 500 },
                { ...animFrames[1], duration: 100 },
                { ...animFrames[0], duration: 300 },
                { ...animFrames[3], duration: 350 },
                { ...animFrames[1], duration: 70 },
                { ...animFrames[0], duration: 200 },
                { ...animFrames[2], duration: 320 },
                { ...animFrames[0], duration: 200 },
              ],
              frameRate: 60,
              repeat: -1,
            });
          case 'GAME_INTERFACE_CHEST':
            return this.anims[texture][image] = this.game.anims.create({
              key: texture + image,
              frames: [
                { ...animFrames[0], duration: 1000 },
                { ...animFrames[1], duration: 100 },
                { ...animFrames[2], duration: 200 },
                { ...animFrames[3], duration: 100 },
                { ...animFrames[4], duration: 100 },
                { ...animFrames[5], duration: 100 },
                { ...animFrames[0], duration: 1250 },
                { ...animFrames[6], duration: 100 },
                { ...animFrames[7], duration: 100 },
                { ...animFrames[8], duration: 100 },
                { ...animFrames[9], duration: 100 },
                { ...animFrames[10], duration: 100 },
                { ...animFrames[11], duration: 100 },
                { ...animFrames[12], duration: 100 },
              ],
              frameRate: 60,
              repeat: -1,
            });
          default:
            break;
        }
      } else {
        let i = 1, x = animFrames[0].order + 1;
        for (; i < animFrames.length; i++, x++) {
          if (animFrames[i].order > x) break;
        }
        animFrames = animFrames.slice(0, i);
      }

      const frameDuration = animation ? this.getFrameDurationForAnimation(animation) : 100;

      this.anims[texture][image] = this.game.anims.create({
        key: texture + image,
        frames: animFrames.map(frame => ({ ...frame, duration: frameDuration })),
        frameRate: 60,
        repeat: animation ? this.getRepeatCountForAnimation(animation) : -1,
      });
    }

    return this.anims[texture][image];
  }

  private getFrameDurationForAnimation(animation: string) {
    switch (animation) {
      case 'GAME_FORWARD50':
      case 'GAME_BACKWARD50':
      case 'GAME_CYCLE50':
      case 'GAME_REVERSECYCLE50':
        return 50;
      case 'GAME_SPLASH':
        return 65;
      case 'GAME_FORWARD100':
      case 'GAME_BACKWARD100':
      case 'GAME_CYCLE100':
      case 'GAME_REVERSECYCLE100':
      default:
        return 100;
      case 'GAME_FORWARD200':
      case 'GAME_BACKWARD200':
      case 'GAME_CYCLE200':
      case 'GAME_REVERSECYCLE200':
        return 200;
      case 'GAME_FORWARD500':
      case 'GAME_BACKWARD500':
      case 'GAME_CYCLE500':
      case 'GAME_REVERSECYCLE500':
        return 500;
    }
  }

  private getRepeatCountForAnimation(animation: string) {
    switch (animation) {
      case 'GAME_FORWARD50':
      case 'GAME_FORWARD100':
      case 'GAME_FORWARD200':
      case 'GAME_FORWARD500':
      case 'GAME_BACKWARD50':
      case 'GAME_BACKWARD100':
      case 'GAME_BACKWARD200':
      case 'GAME_BACKWARD500':
      case 'GAME_SPLASH':
        return 0;
      default:
        return -1;
    }
  }

  private createEnemyAnimation(name: string, image: string, framesGroup: Frame[]) {
    let key, repeat = 0, frameRate = 10;
    let frames = framesGroup.sort((a, b) => a.order - b.order);
    switch (Math.floor(framesGroup[0].order / 50)) {
      case 0:
        key = 'FASTADVANCE';
        repeat = -1;
        break;
      case 1:
        key = 'ADVANCE';
        frameRate = 5;
        repeat = -1;
        break;
      case 2:
        key = 'STAND';
        if (image === 'LEVEL_RAUX') {
          frames = [
            { ...frames[0], duration: 250 },
            { ...frames[1], duration: 100 },
            { ...frames[2], duration: 250 },
            { ...frames[3], duration: 250 },
            { ...frames[2], duration: 250 },
            { ...frames[3], duration: 250 },
            { ...frames[4], duration: 250 },
            { ...frames[0], duration: 250 },
          ];
        }
        break;
      case 4:
        key = 'STRIKE';
        frameRate = 22;
        switch (image) {
          case 'LEVEL_OFFICER':
            frames = [
              { ...frames[0], duration: 200 },
              { ...frames[2], duration: 20 },
              { ...frames[3], duration: 20 },
              { ...frames[4], duration: 125 },
              { ...frames[2], duration: 20 },
              { ...frames[1], duration: 2 },
            ];
            break;
          case 'LEVEL_SOLDIER':
            frames = [
              { ...frames[0], duration: 150 },
              { ...frames[1], duration: 200 },
              { ...frames[4], duration: 25 },
              { ...frames[2], duration: 50 },
              { ...frames[3], duration: 100 },
              { ...frames[0], duration: 100 },
            ];
            break;
          case 'LEVEL_RAUX':
            frames = [
              { ...frames[0], duration: 10 },
              { ...frames[1], duration: 20 },
              { ...frames[2], duration: 45 },
              { ...frames[3], duration: 50 },
              { ...frames[4], duration: 50 },
            ];
          default:
            break;
        }
        break;
      case 6:
        key = 'STRIKE1';
        break;
      case 8:
        key = 'STRIKE2';
        break;
      case 10:
        key = 'HITHIGH';
        frameRate = 22;
        frames = [
          { ...frames[0], duration: 25 },
          { ...frames[1], duration: 100 },
          { ...frames[0], duration: 25 },
        ];
        break;
      case 11:
        key = 'HITSPECIAL';
        break;
      case 12:
        key = 'HITLOW';
        frameRate = 22;
        frames = [
          { ...frames[0], duration: 25 },
          { ...frames[1], duration: 100 },
          { ...frames[0], duration: 25 },
        ];
        break;
      case 14:
        key = 'HITDUCK';
        break;
      case 16:
        key = 'JUMP';
        break;
      case 18:
        key = 'FALL';
        repeat = -1;
        break;
      case 19:
        key = 'KILLFALL';
        repeat = -1;
        break;
      default:
        console.warn('UNKNOWN FRAME VALUES');
        break;
    }

    this.anims[name][image][key] = this.game.anims.create({
      key: name + image + key,
      frames,
      frameRate,
      repeat,
    });
  }
}

interface Frame {
  key: string;
  frame: string;
  order: number;
  duration?: number;
}
