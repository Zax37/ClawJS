declare module 'phaser3-rex-plugins' {
  export class BBCodeTextPlugin extends Phaser.Plugins.BasePlugin {
  }
}

declare namespace Phaser.GameObjects {
  export class BBCodeText extends Phaser.GameObjects.Text {
    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: object);
  }

  interface GameObjectFactory {
    rexBBCodeText(x: number, y: number, text: string, style: object): BBCodeText;
  }

  interface GameObjectCreator {
    rexBBCodeText(config: object, addToScene: Function): BBCodeText;
  }
}
