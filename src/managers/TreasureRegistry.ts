enum TreasureType {
  SKULL,
  CROWN,
  GECKO,
  SCEPTER,
  CROSS,
  CHALICE,
  RING,
  GOLDBAR,
  COIN
}

export default class TreasureRegistry {
  private registeredTreasure: { [key: number]: number; } = {};
  private collectedTreasure: { [key: number]: number; } = {};

  reset() {
    this.registeredTreasure = {};
    this.collectedTreasure = {};
  }

  register(treasure: TreasureType) {
    this.registeredTreasure[treasure]++;
  }

  collect(treasure: TreasureType) {
    this.collectedTreasure[treasure]++;
  }
}