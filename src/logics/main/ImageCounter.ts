import { DynamicObject } from '../../object/DynamicObject';
import { StaticObject } from '../../object/StaticObject';
import { BootyScene } from '../../scenes/BootyScene';
import { GameHUD } from '../../scenes/GameHUD';

export class ImageCounter extends DynamicObject {
  private nums: StaticObject[] = [];
  private value = 0;

  constructor(protected scene: GameHUD | BootyScene, x: number, y: number, private image: string, private textImage: string, fixedWidth: number, protected spacing: number, startOffsetX?: number, startOffsetY?: number, animation?: string) {
    super(scene, null, { x, y, z: 0, logic: '', texture: 'GAME', image, frame: 1, animation }, {}, true);
    if (!image) {
      this.visible = false;
    }

    for (let i = 0; i < fixedWidth; i++) {
      this.nums.push(new StaticObject(scene, null, {
        x: x + (startOffsetX || 0) + i * spacing,
        y: y + (startOffsetY || 0),
        z: 0,
        logic: '',
        frame: 0,
        texture: 'GAME',
        image: textImage,
      }));
    }
  }

  increase() {
    this.setValue(this.value + 1);
  }

  getValue() {
    return this.value;
  }

  setValue(newValue: number) {
    if (this.value !== newValue) {
      const oldValueStringLength = this.value.toString().length;
      const valueString = newValue.toString();

      while (valueString.length > this.nums.length) {
        this.nums.push(new StaticObject(this.scene, null, {
          x: this.nums[0].x + this.nums.length * this.spacing,
          y: this.nums[0].y,
          z: 0,
          logic: '',
          frame: 0,
          texture: 'GAME',
          image: this.textImage,
        }));
      }

      if (oldValueStringLength - valueString.length) {
        for (let i = this.nums.length - oldValueStringLength; i < this.nums.length - valueString.length; i++) {
          this.nums[i].setFrame(this.textImage + '0');
        }
      }

      for (let i = this.nums.length - valueString.length, j = 0; i < this.nums.length; i++, j++) {
        this.nums[i].setFrame(this.textImage + (Number.parseInt(valueString.charAt(j), 0)));
      }

      this.value = newValue;
    }
  }

  setVisible(on: boolean) {
    if (this.image) {
      super.setVisible(on);
    }

    for (let i = 0; i < this.nums.length; i++) {
      this.nums[i].visible = on;
    }

    return this;
  }
}