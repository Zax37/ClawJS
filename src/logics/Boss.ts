import { ObjectCreationData } from '../model/ObjectData';
import MapDisplay from '../scenes/MapDisplay';
import Health from './abstract/Health';
import BossStagger from './BossStagger';
import CaptainClawAttack from './CaptainClawAttack';
import HumanEnemy from './HumanEnemy';
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class Boss extends HumanEnemy {
  private bossStagger: BossStagger;
  startedFight: boolean;
  attempt: number;

  constructor(protected scene: MapDisplay, mainLayer: DynamicTilemapLayer, object: ObjectCreationData) {
    super(scene, mainLayer, object);
    this.container.rawContents = [31];
    this.health = new Health(100, scene.time);
    this.attackSound = 'LEVEL_RAUX_00840003';
    this.deathSound = 'LEVEL_RAUX_00840005';
    this.strikeSound = 'LEVEL_LARASW';

    this.goingRight = false;
    this.walking = false;
    this.play(this.animations['STAND'].key);
    this.anims.stop();
  }

  preUpdate(time: number, delta: number) {
    if (this.scene.transitioning) return;
    super.preUpdate(time, delta);

    if (this.startedFight) {
      if (this.attempt !== this.scene.claw.attempt) {
        this.health.reset();
        this.attempt = this.scene.claw.attempt;
        this.x = this.object.x;
        this.y = this.object.y;
        this.flipX = false;
        this.stand(time);
      }
    } else {
      if (!this.bossStagger && this.isOnScreen()) {
        this.bossStagger = new BossStagger(this.scene, this);
        this.attempt = this.scene.claw.attempt;
      }
    }
  }

  protected stand(time: number) {
    if (!this.startedFight) return;
    super.stand(time);
  }

  protected walk() {
    if (!this.startedFight) return;
    super.walk();
  }

  die(attackSource: CaptainClawAttack) {
    this.scene.cameras.main.stopFollow();
    this.scene.game.soundsManager.playSound('GAME_AMULETRISE');
    this.scene.claw.lock();
    super.die(attackSource);
  }

  staggerLine() {
    this.say('LEVEL_STAGING_ENEMY2');
    this.play(this.animations['STAND'].key);
    this.toggleFlipX();
  }
}