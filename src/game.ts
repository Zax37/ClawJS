import Menu from "./scenes/Menu";
import MapDisplay from "./scenes/MapDisplay";
import MusicManager from "./managers/MusicManager";
import AnimationManager from "./managers/AnimationManager";
import DataManager from "./managers/DataManager";
import TreasureRegistry from "./managers/TreasureRegistry";
import Booty from "./scenes/Booty";
import GameHUD from "./scenes/GameHUD";
import CheatManager from "./managers/CheatManager";

enum GameState {
  InMenu,
  InGame,
  BootyScreen,
}

export default class Game extends Phaser.Game {
  private state = GameState.InMenu;
  private retailLevelNumber: number;
  animationManager = new AnimationManager(this);
  cheatManager = new CheatManager();
  dataManager = new DataManager();
  musicManager = new MusicManager(this);
  treasureRegistry = new TreasureRegistry();

  constructor (config: GameConfig) {
    super(config);
  }

  async stopCurrentScenes() {
    let keys: string[] = [];

    switch (this.state) {
      case GameState.InMenu:
        keys.push(Menu.key);
        break;
      case GameState.InGame:
        keys.push(MapDisplay.key);
        keys.push(GameHUD.key);
        break;
      case GameState.BootyScreen:
        keys.push(Booty.key);
        break;
    }

    await Promise.all(keys.map(key => new Promise((resolve) =>
      this.scene.getScene(key).events.once('postupdate', () => {
        this.scene.stop(key);
        resolve();
      }
    ))));
  }

  async goToMainMenu() {
    if (this.state === GameState.InMenu) return;
    this.stopCurrentScenes().then(() => this.scene.start(Menu.key));
    this.state = GameState.InMenu;
    history.pushState(null, 'ClawJS Menu', '.');
  }

  async startLevel(level: number, replaceState?: boolean) {
    this.stopCurrentScenes().then(() => {
      this.scene.start(MapDisplay.key, level);
      this.scene.start(GameHUD.key, level);
    });
    this.state = GameState.InGame;
    if (replaceState) {
      history.replaceState(null, 'ClawJS Level ' + level, '#RETAIL' + level);
    } else {
      history.pushState(null, 'ClawJS Level ' + level, '#RETAIL' + level);
    }
    this.retailLevelNumber = level;
  }

  goToBootyScreen() {
    if (this.state !== GameState.InGame) return;
    this.stopCurrentScenes().then(() => this.scene.start(Booty.key, this.retailLevelNumber));
    this.state = GameState.BootyScreen;
  }
}