import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../config';
import Pointer = Phaser.Input.Pointer;

const setInteractiveIf = (option: Phaser.GameObjects.BitmapText, condition: boolean) => {
  if (condition) {
    option.setInteractive({ useHandCursor: true });
  } else {
    option.disableInteractive();
  }
};

export abstract class Menu extends Phaser.Events.EventEmitter {
  title: Phaser.GameObjects.BitmapText;
  options: Phaser.GameObjects.BitmapText[];
  disabledOptions: number[];
  selectedOption: number;

  private _disabled: boolean;

  get disabled() {
    return this._disabled;
  }

  set disabled(disable: boolean) {
    if (this._disabled !== disable) {
      this._disabled = disable;

      if (this._disabled) {
        for (let i = 0; i < this.options.length; i++) {
          this.options[i].disableInteractive();
        }
      } else {
        for (let i = 0; i < this.options.length; i++) {
          const option = this.options[i];
          setInteractiveIf(option, !this.isDisabled(i) && option.visible);
        }
      }
    }
  }

  protected constructor(protected scene: Phaser.Scene, title: string, options: string[], disabled?: number[], protected parent?: Menu, protected offset?: number) {
    super();
    this.disabledOptions = disabled ? disabled.sort() : [];
    this.selectedOption = 0;

    for (let i = 0; i < this.disabledOptions.length; i++) {
      if (this.disabledOptions[i] === this.selectedOption) {
        this.selectedOption ++;
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
    for (let j = 0; j < this.disabledOptions.length; j++) {
      if (i === this.disabledOptions[j]) {
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
        this.isDisabled(i) ? 'disabled' : i === this.selectedOption ? 'selected' : 'regular',
        options[i], 128);
      option.setOrigin(0.5,0.5);
      ret.push(option);

      if (!this.isDisabled(i)) {
        option.setInteractive({ useHandCursor: true });
      }

      const switchOption = (p: Pointer) => {
        if (p.isDown && !this.disabled && !this.isDisabled(i) && option.visible) {
          this.options[this.selectedOption].setFont('regular');

          this.selectedOption = i;

          this.options[this.selectedOption].setFont('selected');
        }
      };

      option.on('pointerdown', switchOption);
      option.on('pointerover', switchOption);

      option.on('pointerup', () => {
        if (this.selectedOption === i && !this.disabled && !this.isDisabled(i) && option.visible) {
          this.confirm(i);
        }
      });
    }

    return ret;
  }

  hide() {
    this.title.visible = false;
    this.options.forEach(option => {
      option.visible = false;
      option.disableInteractive();
    });
  }

  show() {
    this.title.visible = true;
    this.options.forEach((option, i) => {
      option.visible = true;
      setInteractiveIf(option, !this.disabled && !this.isDisabled(i) && option.visible);
    });
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
    this.options[this.selectedOption].setFont('regular');

    this.selectedOption--;

    while (this.selectedOption > -1 && this.isDisabled(this.selectedOption)) {
      this.selectedOption--;
    }

    if (this.selectedOption < 0) {
      this.selectedOption = this.options.length - 1;
    }

    while (this.selectedOption > -1 && this.isDisabled(this.selectedOption)) {
      this.selectedOption--;
    }

    this.options[this.selectedOption].setFont('selected');
  }

  downPress() {
    this.options[this.selectedOption].setFont('regular');

    this.selectedOption++;

    while (this.selectedOption < this.options.length && this.isDisabled(this.selectedOption)) {
      this.selectedOption++;
    }

    if (this.selectedOption >= this.options.length) {
      this.selectedOption = 0;
    }

    while (this.selectedOption < this.options.length && this.isDisabled(this.selectedOption)) {
      this.selectedOption++;
    }

    this.options[this.selectedOption].setFont('selected');
  }

  leftPress() {}

  rightPress() {}

  abstract confirm(i: number): void;
}
