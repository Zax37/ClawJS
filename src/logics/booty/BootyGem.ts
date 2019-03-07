import BootyScene, { BootyState } from '../../scenes/BootyScene';

const INIT_DURATION = 5000;
const MAIN_TRANSITION_DURATION = 2500;

export default class BootyGem extends Phaser.GameObjects.Sprite {
  private startTime: number;
  private afterInit: boolean;
  private gemSound: Phaser.Sound.BaseSound;

  constructor(protected scene: BootyScene, x: number, y: number) {
    super(scene, x, y, 'gem', 1);

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);

    this.startTime = scene.time.now;
  }

  preUpdate(time: number, delta: number) {
    const timeSinceStart = time - this.startTime;
    const progress = Math.min(timeSinceStart / (this.afterInit ? MAIN_TRANSITION_DURATION : INIT_DURATION), 1);

    if (this.afterInit) {
      if (progress <= 0.5) {
        this.setFrame(1 + Math.round(progress * 62));
      } else if (progress < 0.9) {
        this.setFrame(33 + Math.round((progress - 0.5) * 21));
      } else {
        this.setFrame(33);
        this.scene.sys.updateList.remove(this);
        this.scene.state = BootyState.DIALOG;
      }
    } else if (progress === 1) {
      this.startTime = time;
      this.afterInit = true;
      this.gemSound = this.scene.sound.add('GEM', { volume: this.scene.game.soundsManager.getSoundsVolume() });
      this.gemSound.play();
    }
  }

  destroy() {
    if (this.gemSound) {
      this.gemSound.destroy();
    }
    super.destroy();
  }
}
