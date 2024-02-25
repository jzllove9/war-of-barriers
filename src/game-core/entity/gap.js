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
    blockEntity;
    constructor(posX, posY, direct, indexX, indexY, blockEntity) {
        super();
        this.render();
        this.x = posX;
        this.y = posY;
        this.indexX = indexX;
        this.indexY = indexY;
        this.elementType = ElementTypeEnum.gap;
        this.gapDirect = direct;
        this.blockEntity = blockEntity;
        this.init();
    }
    init() {
        this.beginFill(sizeMap[this.gapDirect].color);
        const width = sizeMap[this.gapDirect].width;
        const height = sizeMap[this.gapDirect].height;
        this.drawRect(0, 0, width, height);
        this.endFill();

        if (this.gapDirect !== GapDirect.none || this.blockEntity) {
            this.cursor = 'pointer';
            this.eventMode = 'static';
            this.on('pointerover', this.hoverHandler, this);
        }
    }
    hoverHandler() {
        this.off('pointerover', this.hoverHandler, this);
        this.on('pointerleave', this.leaveHandler, this);
        this.on('click', this.clickHandler, this)
        this.blockEntity.drawVirtualBlock(this.indexX, this.indexY, this.gapDirect)
    }
    leaveHandler() {
        this.off('pointerleave', this.leaveHandler, this);
        this.off('click', this.clickHandler, this)
        this.on('pointerover', this.hoverHandler, this);
        this.blockEntity.clearVirtualBlock();
    }
    clickHandler() {
        this.blockEntity.drawBlock(this.indexX, this.indexY, this.gapDirect)
    }
    removeInteraction() {
        this.off('pointerover', this.hoverHandler, this);
        this.off('pointerleave', this.leaveHandler, this);
        this.off('click', this.clickHandler, this)
        this.cursor = 'none';
        this.eventMode = 'none'
        this.blockEntity?.clearVirtualBlock();
    }
}

export default Gap;
