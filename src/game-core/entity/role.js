import * as PIXI from 'pixi.js';
import { boardRectSize } from '../const-value';

class Role extends PIXI.Sprite {
    app;
    player;
    boardEntity;
    texture;
    constructor(app, player, boardEntity) {
        const img = player.getImage();
        const texture = PIXI.Texture.from(img);

        super(texture);
        this.texture = texture;
        this.app = app;
        this.player = player;
        this.boardEntity = boardEntity;
    }
    async init() {
        this.width = boardRectSize;
        this.height = boardRectSize;
        await this.updatePath();
        const currentRect = this.boardEntity.getElementByPos(this.player.x, this.player.y);
        currentRect.fillByRole = true;
        const position = currentRect.position;
        this.position.set(position.x, position.y);
        this.app.stage.addChild(this);
    }
    async updatePath() {
        await this.player.calcAStarPath();
    }
}

export default Role;
