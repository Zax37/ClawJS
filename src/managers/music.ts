export default class MusicManager {
  private music: Phaser.Sound.BaseSound;

  play(music: Phaser.Sound.BaseSound) {
    if (this.music) {
      this.music.stop();
    }

    this.music = music;
    this.music.play('', { loop: true, volume: 0.5 })
  }
}