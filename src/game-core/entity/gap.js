import * as PIXI from 'pixi.js';
import { boardRectSize, boardGapSize, GapDirect, ColorEnum, ElementTypeEnum } from '../const-value';

const sizeMap = {
    [GapDirect.horizontal]: {
        height: boardGapSize,
        width: boardRectSize,
        color: ColorEnum.boardGapColor,
    },
    [GapDirect.vertical]: {
        height: boardRectSize,
        width: boardGapSize,
        color: ColorEnum.boardGapColor,
    },
    [GapDirect.none]: {
        height: boardGapSize,
        width: boardGapSize,
        color: ColorEnum.boardGapColor2,
    },
};
class Gap extends PIXI.Graphics {
    // 该间隙是否已被填充
    blocked = false;
    constructor(x, y, direct) {
        super();
        this.beginFill(sizeMap[direct].color);
        const width = sizeMap[direct].width;
        const height = sizeMap[direct].height;
        this.drawRect(0, 0, width, height);
        this.endFill();
        this.x = x;
        this.y = y;
        this.elementType = ElementTypeEnum.gap;
        this.gapDirect = direct;
    }
}

export default Gap;
