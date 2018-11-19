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
        key: 'stand',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 11, end: 18}),
        frameRate: 9,
        repeat: -1
      });

      this.game.anims.create({
        key: 'walk',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 1, end: 10}),
        frameRate: 13,
        repeat: -1
      });

      this.game.anims.create({
        key: 'jump',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 271, end: 278}),
        frameRate: 15,
        repeat: 0
      });

      this.game.anims.create({
        key: 'fall',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 279, end: 282}),
        frameRate: 15,
        repeat: -1
      });

      this.game.anims.create({
        key: 'climb',
        frames: this.game.anims.generateFrameNames('CLAW',
          {prefix: 'CLAW_', start: 371, end: 382}),
        frameRate: 30,
        repeat: -1
      });
    }
  }

  request(name: string, image: string) {
    if (!this.anims[name]) {
      this.anims[name] = {};
    }

    if (!this.anims[name][image]) {
      const textureFrames = this.game.textures.get(name).getFrameNames();
      const animFrames = textureFrames
        .filter(frameName => frameName.startsWith(image) && isNumber(frameName.charAt(image.length)))
        .map(frameName => ({ key: name, frame: frameName }));

      if (!animFrames.length) return false;

      this.anims[name][image] = this.game.anims.create({
        key: image,
        frames: animFrames,
        frameRate: 12,
        repeat: -1
      });
    }

    return this.anims[name][image];
  }
}