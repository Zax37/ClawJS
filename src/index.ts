import 'phaser';

import { config } from './config';
import Game from './game';

/*function checkHash() {
  if (window.location.hash && window.location.hash.startsWith('#RETAIL')) {
    const level = Number.parseInt(window.location.hash.match(/([^0-9]*)([0-9]*).*$/)![2], 0);
    if (level >= 1 && level <= 15) {
      game.startLevel(level, true);
    } else {
      console.error('Level ' + level + ' does not exist.');
    }
  } else {
    game.goToMainMenu();
  }
}*/

const game = new Game(config);

//window.onload = checkHash;
//window.onhashchange = checkHash;
