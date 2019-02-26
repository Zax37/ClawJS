import Cheat from '../model/Cheat';
import { PowerupType } from '../model/PowerupType';
import MapDisplay from '../scenes/MapDisplay';
import KeyCombo = Phaser.Input.Keyboard.KeyCombo;

export default class CheatManager {
  private cheats: Cheat[];

  constructor() {
    this.cheats = [
      new Cheat('MPZAX', false, (scene) => scene.hud.textOut('Zax37 is programming God too!')),
      new Cheat('MPFPS', false, (scene) => scene.hud.showFPS = true),
      new Cheat('MPFREAK', true, (scene) => scene.claw.addPowerup(PowerupType.CATNIP, 15000)),
      new Cheat('MPHOTSTUFF', true, (scene) => scene.claw.addPowerup(PowerupType.FIRESWORD, 30000)),
      new Cheat('MPCASPER', true, (scene) => scene.claw.addPowerup(PowerupType.INVISIBILITY, 15000)),
      new Cheat('MPFLY', true, (scene) => scene.claw.setFly(!scene.claw.fly)),
      new Cheat('MPBACK', true, (scene) => scene.claw.backToSpawn()),
      new Cheat('MPEXACTLY', true, (scene) => scene.game.startLevel(2)),
      new Cheat('MPSKINNER', true, (scene) => {
        const nearEndPosition = scene.getLevelData().NearEndPosition;
        if (nearEndPosition) {
          scene.claw.teleportTo(nearEndPosition.x, nearEndPosition.y);
        }
      }),
    ];
  }

  registerCheats(scene: MapDisplay) {
    this.cheats.forEach((cheat) => scene.input.keyboard.createCombo(cheat.getCombo(),
      { maxKeyDelay: 2000, resetOnMatch: true }).trigger = cheat.trigger.bind(cheat, scene));

    scene.input.keyboard.on('keycombomatch', (keyCombo: KeyCombo) => keyCombo.trigger());
  }
}
