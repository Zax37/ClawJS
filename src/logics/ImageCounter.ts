import DynamicObject from '../object/DynamicObject';
import GameHUD from '../scenes/GameHUD';
import StaticObject from '../object/StaticObject';

export default class ImageCounter extends DynamicObject {
  private nums: StaticObject[] = [];
  private value = 0;

  constructor(scene: GameHUD, x: number, y: number, image: string, private textImage: string, fixedWidth: number, spacing: number, startOffsetX: number, startOffsetY: number, animation?: string) {
    super(scene, null, { x, y, z: 0, logic: '', texture: 'GAME', image, frame: 0, animation }, {}, true);

    for (let i = 0; i < fixedWidth; i++) {
      this.nums.push(new StaticObject(scene, null, {
        x: x + startOffsetX + i * spacing,
        y: y + startOffsetY,
        z: 0,
        logic: '',
        frame: 0,
        texture: 'GAME',
        image: textImage,
      }));
    }
  }

  setValue(newValue: number) {
    if (this.value !== newValue) {
      const oldValueStringLength = this.value.toString().length;
      const valueString = newValue.toString();

      if (oldValueStringLength - valueString.length) {
        for (let i = this.nums.length - oldValueStringLength; i < this.nums.length - valueString.length; i++) {
          this.nums[i].setFrame(this.textImage + 0);
        }
      }

      for (let i = this.nums.length - valueString.length, j = 0; i < this.nums.length; i++, j++) {
        this.nums[i].setFrame(this.textImage + (Number.parseInt(valueString.charAt(j), 0)));
      }

      this.value = newValue;
    }
  }

  setVisible(on: boolean) {
    super.setVisible(on);

    for (let i = 0; i < this.nums.length; i++) {
      this.nums[i].visible = on;
    }

    return this;
  }
}