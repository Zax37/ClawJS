import { NineSlice } from 'phaser3-nineslice';
import { MenuScene } from '../../scenes/MenuScene';
import { TextWindow } from '../abstract/TextWindow';
import c from '../../../resources/credits.json';

export class CreditsWindow extends TextWindow {
  constructor(scene: MenuScene) {
    super(scene, c.text);
  }
}
