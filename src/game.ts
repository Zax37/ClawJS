import Menu from "./scenes/Menu";
import MapDisplay from "./scenes/MapDisplay";
import MusicManager from "./managers/music";
import AnimationManager from "./managers/animation";

enum GameState {
  InMenu,
  InGame,
}

export default class Game extends Phaser.Game {
  private state = GameState.InMenu;
  animationManager = new AnimationManager(this);
  musicManager = new MusicManager();

  constructor (config: GameConfig) {
    super(config);
  }

  async stopCurrentScene() {
    let key: string;

    switch (this.state) {
      case GameState.InMenu:
        key = Menu.key;
        break;
      case GameState.InGame:
        key = MapDisplay.key;
        break;
    }

    await new Promise((resolve) =>
      this.scene.getScene(key).events.once('postupdate', () => {
        this.scene.stop(key);
        resolve();
      }
    ));
  }

  async goToMainMenu() {
    if (this.state == GameState.InMenu) return;
    this.stopCurrentScene().then(() => this.scene.start(Menu.key));
    this.state = GameState.InMenu;
    history.pushState(null, 'ClawJS Menu', '.');
  }

  async startLevel(level: number, replaceState?: boolean) {
    this.stopCurrentScene().then(() => this.scene.start(MapDisplay.key, level));
    this.state = GameState.InGame;
    if (replaceState) {
      history.replaceState(null, 'ClawJS Level ' + level, '#RETAIL' + level);
    } else {
      history.pushState(null, 'ClawJS Level ' + level, '#RETAIL' + level);
    }
  }
}