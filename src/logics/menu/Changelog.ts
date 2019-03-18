import { NineSlice } from 'phaser3-nineslice';
import { MenuScene } from '../../scenes/MenuScene';
import { Window } from '../abstract/Window';
import c from '../../../changelog.json';

const MAX_TEXT_WIDTH = 512;
const MAX_TEXT_HEIGHT = 300;

export class Changelog extends Window {
  private text: Phaser.GameObjects.BBCodeText;
  private windowHeight: number;

  constructor(scene: MenuScene) {
    const changelogText = '\n\n\n[b]CHANGELOG[/b]' + Object.keys(c).map(
      (version) => `\n\n[b]${version}[/b]\n\n`
        + c[version].map((change: string) => '- ' + change).join(',\n\n') + '.\n'
    );

    const text = scene.add.rexBBCodeText(0, 0, changelogText, {
      fontFamily: 'CenturyGothic, Century Gothic, Geneva, AppleGothic, sans-serif',
      fontSize: 15, color: '0', underline: { thickness: 1, offset: 2 },
      lineSpacing: 1, baselineY: 2, wrap: { mode: 'word', width: MAX_TEXT_WIDTH },
    });
    const windowWidth = Math.max(text.width + 128, 260);
    const windowHeight = Math.max(Math.min(text.height, MAX_TEXT_HEIGHT) + 120, 195);
    text.setY(-windowHeight / 2 + 32);
    text.setCrop(0, 0, MAX_TEXT_WIDTH, MAX_TEXT_HEIGHT + 64);
    text.setOrigin(0.5, 0);
    text.setAlign('center');

    super(scene, windowWidth, windowHeight, text.height);
    this.text = text;
    this.windowHeight = windowHeight;
    this.addAt(this.text, 2);
  }

  scroll(percentage: number) {
    if (this.scrollPosition !== percentage) {
      super.scroll(percentage);
    }
    const scrollHeight = Math.max(0, this.text.height - MAX_TEXT_HEIGHT) * 2 - 64;
    this.text.setY(32 + (scrollHeight * percentage + this.windowHeight) / -2);
    this.text.setCrop(0, (scrollHeight * percentage) / 2, MAX_TEXT_WIDTH, MAX_TEXT_HEIGHT + 64);
    this.dlgBg.tilePositionY = (scrollHeight * percentage) / 2;
  }

  scrollUp() {
    if (this.slider) {
      const amount = 15 / (this.text.height - MAX_TEXT_HEIGHT);
      this.scroll(Math.max(0, this.scrollPosition - amount));
    }
  }

  scrollDown() {
    if (this.slider) {
      const amount = 15 / (this.text.height - MAX_TEXT_HEIGHT);
      this.scroll(Math.min(1, this.scrollPosition + amount));
    }
  }

  destroy() {
    this.text.destroy();
    super.destroy();
  }
}
