import { Cheat } from '../model/Cheat';
import { PowerupType } from '../model/PowerupType';
import { MapDisplay } from '../scenes/MapDisplay';

export class CheatManager {
  private cheats: Cheat[];

  constructor() {
    this.cheats = [
      new Cheat('MPZAX', false, (scene) => scene.hud.textOut('Zax37 is programming God too!')),
      new Cheat('MPFPS', false, (scene) => scene.hud.showFPS = true),
      new Cheat('MPFREAK', true, (scene) => {
        scene.claw.addPowerup(PowerupType.CATNIP, 30000);
        scene.hud.textOut('Catnip...Yummy!');
      }),
      new Cheat('MPHOTSTUFF', true, (scene) => {
        scene.claw.addPowerup(PowerupType.FIRESWORD, 20000);
        scene.hud.textOut('Fire sword rules...');
      }),
      new Cheat('MPCASPER', true, (scene) => {
        scene.claw.addPowerup(PowerupType.INVISIBILITY, 30000);
        scene.hud.textOut('Now you see me...now you dont!');
      }),
      new Cheat('MPFLY', true, (scene) => {
        scene.claw.setFly(!scene.claw.fly);
        if (scene.claw.fly) {
          scene.hud.textOut('Fly Mode On');
        } else {
          scene.hud.textOut('Fly Mode Off');
        }
      }),
      new Cheat('MPBACK', true, (scene) => {
        scene.claw.backToSpawn();
        scene.hud.textOut('Lets try that again...');
      }),
      new Cheat('MPCHEESESAUCE', true, (scene) => scene.game.startLevel(1)),
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

    scene.input.keyboard.on('keycombomatch', (keyCombo: Phaser.Input.Keyboard.KeyCombo) => keyCombo.trigger());
  }
}
