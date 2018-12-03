import Game from "../game";
import {isNumber} from "../util";

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
          {prefix: 'CLAW_', start: 11, end: 18}),
        frameRate: 9,
        repeat: -1
      });

      this.game.anims.create({
        key: 'ClawWalk',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 1, end: 10}),
        frameRate: 13,
        repeat: -1
      });

      this.game.anims.create({
        key: 'ClawWalkCatnip',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 1, end: 10}),
        frameRate: 16,
        repeat: -1
      });

      this.game.anims.create({
        key: 'ClawJump',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 271, end: 278}),
        frameRate: 15,
        repeat: 0
      });

      this.game.anims.create({
        key: 'ClawFall',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 279, end: 282}),
        frameRate: 15,
        repeat: -1
      });

      this.game.anims.create({
        key: 'ClawClimb',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 371, end: 382}),
        frameRate: 18,
        repeat: -1
      });

      this.game.anims.create({
        key: 'CheckpointRise',
        frames: this.game.anims.generateFrameNames('GAME',
          {prefix: 'GAME_CHECKPOINTFLAG', start: 1, end: 7}),
        frameRate: 7
      });

      this.game.anims.create({
        key: 'CheckpointWave',
        frames: this.game.anims.generateFrameNames('GAME',
          {prefix: 'GAME_CHECKPOINTFLAG', start: 8, end: 13}),
        frameRate: 7,
        repeat: -1
      });

      this.game.anims.create({
        key: 'SuperCheckpointRise',
        frames: this.game.anims.generateFrameNames('GAME',
          {prefix: 'GAME_SUPERCHECKPOINT', start: 1, end: 7}),
        frameRate: 7
      });

      this.game.anims.create({
        key: 'SuperCheckpointWave',
        frames: this.game.anims.generateFrameNames('GAME',
          {prefix: 'GAME_SUPERCHECKPOINT', start: 8, end: 13}),
        frameRate: 7,
        repeat: -1
      });
    }
  }

  request(name: string, image: string, animation?: string) {
    if (!this.anims[name]) {
      this.anims[name] = {};
    }

    if (!this.anims[name][image]) {
      const textureFrames = this.game.textures.get(name).getFrameNames();
      const animFrames = textureFrames
        .filter(frameName => frameName.startsWith(image) && isNumber(frameName.charAt(image.length)))
        .map(frameName => ({ key: name, frame: frameName, order: parseInt(frameName.substr(image.length)) }))
        .sort((a, b) => a.order - b.order);

      if (!animFrames.length) return false;

      this.anims[name][image] = this.game.anims.create({
        key: image,
        frames: animFrames,
        frameRate: animation ? this.getSpeedForAnimation(animation) : 12,
        repeat: animation ? this.getRepeatCountForAnimation(animation) : -1
      });
    }

    return this.anims[name][image];
  }

  private getSpeedForAnimation(animation: string) {
    switch (animation) {
      case 'GAME_FORWARD50':
      case 'GAME_CYCLE50':
        return 20;
      case 'LEVEL_MANICALS_MANICAL':
      case 'GAME_FORWARD100':
      case 'GAME_CYCLE100':
      default:
        return 10;
    }
  }

  private getRepeatCountForAnimation(animation: string) {
    switch (animation) {
      case 'GAME_FORWARD50':
      case 'GAME_FORWARD100':
        return 0;
      default:
        return -1;
    }
  }
}