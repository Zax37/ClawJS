import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config';
import { BootyScene, BootyState } from '../../scenes/BootyScene';

const INIT_DURATION = 5000;
const MAIN_TRANSITION_DURATION = 2500;

export class BootyMapPiece extends Phaser.GameObjects.Image {
  startTime: number;
  targetX: number;
  targetY: number;
  private curlingSound: Phaser.Sound.BaseSound.AudioSpriteSound;

  constructor(protected scene: BootyScene, protected startX: number, protected startY: number, texture: string) {
    super(scene, startX, startY, texture);

    scene.sys.updateList.add(this);
  }

  preUpdate(time: number, delta: number) {
    switch (this.scene.state) {
      case BootyState.INIT:
        if (this.startTime) {
          if (time - this.startTime > INIT_DURATION) {
            this.scene.sys.displayList.add(this);
            this.scene.state = BootyState.TRANSITION;
            this.curlingSound = this.scene.sound.add('CURLING1', { volume: this.scene.game.soundsManager.getSoundsVolume() });
            this.curlingSound.play();
            this.startTime = time;
          }
        } else {
          this.startTime = time;
          this.targetX = CANVAS_WIDTH - 166;
          this.targetY = CANVAS_HEIGHT - 162;
        }
        break;
      case BootyState.TRANSITION:
        const timeSinceStart = time - this.startTime;
        if (timeSinceStart < MAIN_TRANSITION_DURATION) {
          const progress = timeSinceStart / MAIN_TRANSITION_DURATION;
          this.x = (this.targetX - this.startX) * progress + this.startX;
          this.y = (this.targetY - this.startY) * progress + this.startY;
        } else {
          this.x = this.targetX;
          this.y = this.targetY;
          this.scene.state = BootyState.DIALOG;
          this.curlingSound.stop();
          this.scene.sound.add('IMPACT3', { volume: this.scene.game.soundsManager.getSoundsVolume() }).play();
        }
        break;
      default:
        break;
    }
  }

  destroy() {
    if (this.curlingSound) {
      this.curlingSound.destroy();
    }
    super.destroy();
  }
}
