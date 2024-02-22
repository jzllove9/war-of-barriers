import { boardRow, boardCol } from '../const-value';
import EasyStar from 'easystarjs';

class Grid {
    grid = [];
    easyStar;
    constructor() {
        this.init();
    }
    async init() {
        for (let i = 0; i < boardRow; i++) {
            this.grid = new Array(boardRow);
            for (let i = 0; i < this.grid.length; i++) {
                this.grid[i] = new Array(boardCol).fill(1);
            }
        }
        this.grid = [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 0, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
        ];
        this.easyStar = new EasyStar.js();
        // 设置可走路径
        this.easyStar.setAcceptableTiles([1]);
        this.easyStar.setGrid(this.grid);
    }
    setBlock(x, y) {
        this.easyStar.setAdditionalPointCost(x, y, Infinity);
    }
    calcPath(startX, startY, endX, endY) {
        return new Promise((resolve, reject) => {
            if (!this.easyStar) {
                resolve([]);
            }

            // 计算路径
            this.easyStar.findPath(startX, startY, endX, endY, path => {
                resolve(path);
            });
            this.easyStar.calculate();
        });
    }
}
export default Grid;
