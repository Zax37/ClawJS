import Game from '../game';

export default class SoundsManager {
  private scene: Phaser.Scene;

  private soundsVolume: number;
  private vocalsVolume: number;
  private ambientVolume: number;

  constructor(private game: Game) {
    this.soundsVolume = Number.parseFloat(game.dataManager.get('soundsVolume') || '1.0');
    this.vocalsVolume = Number.parseFloat(game.dataManager.get('vocalsVolume') || '1.0');
    this.ambientVolume = Number.parseFloat(game.dataManager.get('ambientVolume') || '1.0');
  }

  setScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  playSound(name: string, config?: SoundConfig) {
    const soundsSprite = this.scene.sound.addAudioSprite('sounds');
    soundsSprite.play(name, { volume: this.soundsVolume, ...config });
    return soundsSprite;
  }

  playVocal(name: string, config?: SoundConfig) {
    const vocalsSprite = this.scene.sound.addAudioSprite('voc');
    vocalsSprite.play(name, { volume: this.vocalsVolume, ...config });
    return vocalsSprite;
  }

  playAmbient(name: string, config?: SoundConfig) {
    console.log('playing '+name+', '+config!.volume);
    const soundsSprite = this.scene.sound.addAudioSprite('sounds');
    soundsSprite.play(name, { ...config, volume: config && config.volume ? config.volume * this.ambientVolume / 100 : this.ambientVolume, loop: true });
    return soundsSprite;
  }

  getSoundsVolume() {
    return this.soundsVolume;
  }

  getVocalsVolume() {
    return this.vocalsVolume;
  }

  getAmbientVolume() {
    return this.ambientVolume;
  }

  setSoundsVolume(volume: number) {
    this.soundsVolume = volume;
    this.game.dataManager.set('soundsVolume', volume.toString());
  }

  setVocalsVolume(volume: number) {
    this.vocalsVolume = volume;
    this.game.dataManager.set('vocalsVolume', volume.toString());
  }

  setAmbientVolume(volume: number) {
    this.ambientVolume = volume;
    this.game.dataManager.set('ambientVolume', volume.toString());
  }
}
