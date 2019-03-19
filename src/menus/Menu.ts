import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';

export abstract class Menu extends Phaser.Events.EventEmitter {
  title: Phaser.GameObjects.BitmapText;
  options: Phaser.GameObjects.BitmapText[];
  disabled: number[];
  selected: number;

  protected constructor(protected scene: Phaser.Scene, title: string, options: string[], disabled?: number[], protected parent?: Menu, protected offset?: number) {
    super();
    this.disabled = disabled ? disabled.sort() : [];
    this.selected = 0;

    for (let i = 0; i < this.disabled.length; i++) {
      if (this.disabled[i] === this.selected) {
        this.selected ++;
      }
    }

    this.title = scene.add.dynamicBitmapText(CANVAS_WIDTH / 2 + 8, CANVAS_HEIGHT / 2 - (offset ? offset * 1.5 : 60), 'regular', title, 164);
    this.title.setOrigin(0.5,0.5);
    this.options = this.createOptions(options);

    if (parent) {
      parent.hide();
    }
  }

  isDisabled(i: number): boolean {
    for (let j = 0; j < this.disabled.length; j++) {
      if (i === this.disabled[j]) {
        return true;
      }
    }
    return false;
  }

  createOptions(options: string[]): Phaser.GameObjects.BitmapText[] {
    const ret = [];

    for (let i = 0; i < options.length; i++) {
      const option = this.scene.add.dynamicBitmapText(
        CANVAS_WIDTH / 2 + 8,
        CANVAS_HEIGHT / 2 + 4 + i * (this.offset || 38),
        this.isDisabled(i) ? 'disabled' : i === this.selected ? 'selected' : 'regular',
        options[i], 128);
      option.setOrigin(0.5,0.5);
      ret.push(option);
    }

    return ret;
  }

  hide() {
    this.title.visible = false;
    this.options.forEach(option => option.visible = false);
  }

  show() {
    this.title.visible = true;
    this.options.forEach(option => option.visible = true);
  }

  destroy() {
    this.title.destroy();
    this.options.forEach(option => option.destroy());
  }

  back() {
    if (this.parent) {
      this.parent.show();
      this.emit('MenuChange', this.parent);
      this.destroy();
    }
  }

  upPress() {
    this.options[this.selected].setFont('regular');

    this.selected--;

    while (this.selected > -1 && this.isDisabled(this.selected)) {
      this.selected--;
    }

    if (this.selected < 0) {
      this.selected = this.options.length - 1;
    }

    while (this.selected > -1 && this.isDisabled(this.selected)) {
      this.selected--;
    }

    this.options[this.selected].setFont('selected');
  }

  downPress() {
    this.options[this.selected].setFont('regular');

    this.selected++;

    while (this.selected < this.options.length && this.isDisabled(this.selected)) {
      this.selected++;
    }

    if (this.selected >= this.options.length) {
      this.selected = 0;
    }

    while (this.selected < this.options.length && this.isDisabled(this.selected)) {
      this.selected++;
    }

    this.options[this.selected].setFont('selected');
  }

  leftPress() {}

  rightPress() {}

  abstract confirm(i: number): void;
}
