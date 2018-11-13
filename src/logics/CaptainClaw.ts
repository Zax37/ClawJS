import Scene = Phaser.Scene;
import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export default class CaptainClaw extends Phaser.Physics.Arcade.Sprite {
  inputs = {
    JUMP: false,
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
  };

  constructor(scene: Scene, mainLayer: DynamicTilemapLayer, object: any) {
    super(scene, object.x, object.y, object.imageSet);
    this.depth = 4000;
    this.anims.play('stand');

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);
    scene.physics.add.collider(this, mainLayer);

    this.setMass(1000);
    this.setSize(32, 112);
    this.setOffset(32, 1);

    this.on('animationcomplete', this.animComplete, this);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    if (this.body.blocked.down && (this.anims.currentAnim.key === 'jump' || this.anims.currentAnim.key === 'fall')) {
      this.anims.play('stand');
    }

    if (this.inputs.DOWN) {
      this.setSize(32, 50);
      this.setOffset(32, 63);
    } else {
      this.setSize(32, 112);
      this.setOffset(32, 1);

      if (this.inputs.LEFT) {
        this.setVelocityX(-350);
        this.flipX = true;

        if (this.anims.currentAnim.key === 'stand') {
          this.anims.play('walk');
        }
      } else if (this.inputs.RIGHT) {
        this.setVelocityX(350);
        this.flipX = false;

        if (this.anims.currentAnim.key === 'stand') {
          this.anims.play('walk');
        }
      } else {
        this.setVelocityX(0);

        if (this.anims.currentAnim.key === 'walk') {
          this.anims.play('stand');
        }
      }

      if (this.inputs.JUMP && this.body.blocked.down) {
        this.setVelocityY(-750);
        this.anims.play('jump');
      }
    }

    if (!this.inputs.JUMP && this.body.velocity.y < 0) {
      this.setVelocityY(0);
    }

    if (this.body.velocity.y > 0 && this.anims.currentAnim.key === 'walk') {
      this.anims.play('fall');
    }
  }

  animComplete(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame)
  {
    if(animation.key === 'jump')
    {
      this.anims.play('fall');
    }
  }
}
