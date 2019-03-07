import BootyScene from '../../scenes/BootyScene';

export default class BootySupplyTreasure extends Phaser.GameObjects.Image {
  constructor(protected scene: BootyScene, protected startX: number, protected startY: number,
              protected targetX: number, protected targetY: number, protected image: string,
              protected startTime: number, protected duration: number) {
    super(scene, startX, startY, 'GAME', image + 1);
    this.scene.sys.displayList.add(this);
    this.scene.sys.updateList.add(this);
  }

  preUpdate(time: number, delta: number) {
    const timeSinceStart = time - this.startTime;
    if (timeSinceStart < this.duration) {
      const progress = Math.min(timeSinceStart / this.duration, 1.0);
      this.x = (this.targetX - this.startX) * progress + this.startX;
      this.y = (this.targetY - this.startY) * progress + this.startY;
    } else {
      this.emit('end');
      this.destroy();
    }
  }
}
