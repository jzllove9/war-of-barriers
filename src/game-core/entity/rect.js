import * as PIXI from 'pixi.js';
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
    }
    drawByColor(x, y, color = ColorEnum.boardRectColor) {
        this.clear();
        this.beginFill(color);
        this.drawRect(0, 0, boardRectSize, boardRectSize);
        this.endFill();
        this.x = x;
        this.y = y;
        this.elementType = ElementTypeEnum.rect;
    }
    /**
     * 开启交互
     */
    doOpenInteractive() {
        this.drawByColor(this.x, this.y, ColorEnum.boardRectHighlightColor);
        this.cursor = 'pointer';
        this.eventMode = 'static';
        this.on('click', this.clickHandler, this);
    }
    /**
     * 关闭交互
     */
    doCloseInteractive() {
        this.drawByColor(this.x, this.y);
        this.cursor = 'none';
        this.eventMode = 'none';
        this.off('click', this.clickHandler, this);
    }
    clickHandler() {
        this.boardInstance.emit('onRectClick', {
            // TODO 此处计算的可能有错误
            indexPos: { x: this.indexX, y: this.indexY },
            position: this.position,
        });
    }
}

export default Rect;
