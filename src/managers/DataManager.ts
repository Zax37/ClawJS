import { PlayerDataContainer, PlayerDataInterface } from '../model/PlayerData';

export default class DataManager {
  private playerData: PlayerDataContainer;

  get(key: string) {
    return localStorage.getItem(key);
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getPlayerData() {
    return this.playerData;
  }

  setPlayerData(playerData: PlayerDataInterface) {
    this.playerData = new PlayerDataContainer(playerData);
  }
}
