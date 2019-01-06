import { TreasureType } from '../model/TreasureType';

export default class TreasureRegistry {
  private registeredTreasure: { [key: number]: number; } = {};
  private collectedTreasure: { [key: number]: number; } = {};

  reset() {
    this.registeredTreasure = {};
    this.collectedTreasure = {};
  }

  register(treasure: TreasureType) {
    const registered = this.registeredTreasure[treasure];
    this.registeredTreasure[treasure] = registered ? registered + 1 : 1;
  }

  collect(treasure: TreasureType) {
    const collected = this.collectedTreasure[treasure];
    this.collectedTreasure[treasure] = collected ? collected + 1 : 1;
  }
}