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
    gapDirect;
    indexX;
    indexY;
    virtualBlockGraphics;
    constructor(posX, posY, direct, indexX, indexY) {
        super();
        this.render();
        this.x = posX;
        this.y = posY;
        this.indexX = indexX;
        this.indexY = indexY;
        this.elementType = ElementTypeEnum.gap;
        this.gapDirect = direct;
        this.virtualBlockGraphics = new PIXI.Graphics();
        this.addChild(this.virtualBlockGraphics);
        this.init();
    }
    init() {
        this.beginFill(sizeMap[this.gapDirect].color);
        const width = sizeMap[this.gapDirect].width;
        const height = sizeMap[this.gapDirect].height;
        this.drawRect(0, 0, width, height);
        this.endFill();

        if (this.gapDirect !== GapDirect.none) {
            this.cursor = 'pointer';
            this.eventMode = 'static';
            this.on('pointerover', this.hoverHandler, this);
        }
    }
    hoverHandler() {
        this.off('pointerover', this.hoverHandler, this);
        this.on('pointerleave', this.leaveHandler, this);
        this.virtualBlockGraphics.lineStyle(2, 0xffffff, 1);
        this.virtualBlockGraphics.moveTo(0, 0);
        const width = this.gapDirect === GapDirect.horizontal ? boardRectSize * 2 + boardGapSize : boardGapSize;
        const height = this.gapDirect === GapDirect.horizontal ? boardGapSize : boardRectSize * 2 + boardGapSize;
        this.virtualBlockGraphics.drawRect(0, 0, width, height);
        this.virtualBlockGraphics.endFill();
    }
    leaveHandler() {
        this.off('pointerleave', this.leaveHandler, this);
        this.on('pointerover', this.hoverHandler, this);
        this.virtualBlockGraphics.clear();
    }
}

export default Gap;
