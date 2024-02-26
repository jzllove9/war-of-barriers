import Blocks from './blocks';

class Player {
    x;
    y;
    targetX;
    targetY;
    aStarPath;
    name;
    grid;
    image;
    blocks;
    constructor({ x, y, targetX, targetY, grid, name, image }) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
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
    move(x, y, cb) {
        this.x = x;
        this.y = y;
        cb(x, y);
    }
    async calcAStarPath() {
        const path = await this.grid.calcPath(this.x, this.y, this.targetX, this.targetY);
        this.aStarPath = path;
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
