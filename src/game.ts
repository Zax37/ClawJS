import { AnimationManager } from './managers/AnimationManager';
import { CheatManager } from './managers/CheatManager';
import { DataManager } from './managers/DataManager';
import { MusicManager } from './managers/MusicManager';
import { SoundsManager } from './managers/SoundsManager';
import { TreasureRegistry } from './managers/TreasureRegistry';
import { BootyScene } from './scenes/BootyScene';
import { GameHUD } from './scenes/GameHUD';
import { MapDisplay } from './scenes/MapDisplay';
import { MenuScene } from './scenes/MenuScene';

enum GameState {
  InMenu,
  InGame,
  BootyScreen,
}

export class Game extends Phaser.Game {
  private state = GameState.InMenu;
  private retailLevelNumber: number;
  animationManager = new AnimationManager(this);
  cheatManager = new CheatManager();
  dataManager = new DataManager();
  musicManager = new MusicManager(this);
  soundsManager = new SoundsManager(this);
  treasureRegistry = new TreasureRegistry();

  constructor(config: GameConfig) {
    super(config);
  }

  async stopCurrentScenes() {
    const keys: string[] = [];

    switch (this.state) {
      default:
      case GameState.InMenu:
        keys.push(MenuScene.key);
        break;
      case GameState.InGame:
        this.soundsManager.clearAmbients();
        keys.push(MapDisplay.key);
        keys.push(GameHUD.key);
        break;
      case GameState.BootyScreen:
        keys.push(BootyScene.key);
        break;
    }

    await Promise.all(keys.map(key => new Promise((resolve) =>
      this.scene.getScene(key).events.once('postupdate', () => {
          this.scene.stop(key);
          resolve();
        },
      ))));
  }

  async goToMainMenu() {
    if (this.state === GameState.InMenu) return;
    this.stopCurrentScenes().then(() => this.scene.start(MenuScene.key));
    this.state = GameState.InMenu;
    //history.pushState(null, 'ClawJS MenuScene', '.');
  }

  async startLevel(level: number, replaceState?: boolean) {
    this.stopCurrentScenes().then(() => {
      this.scene.start(MapDisplay.key, level);
      this.scene.start(GameHUD.key, level);
    });
    this.state = GameState.InGame;
    /*if (replaceState) {
      history.replaceState(null, 'ClawJS Level ' + level, '#RETAIL' + level);
    } else {
      history.pushState(null, 'ClawJS Level ' + level, '#RETAIL' + level);
    }*/
    this.retailLevelNumber = level;
  }

  goToBootyScreen() {
    if (this.state !== GameState.InGame) return;
    this.stopCurrentScenes().then(() => this.scene.start(BootyScene.key, this.retailLevelNumber));
    this.state = GameState.BootyScreen;
  }
}
