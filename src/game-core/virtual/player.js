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
    getImage() {
        return this.image;
    }
    getPaths() {
        return this.aStarPaths;
    }
    move(x, y, cb) {
        this.x = x;
        this.y = y;
        cb(x, y);
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
    getRemainBlocks() {
        return this.blocks.checkRemain();
    }
    useBlock() {
        const remain = this.blocks.decreaseRemain();
        console.log(`玩家${this.name}使用block，剩余${remain}`);
    }
}

export default Player;
