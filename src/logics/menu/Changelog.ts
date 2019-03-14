import { NineSlice } from 'phaser3-nineslice';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../config';
import MenuScene from '../../scenes/MenuScene';
import p from '../../../package.json';
import c from '../../../changelog.json';

export default class Changelog extends Phaser.GameObjects.Container {
  private dlg: NineSlice;
  private text: Phaser.GameObjects.BBCodeText;
  private fade: Phaser.GameObjects.Rectangle;

  constructor(scene: MenuScene) {
    super(scene, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    const changelogText = '[b]CHANGELOG[/b]\n\n' + p.version + '\n\n' + c[p.version].map((change: string) => '- ' + change).join(',\n\n') + '.\n';
    this.setDepth(9999);

    scene.sys.displayList.add(this);

    this.fade = scene.add.rectangle(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, 0, 0.5);

    this.text = scene.add.rexBBCodeText(0, 0, changelogText, {
      fontFamily: 'CenturyGothic, Century Gothic, Geneva, AppleGothic, sans-serif',
      fontSize: 15, color: '0', underline: { thickness: 1, offset: 2 },
      lineSpacing: 1, baselineY: 2, wrap: { mode: 'word', width: 512 },
    });
    this.text.setOrigin(0.5, 0.5);
    this.text.setAlign('center');

    this.dlg = scene.add.nineslice(0, 0, Math.max(this.text.width + 128, 260), Math.max(this.text.height + 120, 195), 'frame', [120, 140, 75, 120]);
    this.dlg.setOrigin(0.5, 0.5);

    this.add(this.fade);
    this.add(this.dlg);
    this.add(this.text);

    scene.game.soundsManager.playSound('LEVEL_SOLHITHI');
  }

  destroy() {
    this.fade.destroy();
    this.text.destroy();
    this.dlg.destroy();
    super.destroy();
  }
}
