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
    boardInstance;
    constructor(posX, posY, direct, indexX, indexY, boardInstance) {
        super();
        this.render();
        this.x = posX;
        this.y = posY;
        this.indexX = indexX;
        this.indexY = indexY;
        this.elementType = ElementTypeEnum.gap;
        this.gapDirect = direct;
        this.boardInstance = boardInstance;
        this.init();
    }
    init() {
        this.beginFill(sizeMap[this.gapDirect].color);
        const width = sizeMap[this.gapDirect].width;
        const height = sizeMap[this.gapDirect].height;
        this.drawRect(0, 0, width, height);
        this.endFill();
    }
    hoverHandler() {
        this.off('pointerover', this.hoverHandler, this);
        this.on('pointerleave', this.leaveHandler, this);
        this.on('click', this.clickHandler, this);
        this.boardInstance?.emit('onGapHover', {
            x: this.indexX,
            y: this.indexY,
            d: this.gapDirect,
        });
    }
    leaveHandler() {
        this.off('pointerleave', this.leaveHandler, this);
        this.off('click', this.clickHandler, this);
        this.on('pointerover', this.hoverHandler, this);
        this.boardInstance?.emit('onGapLeave', {
            x: this.indexX,
            y: this.indexY,
            d: this.gapDirect,
        });
    }
    clickHandler() {
        this.boardInstance?.emit('onGapClick', {
            x: this.indexX,
            y: this.indexY,
            d: this.gapDirect,
        });
    }
    /**
     * 开启交互
     */
    doOpenInteractive() {
        if (this.gapDirect !== GapDirect.none && !this.blocked) {
            this.cursor = 'pointer';
            this.eventMode = 'static';
            this.on('pointerover', this.hoverHandler, this);
        }
    }
    /**
     * 关闭交互
     */
    doCloseInteractive() {
        this.cursor = 'none';
        this.eventMode = 'none';
    }
    doBlock() {
        this.blocked = true;
        this.off('pointerover', this.hoverHandler, this);
        this.off('pointerleave', this.leaveHandler, this);
        this.off('click', this.clickHandler, this);
        this.doCloseInteractive();
    }
}

export default Gap;
