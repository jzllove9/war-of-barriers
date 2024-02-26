import * as PIXI from 'pixi.js';
import { boardRectSize } from '../const-value';

class Role extends PIXI.Sprite {
    container;
    player;
    boardEntity;
    texture;
    constructor(container, player, boardEntity) {
        const img = player.getImage();
        const texture = PIXI.Texture.from(img);

        super(texture);
        this.texture = texture;
        this.container = container;
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
        this.container.addChild(this);
    }
    async updatePath() {
        await this.player.calcAStarPath();
    }
}

export default Role;
