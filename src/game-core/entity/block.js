import * as PIXI from 'pixi.js';
import { boardRectSize, boardGapSize, GapDirect, boardRow, boardCol, ColorEnum } from '../const-value';

/**
 * 如果格子数量为 a
 * 则实际索引为 b = a - 1
 * 真正的边界为实际边界索引数量 c = b - 2
 * 所以真正边界的索引为 r = a - 3
 * 即索引偏移为固定值 3
 */
const CurrentEdgeIndexOffset = 3;
// 绘制 Block 的坐标浮动，避免绘制出来的 block 严丝合缝
const PosOffset = 3;
class Block extends PIXI.Graphics {
    boardInstance;
    virtualBlock;
    block;
    constructor(boardInstance) {
        super();
        this.boardInstance = boardInstance;
        this.init();
    }

    init() {
        this.virtualBlock = new PIXI.Graphics();
        this.block = new PIXI.Graphics();
    }

    /**
     * 绘制虚拟block
     * @param {*} indexX
     * @param {*} indexY
     * @param {*} direct
     */
    drawVirtualBlock(indexX, indexY, direct) {
        const { x, y, isHitWithExistBlocks } = this.getCurrentBlockInfo(indexX, indexY, direct);
        // 判断当前所影响的gap里面是否已经存在被绘制的内容，给予不同颜色
        const color = isHitWithExistBlocks ? ColorEnum.invalidBlockColor : ColorEnum.blockColor;
        this.drawBlock(this.virtualBlock, x, y, direct, 0.3, color);
    }

    /**
     * 绘制实际block
     * @param {*} indexX
     * @param {*} indexY
     * @param {*} direct
     */
    generateBlock(indexX, indexY, direct, successCb = () => {}, errorCb = () => {}) {
        const { x, y, isHitWithExistBlocks, effectGaps } = this.getCurrentBlockInfo(indexX, indexY, direct);
        if (isHitWithExistBlocks) {
            errorCb();
            return;
        }

        this.clearVirtualBlock();
        effectGaps.forEach(gap => {
            // 处理当前 gap 的 block 操作
            gap?.doBlock?.();
            // 更新grid
            this.boardInstance.grid.setBlock(gap.indexX, gap.indexY);
        });
        this.drawBlock(this.block, x, y, direct);
        successCb();
    }

    clearVirtualBlock() {
        this.virtualBlock.clear();
    }

    /**
     * 获取真正的绘制起点信息
     * @param {*} indexX
     * @param {*} indexY
     * @param {*} direct
     * @param {*} getSideEffect
     */
    getCurrentBlockInfo(indexX, indexY, direct) {
        const info = {};
        if (direct === GapDirect.horizontal) {
            info.x = Math.min(indexX, boardCol - CurrentEdgeIndexOffset);
            info.y = indexY;
        } else {
            info.x = indexX;
            info.y = Math.min(indexY, boardRow - CurrentEdgeIndexOffset);
        }
        info.effectGaps = this.getEffectGaps(info.x, info.y, direct);
        info.isHitWithExistBlocks = this.getHitWithExistBlocks(info.effectGaps);
        return info;
    }

    /**
     * 计算与已存在block的交叠情况
     *
     * @param {*} indexX
     * @param {*} indexY
     * @param {*} direct
     */
    getHitWithExistBlocks(effectGaps) {
        const isHit = effectGaps.some(gap => {
            return gap.blocked;
        });
        return isHit;
    }

    /**
     * 获取被影响gap的二位数坐标
     * @param {*} indexX
     * @param {*} indexY
     * @param {*} direct
     */
    getEffectGaps(indexX, indexY, direct) {
        const effectBlocksIndexArr = [];
        if (direct === GapDirect.horizontal) {
            effectBlocksIndexArr.push(
                this.boardInstance.getElementByPos(indexX, indexY),
                this.boardInstance.getElementByPos(indexX + 1, indexY),
                this.boardInstance.getElementByPos(indexX + 2, indexY)
            );
        } else {
            effectBlocksIndexArr.push(
                this.boardInstance.getElementByPos(indexX, indexY),
                this.boardInstance.getElementByPos(indexX, indexY + 1),
                this.boardInstance.getElementByPos(indexX, indexY + 2)
            );
        }
        return effectBlocksIndexArr;
    }

    drawBlock(graphics, indexX, indexY, direct, a = 1, color = ColorEnum.blockColor) {
        // TODO debug 为了查看绘制block的函数是否调用（绘制实际block的情况下）
        if (a === 1) {
            console.log('🚀 ~ Block ~ drawBlock ~ drawBlock:');
        }

        const currentElement = this.boardInstance.getElementByPos(indexX, indexY);
        // TODO 优化：绘制的block可以看起来再 ‘薄’ 一点
        const currentX = direct === GapDirect.horizontal ? currentElement.x + PosOffset : currentElement.x;
        const currentY = direct === GapDirect.horizontal ? currentElement.y : currentElement.y + PosOffset;
        const width = direct === GapDirect.horizontal ? (boardRectSize - PosOffset) * 2 + boardGapSize : boardGapSize;
        const height = direct === GapDirect.horizontal ? boardGapSize : (boardRectSize - PosOffset) * 2 + boardGapSize;
        graphics.lineStyle(1, color, 1);
        graphics.beginFill(color, a);
        graphics.drawRect(currentX, currentY, width, height);
        graphics.endFill();
    }
}

export default Block;
