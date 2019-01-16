
export default class TimeCycle {
  constructor(private startDiff: number, private cycleLength: number) { }

  getProgress(time: number) {
    return ((time + this.cycleLength - this.startDiff) % this.cycleLength) / this.cycleLength;
  }
}