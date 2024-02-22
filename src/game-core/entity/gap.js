import * as PIXI from 'pixi.js';
import { boardRectSize, boardGapSize, GapDirect, ColorEnum, ElementTypeEnum } from '../const-value';

class Gap extends PIXI.Graphics {
    constructor(x, y, direct) {
        super();
        this.beginFill(ColorEnum.boardGapColor);
        const width = direct === GapDirect.vertical ? boardGapSize : boardRectSize;
        const height = direct === GapDirect.vertical ? boardRectSize : boardGapSize;
        this.drawRect(0, 0, width, height);
        this.endFill();
        this.x = x;
        this.y = y;
        this.elementType = ElementTypeEnum.gap;
        this.gapDirect = direct;
    }
}

export default Gap;
