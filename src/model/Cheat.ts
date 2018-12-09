import MapDisplay from "../scenes/MapDisplay";

export default class Cheat {
  private combo: string;
  private major: boolean;
  private effect: (scene: MapDisplay) => void;

  constructor(combo: string, major: boolean, effect: (scene: MapDisplay) => void) {
    this.combo = combo;
    this.major = major;
    this.effect = effect;
  }

  getCombo() {
    return this.combo;
  }

  /*
   * Triggers cheat for the given scene.
   * Return value says if triggered cheat was major.
   */
  trigger(scene: MapDisplay): boolean {
    this.effect(scene);
    return this.major;
  }
}
