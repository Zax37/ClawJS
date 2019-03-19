import { NineSlice } from 'phaser3-nineslice';
import { MenuScene } from '../../scenes/MenuScene';
import { TextWindow } from '../abstract/TextWindow';
import s from '../../../supporters.json';

const specialThanks = `


[size=18][b]Special thanks for:[/b][/size]


[i]my beloved girl, who thinks Claw is ugly,
but still plays ClawJS because it's "my game".[/i]


`;

export class SupportersWindow extends TextWindow {
  constructor(scene: MenuScene) {
    const supporters = specialThanks + Object.keys(s).map((category) =>
      '[u]' + category + '[/u]\n\n' + (
        s[category] instanceof Array
          ? s[category].join(',\n') + '.\n'
          : Object.keys(s[category]).map(subcategory =>
              '[b]' + subcategory + ':[/b]\n\n' + s[category][subcategory]
                .map((name: string) => '- ' + name)
                .join(',\n') + '.\n'
            ).join('\n')
      )
    ).join('\n');
    super(scene, supporters);
  }
}
