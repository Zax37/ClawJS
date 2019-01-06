export class Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;

  width: number;
  height: number;

  constructor(left: number, top: number, right: number, bottom: number) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;

    this.width = this.right - this.left;
    this.height = this.bottom - this.top;
  }
}
