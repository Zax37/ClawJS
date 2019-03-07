import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config';
import StaticObject from '../../object/StaticObject';
import MapDisplay from '../../scenes/MapDisplay';
import Boss from './Boss';

export default class BossStagger extends Phaser.GameObjects.GameObject {
  private transitionStartTime: number;
  private direction: boolean;
  private defeat: StaticObject;
  private bossStaggerSound?: Phaser.Sound.BaseSound.AudioSpriteSound;
  private baseLevel: number;

  constructor(protected scene: MapDisplay, protected boss: Boss) {
    super(scene, 'BossStagger');
    scene.sys.updateList.add(this);

    this.baseLevel = scene.getBaseLevel();

    this.scene.claw.lock();
    this.scene.claw.play('ClawStand');
    if (this.scene.claw.dialogLine) {
      this.scene.claw.dialogLine.destroy();
      this.scene.claw.dialogLine = undefined;
    }

    this.transitionStartTime = this.scene.time.now;
    this.scene.cameras.main.stopFollow();
    this.scene.game.musicManager.play(this.scene.bossMusic);

    const bossMeter = new StaticObject(this.scene.hud, null, {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 32,
      z: 0,
      logic: '',
      texture: 'GAME',
      image: 'GAME_BOSSBAR',
      frame: 1,
    });
    const bossBar = this.scene.hud.add.rectangle(CANVAS_WIDTH / 2 - 114, CANVAS_HEIGHT - 32, 226, 8, 0xFF0000);
    bossBar.setOrigin(0, 0.5);
    boss.health.on('change', () => bossBar.setScale(boss.health.percentage(), 1));
  }

  preUpdate(time: number, delta: number) {
    if (this.scene.transitioning) return;
    if (this.defeat) {
      if (this.transitionStartTime) {
        const duration = time - this.transitionStartTime;
        const progress = Math.min(duration / (this.bossStaggerSound ? 2500 : 2000), 1);

        if (this.bossStaggerSound) {
          this.defeat.y = (CANVAS_HEIGHT * 0.4) * progress - 100;
          if (progress === 1) {
            this.bossStaggerSound.stop();
            this.bossStaggerSound = undefined;
            this.scene.game.soundsManager.playSound('GAME_SDPT2');
            this.scene.game.soundsManager.playVocal('LEVEL_STAGING_DEFEAT2', { delay: 0.1 });
            this.scene.cameras.main.shake(50, 0.02);
            this.transitionStartTime = time;
          }
        } else if (progress >= 0.75) {
          this.defeat.x = CANVAS_WIDTH * (progress - 0.5) * 2;
          if (progress === 1) {
            this.scene.claw.unlock();
            this.scene.cameras.main.startFollow(this.scene.claw, true);
            this.boss.startedFight = true;
            this.defeat.destroy();
            this.destroy();
          }
        }
      } else if (!this.scene.claw.dialogLine) {
        this.bossStaggerSound = this.scene.game.soundsManager.playSound('GAME_SDPT1', { loop: true });
        this.scene.cameras.main.shake(2500, 0.01);
        this.transitionStartTime = time;
      }
    } else if (this.boss.dialogLine) {
      this.transitionStartTime = time;
    } else if (this.transitionStartTime) {
      const duration = time - this.transitionStartTime;
      const progress = Math.min(duration / 1000, 1);

      if (this.direction) {
        this.scene.cameras.main.centerOn(this.boss.x - (this.boss.x - this.scene.claw.x) * progress, this.boss.y);

        if (progress === 1) {
          this.scene.claw.say('LEVEL_STAGING_CLAW2');
          this.transitionStartTime = 0;
          this.defeat = new StaticObject(this.scene.hud, null, {
            x: CANVAS_WIDTH / 2,
            y: -200,
            z: 0,
            logic: '',
            texture: 'LEVEL2',
            image: 'LEVEL_BOSSNAME',
            frame: 1,
          });
        }
      } else {
        this.scene.cameras.main.centerOn(this.scene.claw.x + (this.boss.x - this.scene.claw.x) * progress, this.boss.y);

        if (progress === 1) {
          this.direction = true;
          this.boss.staggerLine();
        }
      }
    }
  }
}