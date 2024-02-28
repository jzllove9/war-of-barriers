import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { boardRectSize } from '../const-value';

class Role extends PIXI.Sprite {
    cntr;
    player;
    boardEntity;
    constructor(container, player, boardEntity) {
        const img = player.getImage();
        const texture = PIXI.Texture.from(img);
        super(texture);
        this.scale = new PIXI.Point(0.2, 0.2);
        this.cntr = container;
        this.player = player;
        this.boardEntity = boardEntity;
        this.anchor.set(0.5);
        this.cntr.addChild(this);

        this.init();
    }
    init() {
        const currentRect = this.boardEntity.getElementByPos(this.player.x, this.player.y);
        currentRect.fillByRole = true;
        const position = currentRect.position;
        this.position.set(position.x + boardRectSize * 0.5, position.y + boardRectSize * 0.5);
    }
    move(position) {
        return new Promise(resolve => {
            const tween = new TWEEN.Tween(this.position);
            tween
                .to(
                    {
                        x: position.x + boardRectSize * 0.5,
                        y: position.y + boardRectSize * 0.5,
                    },
                    200
                )
                .start()
                .onComplete(() => {
                    resolve();
                });
        });
    }
    toggleSelected(isOpen) {
        if (isOpen) {
            // this.scaleTween.start();
        } else {
            // this.scaleTween.stop();
        }
    }
}

export default Role;
