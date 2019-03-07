import CaptainClaw from '../logics/main/CaptainClaw';

export default class DataManager {
  private playerData?: CaptainClaw;

  get(key: string) {
    return localStorage.getItem(key);
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getPlayerData() {
    return this.playerData;
  }

  setPlayerData(playerData?: CaptainClaw) {
    this.playerData = playerData;
  }
}
