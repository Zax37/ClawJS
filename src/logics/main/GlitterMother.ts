import { PowerupType } from '../../model/PowerupType';
import { DynamicObject } from '../../object/DynamicObject';
import { MapDisplay } from '../../scenes/MapDisplay';
import { CaptainClaw } from './CaptainClaw';

const GLITTER_GRAPH = {
  texture: 'GAME',
  image: 'GAME_SPARKLE',
  animation: 'GAME_FORWARD50',
  frame: 1,
};

export class GlitterMother extends DynamicObject {
  private glitterChildren: DynamicObject[] = [];
  private nextSpawnTime: number;
  private amountOfGlittersToCreate: number;
  private locked: boolean;

  constructor(protected scene: MapDisplay, protected mainLayer: Phaser.Tilemaps.DynamicTilemapLayer, protected source: CaptainClaw) {
    super(scene, mainLayer, {
      x: source.x,
      y: source.y,
      z: source.z + 1,
      logic: 'GlitterMother',
      ...GLITTER_GRAPH,
    });

    this.visible = false;
    this.nextSpawnTime = scene.time.now;
    this.amountOfGlittersToCreate = 2;
  }

  preUpdate(time: number, delta: number) {
    if (this.source.powerup !== PowerupType.CATNIP) {
      this.destroy();
    } else if (false && time >= this.nextSpawnTime) {
      for (let i = 0; i < this.amountOfGlittersToCreate; i++) {
        const height = this.source.body.height;
        const x = this.source.body.left + (this.source.flipX ? -2 : 2) + (this.source.body.width - 1) * Math.random();
        const y = this.source.body.top + 5 + (height - 4) * Math.random();

        if (!this.locked) {
          const glitterChild = new DynamicObject(this.scene, this.mainLayer, {
            x, y, z: this.source.depth + 1,
            logic: 'GlitterChild',
            ...GLITTER_GRAPH,
          }, undefined, true);

          this.glitterChildren.push(glitterChild);

          glitterChild.on('animationcomplete', () => {
            glitterChild.destroy();
            const id = this.glitterChildren.indexOf(glitterChild);
            if (id !== -1) {
              this.glitterChildren.splice(id, 1);
            }
          });
        }
      }
      this.nextSpawnTime += 20;
    }
  }

  lock() {
    this.nextSpawnTime = this.scene.time.now + 1000;
    this.locked = true;
  }

  unlock() {
    this.nextSpawnTime = this.scene.time.now + 25;
    this.locked = false;
  }
}
