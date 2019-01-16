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
            duration: 50,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_283',
            duration: 125,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_284',
            duration: 75,
          },
          {
            key: 'CLAW',
            frame: 'CLAW_285',
            duration: 75,
          },
        ],
        frameRate: 60,
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

  request(name: string, image: string, animation?: string) {
    if (!this.anims[name]) {
      this.anims[name] = {};
    }

    if (!this.anims[name][image]) {
      const textureFrames = this.game.textures.get(name).getFrameNames();
      let animFrames = textureFrames
        .filter(frameName => frameName.startsWith(image) && isNumber(frameName.charAt(image.length)))
        .map(frameName => ({ key: name, frame: frameName, order: Number.parseInt(frameName.substr(image.length), 0) }))
        .sort((a, b) => a.order - b.order);

      if (!animFrames.length) return false;

      if (animation) {
        switch (animation) {
          case 'GAME_BACKWARD50':
          case 'GAME_BACKWARD100':
          case 'GAME_REVERSECYCLE50':
          case 'GAME_REVERSECYCLE100':
          case 'GAME_REVERSECYCLE200':
          case 'GAME_REVERSECYCLE500':
            animFrames.reverse();
            break;
          case 'LEVEL_HAND_HAND1':
            return this.anims[name][image] = this.game.anims.create({
              key: name + image,
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
          default:
            console.log(animation);
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

      this.anims[name][image] = this.game.anims.create({
        key: name + image,
        frames: animFrames.map(frame => ({ ...frame, duration: frameDuration })),
        frameRate: 60,
        repeat: animation ? this.getRepeatCountForAnimation(animation) : -1,
      });
    }

    return this.anims[name][image];
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
      case 'GAME_CYCLE200':
      case 'GAME_REVERSECYCLE200':
        return 200;
      case 'GAME_CYCLE500':
      case 'GAME_REVERSECYCLE500':
        return 500;
    }
  }

  private getRepeatCountForAnimation(animation: string) {
    switch (animation) {
      case 'GAME_FORWARD50':
      case 'GAME_FORWARD100':
      case 'GAME_SPLASH':
        return 0;
      default:
        return -1;
    }
  }
}