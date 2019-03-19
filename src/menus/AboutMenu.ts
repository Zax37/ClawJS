import { ChangelogWindow } from '../logics/menu/ChangelogWindow';
import { CreditsWindow } from '../logics/menu/CreditsWindow';
import { SupportersWindow } from '../logics/menu/SupportersWindow';
import { MenuScene, MenuSceneState } from '../scenes/MenuScene';
import { Menu } from './Menu';

export class AboutMenu extends Menu {
  constructor(protected scene: MenuScene, parent: Menu) {
    super(scene, 'ABOUT', ['CLAWJS AUTHOR', 'THE SUPPORTERS', 'ORIGINAL CREDITS', 'DEFAULT CONTROLS', 'CHANGELOG', 'BACK'], undefined, parent);
  }

  confirm(i: number) {
    switch (i) {
      case 0:
        this.hide();
        this.scene.setState(MenuSceneState.CREDITS);
        break;
      case 1:
        this.scene.openPopup(new SupportersWindow(this.scene));
        break;
      case 2:
        this.scene.openPopup(new CreditsWindow(this.scene));
        break;
      case 3:
        this.hide();
        this.scene.setState(MenuSceneState.HELP);
        break;
      case 4:
        this.scene.openPopup(new ChangelogWindow(this.scene));
        break;
      case 5:
        this.back();
        break;
      default:
        break;
    }
  }
}
