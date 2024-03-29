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
            this.grid[i] = [];
            if (i % 2 === 0) {
                for (let j = 0; j < boardCol; j++) {
                    this.grid[i][j] = j % 2 === 0 ? 1 : 2;
                }
            } else {
                for (let j = 0; j < boardCol; j++) {
                    this.grid[i][j] = j % 2 === 0 ? 2 : 0;
                }
            }
        }
        this.easyStar = new EasyStar.js();
        // 设置可走路径
        this.easyStar.setAcceptableTiles([1, 2]);
        this.easyStar.setTileCost(2, 999);
        this.updateGrid(this.grid);
    }
    getGrid() {
        return this.grid;
    }
    updateGrid(grid) {
        this.easyStar.setGrid(grid);
    }
    setBlock(x, y) {
        this.grid[y][x] = 0;
        this.updateGrid(this.grid);
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
