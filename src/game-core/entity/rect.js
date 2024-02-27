import * as PIXI from 'pixi.js';
import { boardRectSize, ColorEnum, ElementTypeEnum } from '../const-value';

class Rect extends PIXI.Graphics {
    // 该方格内是否有角色
    fillByRole = false;
    constructor(x, y) {
        super();
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
    }
    /**
     * 关闭交互
     */
    doCloseInteractive() {
        this.drawByColor(this.x, this.y);
        this.cursor = 'none';
        this.eventMode = 'none';
    }
}

export default Rect;
