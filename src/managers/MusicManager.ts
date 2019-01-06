import Game from '../game';

export default class MusicManager {
  private music: Phaser.Sound.BaseSound;
  private pausedMusic: Phaser.Sound.BaseSound;
  private volume: number;

  constructor(private game: Game) {
    this.volume = parseFloat(game.dataManager.get('musicVolume') || '1.0');
  }

  play(music: Phaser.Sound.BaseSound) {
    if (this.music) {
      this.music.stop();
    }

    this.music = music;
    this.music.play('', { loop: true, volume: this.volume });
  }

  playPausingCurrent(music: Phaser.Sound.BaseSound) {
    if (this.music.pause()) {
      this.pausedMusic = this.music;
      this.music = music;
      this.music.play('', { loop: true, volume: this.volume });
    }
  }

  resumePaused() {
    if (this.music) {
      this.music.stop();
    }

    this.music = this.pausedMusic;

    if (this.music) {
      this.music.resume();
    }
  }
}