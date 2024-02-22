import * as PIXI from 'pixi.js';
import { boardRectSize, ColorEnum, ElementTypeEnum } from '../const-value';

class Rect extends PIXI.Graphics {
    constructor(x, y) {
        super();
        this.beginFill(ColorEnum.boardRectColor);
        this.drawRect(0, 0, boardRectSize, boardRectSize);
        this.endFill();
        this.x = x;
        this.y = y;
        this.elementType = ElementTypeEnum.rect;
    }
}

export default Rect;
