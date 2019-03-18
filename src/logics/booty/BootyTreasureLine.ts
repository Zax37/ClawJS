import { TreasureType } from '../../model/TreasureType';
import { BootyScene } from '../../scenes/BootyScene';
import { ImageCounter } from '../main/ImageCounter';
import { BootySupplyTreasure } from './BootySupplyTreasure';

const TREASURE_TRANSITION_DURATION_BASE = 450;
const TREASURE_TRANSITION_DURATION_BASE_COIN = 300;
const TREASURE_TRANSITION_DELAY = 180;
const TREASURE_TRANSITION_DELAY_COIN = 70;

export class BootyTreasureLine extends Phaser.GameObjects.Image {
  startTime: number;
  startX: number;
  startY: number;

  value: number;
  collected: number;
  registered: number;

  textOf: Phaser.GameObjects.BitmapText;
  textTimes: Phaser.GameObjects.BitmapText;
  textEquals: Phaser.GameObjects.BitmapText;

  scoreFrame: ImageCounter;
  maxScoreFrame: ImageCounter;
  pointsMultiplierFrame: ImageCounter;
  finalScoreFrame: ImageCounter;

  private duration: number;
  private delay: number;
  private finished: boolean;

  constructor(protected scene: BootyScene, protected targetX: number, protected targetY: number, protected treasure: {image: string, sound: string, type: TreasureType, score: number}) {
    super(scene, -100, targetY, 'GAME', treasure.image + 1);

    this.value = 0;
    this.collected = scene.game.treasureRegistry.getCollected(treasure.type);
    this.registered = scene.game.treasureRegistry.getRegistered(treasure.type);

    this.scoreFrame = new ImageCounter(scene, targetX, targetY, treasure.image, 'GAME_INTERFACE_SCORENUMBERS', this.collected.toString().length, 11, 32, 0);
    this.scoreFrame.setVisible(false);

    this.textOf = scene.add.dynamicBitmapText(targetX + 96, targetY, 'regular', 'OF', 100);
    this.textOf.setOrigin(0.5,0.5);
    this.textOf.setVisible(false);

    this.maxScoreFrame = new ImageCounter(scene, targetX + 132, targetY, '', 'GAME_INTERFACE_SCORENUMBERS', this.registered.toString().length, 11);
    this.maxScoreFrame.setValue(this.registered);
    this.maxScoreFrame.setVisible(false);

    this.textTimes = scene.add.dynamicBitmapText(targetX + 190, targetY, 'regular', 'X', 100);
    this.textTimes.setOrigin(0.5,0.5);
    this.textTimes.setVisible(false);

    this.pointsMultiplierFrame = new ImageCounter(scene, targetX + 210, targetY, '', 'GAME_INTERFACE_SCORENUMBERS', this.treasure.score.toString().length, 11);
    this.pointsMultiplierFrame.setValue(this.treasure.score);
    this.pointsMultiplierFrame.setVisible(false);

    this.textEquals = scene.add.dynamicBitmapText(targetX + 275, targetY, 'regular', '=', 100);
    this.textEquals.setOrigin(0.5,0.5);
    this.textEquals.setVisible(false);

    this.finalScoreFrame = new ImageCounter(scene, targetX + 290, targetY, '', 'GAME_INTERFACE_SCORENUMBERS', 1, 11);
    this.finalScoreFrame.setVisible(false);
  }

  start() {
    this.startTime = this.scene.time.now;
    this.startX = this.x;
    this.startY = this.y;
    this.scene.sys.displayList.add(this);
    this.scene.sys.updateList.add(this);

    this.duration = this.treasure.type === TreasureType.COIN ? TREASURE_TRANSITION_DURATION_BASE_COIN : TREASURE_TRANSITION_DURATION_BASE;
    this.delay = this.treasure.type === TreasureType.COIN ? TREASURE_TRANSITION_DELAY_COIN : TREASURE_TRANSITION_DELAY;
  }

  end() {
    this.finished = true;
    this.startTime = -TREASURE_TRANSITION_DURATION_BASE;
    this.scene.sys.displayList.remove(this);
    this.scene.sys.updateList.remove(this);
    this.scoreFrame.setVisible(true);
    this.scoreFrame.setValue(this.collected);
    this.maxScoreFrame.setVisible(true);
    this.pointsMultiplierFrame.setVisible(true);
    this.finalScoreFrame.setValue(this.collected * this.treasure.score);
    this.finalScoreFrame.setVisible(true);
    this.textOf.setVisible(true);
    this.textTimes.setVisible(true);
    this.textEquals.setVisible(true);
    this.emit('end');
  }

  preUpdate(time: number, delta: number) {
    if (this.startTime > 0) {
      const timeSinceStart = time - this.startTime;
      if (!this.scoreFrame.visible) {
        const progress = Math.min(timeSinceStart / TREASURE_TRANSITION_DURATION_BASE, 1.0);
        this.x = (this.targetX - this.startX) * progress + this.startX;
        this.y = (this.targetY - this.startY) * progress + this.startY;

        if (progress >= 1.0) {
          this.scoreFrame.setVisible(true);
          this.textOf.setVisible(true);
          this.maxScoreFrame.setVisible(true);
          this.textTimes.setVisible(true);
          this.pointsMultiplierFrame.setVisible(true);
          this.textEquals.setVisible(true);
          this.finalScoreFrame.setVisible(true);
          this.scene.game.soundsManager.playSound(this.treasure.sound);
        }
      } else if (timeSinceStart >= this.delay && this.value < this.collected) {
        const supply = new BootySupplyTreasure(this.scene, -100, -100, this.targetX, this.targetY, this.treasure.image, time, this.duration);
        supply.once('end', () => {
          if (!this.finished) {
            this.scoreFrame.increase();
            this.finalScoreFrame.setValue(this.scoreFrame.getValue() * this.treasure.score);
          }
          this.scene.game.soundsManager.playSound('GAME_PUBOUNCE1');
        });
        this.duration -= 1;
        this.delay -= 3;
        this.startTime = time;
        this.value++;
      } else if (this.value === this.collected && this.value === this.scoreFrame.getValue()) {
        this.end();
      }
    }
  }
}
