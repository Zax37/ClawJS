import { TreasureType } from '../model/TreasureType';

export class TreasureRegistry {
  private registeredTreasure: { [key: number]: number; } = {};
  private collectedTreasure: { [key: number]: number; } = {};
  private levelScore: number;
  private gameScore: number;

  reset() {
    this.registeredTreasure = {};
    this.collectedTreasure = {};
    this.levelScore = 0;
  }

  register(treasure: TreasureType) {
    const registered = this.registeredTreasure[treasure];
    this.registeredTreasure[treasure] = registered ? registered + 1 : 1;
  }

  collect(treasure: TreasureType) {
    const collected = this.collectedTreasure[treasure];
    this.collectedTreasure[treasure] = collected ? collected + 1 : 1;
  }

  getCollected(treasure: TreasureType) {
    return this.collectedTreasure[treasure] || 0;
  }

  getRegistered(treasure: TreasureType) {
    return this.registeredTreasure[treasure] || 0;
  }

  getLevelScore() {
    return this.levelScore;
  }

  getGameScore() {
    return this.gameScore;
  }

  setGameScore(value: number) {
    this.gameScore = value;
  }
}
