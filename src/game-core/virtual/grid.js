import { boardRow, boardCol } from '../const-value';
import EasyStar from 'easystarjs';

class Grid {
    grid;
    easyStar;
    constructor() {
        this.init();
    }
    init() {
        const grid = new Array(boardRow).fill(new Array(boardCol).fill(1));
        this.easyStar = new EasyStar.js();
        // 设置可走路径
        this.easyStar.setAcceptableTiles([1]);
        this.easyStar.setGrid(grid);
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
