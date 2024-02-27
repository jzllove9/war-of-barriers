import Blocks from './blocks';
import { boardCol } from '@/game-core/const-value';
class Player {
    x;
    y;
    targetX;
    targetY;
    aStarPaths;
    name;
    grid;
    image;
    blocks;
    enemyPlayer;
    validRects = [];
    constructor({ x, y, targetY, grid, name, image }) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.aStarPath = [];
        this.grid = grid;
        this.name = name;
        this.image = image;
        this.blocks = new Blocks();
    }
    async init(enemy) {
        this.enemyPlayer = enemy;
        await this.nextTurn();
    }
    getImage() {
        return this.image;
    }
    getPaths() {
        return this.aStarPaths;
    }
    getValidRects() {
        return this.validRects;
    }
    move(x, y, cb) {
        this.x = x;
        this.y = y;
        cb(x, y);
    }
    async nextTurn() {
        await this.calcAStarPath();
        this.calcAllValidGrid();
    }
    async calcAStarPath() {
        const resPathArr = [];
        for (let i = 0; i < boardCol; i++) {
            if (i % 2 === 0) {
                const path = await this.grid.calcPath(this.x, this.y, i, this.targetY);
                if (path) {
                    resPathArr.push(path);
                }
            }
        }

        this.aStarPaths = resPathArr;
    }
    /**
     * 获取从当前位置出发，所有可行的进格子
     */
    calcAllValidGrid() {
        const existRoundedA = this.getExistRoundedRectAndGap(this.x, this.y);
        const walkableRoundedA = this.getWalkableRoundedRect(existRoundedA);
        if (!walkableRoundedA?.length) return;

        // 遍历 walkableTargetArrA 中的每个元素是否存在和对手坐标交叉的情况，如果没有则略过
        let crossB = undefined;
        const remainWalkableRoundedA = [];
        for (let i = 0; i < walkableRoundedA.length; i++) {
            const temp = walkableRoundedA[i];
            if (temp.x === this.enemyPlayer.x && temp.y === this.enemyPlayer.y) {
                crossB = temp;
            } else {
                remainWalkableRoundedA.push(temp);
            }
        }
        if (!crossB) {
            this.validRects = remainWalkableRoundedA;
            return;
        }

        // 获取对手坐标位置周围可到达rect并过滤掉包含当前玩家位置的格子
        const existRoundedB = this.getExistRoundedRectAndGap(crossB.x, crossB.y);
        const _tempWalkableRoundB = this.getWalkableRoundedRect(existRoundedB);
        const walkableRoundB = _tempWalkableRoundB.filter(item => item.x !== this.x || item.y !== this.y);
        if (!walkableRoundB?.length) {
            this.validRects = remainWalkableRoundedA;
            return;
        }

        /**
         * 判断敌对玩家背后的格子是否存在 且 可以到达，如果是，则收集该格子
         * const deltaX = crossB.x - this.x;
         * const deltaY = crossB.y - this.y;
         * const backBX = crossB.x + deltaY;
         * const backBY = crossB.y + deltaX;
         */
        const backX = 2 * crossB.x - this.x;
        const backY = 2 * crossB.y - this.y;
        const backBWalkable = walkableRoundB.some(item => item.x === backX && item.y === backY);
        if (backBWalkable) {
            this.validRects = [
                ...remainWalkableRoundedA,
                {
                    x: backX,
                    y: backY,
                },
            ];
            return;
        }

        // 如果不存在或不可到达，判断并收集 walkableRoundB 存在和可到达的其余格子即可
        this.validRects = [...remainWalkableRoundedA, ...walkableRoundB];
    }

    /**
     * 判断rect是否可以到达，筛选出可以到达的rect
     * @param {*} param0
     * @returns
     */
    getWalkableRoundedRect({ rect, gap }) {
        if (!rect?.length || !gap?.length) return [];
        const res = [];
        rect.forEach((item, index) => {
            const currentGap = gap[index];
            if (this.grid.getGrid()[currentGap.y][currentGap.x] !== 0) {
                res.push(item);
            }
        });
        return res;
    }

    /**
     * 获取周围四个gap和四个rect的位置，分别过滤出其中在棋盘上存在的格子
     * rect: x,y+2 | x,y-2 | x+2,y | x-2,y
     * gap: x,y+1 | x,y-1 | x+1,y | x-1,y
     * @param {*} indexX
     * @param {*} indexY
     * @returns
     */
    getExistRoundedRectAndGap(indexX, indexY) {
        const result = { gap: [], rect: [] };

        const leftRectIndex = { x: indexX - 2, y: indexY };
        const rightRectIndex = { x: indexX + 2, y: indexY };
        const upRectIndex = { x: indexX, y: indexY - 2 };
        const downRectIndex = { x: indexX, y: indexY + 2 };

        const leftGapIndex = { x: indexX - 1, y: indexY };
        const rightGapIndex = { x: indexX + 1, y: indexY };
        const upGapIndex = { x: indexX, y: indexY - 1 };
        const downGapIndex = { x: indexX, y: indexY + 1 };

        // ⬆️➡️⬇️⬅️
        [upRectIndex, rightRectIndex, downRectIndex, leftRectIndex].forEach(index => {
            if (this._checkExistInGridByIndex(index.x, index.y)) {
                result.rect.push(index);
            }
        });

        [upGapIndex, rightGapIndex, downGapIndex, leftGapIndex].forEach(index => {
            if (this._checkExistInGridByIndex(index.x, index.y)) {
                result.gap.push(index);
            }
        });

        return result;
    }

    _checkExistInGridByIndex(indexX, indexY) {
        return this.grid.getGrid()?.[indexY]?.[indexX] !== undefined;
    }

    getRemainBlocks() {
        return this.blocks.checkRemain();
    }
    useBlock() {
        const remain = this.blocks.decreaseRemain();
        console.log(`玩家${this.name}使用block，剩余${remain}`);
    }
}

export default Player;
