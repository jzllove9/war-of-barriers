import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import { boardRectSize, ColorEnum, ElementTypeEnum } from '../const-value';

class Rect extends PIXI.Graphics {
    // 该方格内是否有角色
    fillByRole = false;
    boardInstance;
    indexX;
    indexY;
    constructor(x, y, indexX, indexY, boardInstance) {
        super();
        this.boardInstance = boardInstance;
        this.indexX = indexX;
        this.indexY = indexY;
        this.drawByColor(x, y);

        const tweenA = new TWEEN.Tween(this).to(
            {
                alpha: 0.8,
            },
            500
        );
        const tweenB = new TWEEN.Tween(this).to(
            {
                alpha: 1,
            },
            500
        );
        tweenA.chain(tweenB);
        tweenB.chain(tweenA);

        this.alphaTween = tweenA.easing(TWEEN.Easing.Linear.None);
    }
    drawByColor(x, y, color = ColorEnum.boardRectColor, alpha = 1) {
        this.clear();
        this.beginFill(color, alpha);
        this.drawRect(0, 0, boardRectSize, boardRectSize);
        this.endFill();
        this.x = x;
        this.y = y;
        this.elementType = ElementTypeEnum.rect;
    }
    /**
     * 开启交互
     */
    doOpenInteractive(gridColor) {
        this.alphaTween.start();
        this.drawByColor(this.x, this.y, gridColor, 0.7);
        this.cursor = 'pointer';
        this.eventMode = 'static';
        this.on('click', this.clickHandler, this);
    }
    /**
     * 关闭交互
     */
    doCloseInteractive() {
        this.alphaTween.stop();
        this.drawByColor(this.x, this.y);
        this.cursor = 'none';
        this.eventMode = 'none';
        this.off('click', this.clickHandler, this);
    }
    clickHandler() {
        this.boardInstance.emit('onRectClick', {
            indexPos: { x: this.indexX, y: this.indexY },
            position: this.position,
        });
    }
}

export default Rect;
