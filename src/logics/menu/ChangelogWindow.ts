import { NineSlice } from 'phaser3-nineslice';
import { MenuScene } from '../../scenes/MenuScene';
import { TextWindow } from '../abstract/TextWindow';
import c from '../../../changelog.json';

export class ChangelogWindow extends TextWindow {
  constructor(scene: MenuScene) {
    const changelogText = '\n\n\n[b]CHANGELOG[/b]' + Object.keys(c).map(
      (version) => `\n\n[b]${version}[/b]\n\n`
        + c[version].map((change: string) => '- ' + change).join(',\n\n') + '.\n'
    ).join('');
    super(scene, changelogText);
  }
}
