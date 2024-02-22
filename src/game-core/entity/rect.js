import * as PIXI from 'pixi.js';
import { boardRectSize, boardGapSize, boardRow, boardCol, GapDirect, ColorEnum, ElementTypeEnum } from '../const-value';

class Rect extends PIXI.Graphics {
    constructor(x, y) {
        super();
        this.beginFill(ColorEnum.boardRectColor);
        this.drawRect(x, y, boardRectSize, boardRectSize);
        this.endFill();
        this.elementType = ElementTypeEnum.rect;
    }
}

export default Rect;
