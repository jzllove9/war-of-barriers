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
    constructor({ x, y, targetX, targetY, grid, name, image, blocks }) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.aStarPath = [];
        this.grid = grid;
        this.name = name;
        this.image = image;
        this.blocks = blocks;
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
        console.log('jzl:  ~ Player ~ calcAStarPath ~ path:', path);
        this.aStarPath = path;
    }
}

export default Player;
