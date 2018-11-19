import Game from "../game";

export default class MusicManager {
  private music: Phaser.Sound.BaseSound;
  private volume: number;

  constructor(private game: Game) {
    this.volume = parseFloat(game.dataManager.get('musicVolume') || '1.0');
  }

  play(music: Phaser.Sound.BaseSound) {
    if (this.music) {
      this.music.stop();
    }

    this.music = music;
    this.music.play('', { loop: true, volume: this.volume })
  }
}