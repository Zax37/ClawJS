export class Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;

  width: number;
  height: number;
  offsetX: number;
  offsetY: number;

  constructor(x1: number | {left: number, top: number, right: number, bottom: number}, y1?:number, x2?:number, y2?:number) {
    if (typeof x1 === 'number') {
      this.left = x1;
      this.top = y1!;
      this.right = x2!;
      this.bottom = y2!;
    } else {
      this.left = x1.left;
      this.top = x1.top;
      this.right = x1.right;
      this.bottom = x1.bottom;
    }

    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
    this.offsetX = Math.abs(this.right) - Math.abs(this.left);
    this.offsetY = Math.abs(this.bottom) - Math.abs(this.top) - 10;
  }
}
