import { NineSlice } from 'phaser3-nineslice';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config';
import MenuScene from '../../scenes/MenuScene';

export default class Changelog extends Phaser.GameObjects.Text {
  private dlg: NineSlice;
  private fade: Phaser.GameObjects.Rectangle;

  constructor(scene: MenuScene, text: string) {
    super(scene, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, text, { font: '16px Arial', fill: '#000' });

    this.fade = scene.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0.5);
    this.fade.setOrigin(0, 0);
    this.fade.setDepth(9999);

    this.dlg = scene.add.nineslice(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 340, 240, 'frame', [120, 140, 75, 120],
    );
    this.dlg.depth = 9999;
    this.dlg.setOrigin(0.5, 0.5);

    scene.sys.displayList.add(this);
    this.setOrigin(0.5, 0.5);
    this.setAlign('center');
    this.setDepth(9999);
  }

  destroy() {
    this.fade.destroy();
    this.dlg.destroy();
    super.destroy();
  }
}
