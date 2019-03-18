import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config';
import { MenuScene } from '../../scenes/MenuScene';
import { NineSlice } from 'phaser3-nineslice';

export const WINDOW_NINESLICE_PADDING = [120, 140, 75, 120];
export const WINDOW_BUTTON_SHAPE = { hitArea: [ -10, -10, 10, 10 ], useHandCursor: true };

export class Window extends Phaser.GameObjects.Container {
  protected fade: Phaser.GameObjects.Rectangle;
  protected dlgBg: Phaser.GameObjects.TileSprite;
  protected dlg: NineSlice;
  protected slider: Phaser.GameObjects.Sprite;
  protected accept: Phaser.GameObjects.Sprite;
  protected scrollMinY: number;
  protected scrollMaxY: number;
  protected scrollPosition = 0;

  constructor(scene: MenuScene, width: number, height: number, scrollableContentsHeight?: number) {
    super(scene, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.setDepth(9999);
    scene.sys.displayList.add(this);

    this.fade = scene.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0.5);

    this.dlgBg = scene.add.tileSprite(0, 0, width - 64, height - 64, 'paper');

    this.dlg = scene.add.nineslice(0, 0, width, height, 'frame', WINDOW_NINESLICE_PADDING);
    this.dlg.setOrigin(0.5, 0.5);

    this.accept = scene.add.sprite(0, height / 2 - 32, 'accept');
    this.accept.setInteractive(WINDOW_BUTTON_SHAPE);
    this.accept.on('pointerover', () => this.accept.setTint(0xe0eac0));
    this.accept.on('pointerout', () => this.accept.clearTint());
    this.accept.on('pointerdown', () => {
      this.accept.setTint(0xd0e000);
    });
    this.accept.on('pointerup', () => {
      this.destroy();
    });

    this.add(this.fade);
    this.add(this.dlgBg);
    this.add(this.dlg);
    this.add(this.accept);

    if (scrollableContentsHeight && scrollableContentsHeight > height - 48) {
      this.scrollMinY = 108 - height / 2;
      this.scrollMaxY = height / 2 - 96;
      this.slider = scene.add.sprite(width / 2 - 31, this.scrollMinY, 'scroll');
      this.slider.setInteractive({ ...WINDOW_BUTTON_SHAPE, draggable: true });
      this.slider.on('drag', (pointer: Phaser.Input.Pointer) => {
        this.slider.y = Math.min(Math.max(pointer.position.y - this.y, this.scrollMinY), this.scrollMaxY);
        this.scrollPosition = (this.slider.y - this.scrollMinY) / (this.scrollMaxY - this.scrollMinY);
        this.scroll(this.scrollPosition);
      });
      this.add(this.slider);
    }

    scene.game.soundsManager.playSound('LEVEL_SOLHITHI');
  }

  scroll(percentage: number) {
    this.scrollPosition = percentage;
    this.slider.y = this.scrollMinY + (this.scrollMaxY - this.scrollMinY) * percentage;
  }

  destroy() {
    if (this.slider) {
      this.slider.destroy();
    }
    this.accept.destroy();
    this.dlg.destroy();
    this.dlgBg.destroy();
    this.fade.destroy();
    super.destroy();
  }
}