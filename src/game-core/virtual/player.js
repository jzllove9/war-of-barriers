class Player {
    x;
    y;
    // 当前最优路径
    path;
    name;
    grid;
    image;
    constructor({ x, y, grid, name, image }) {
        this.x = x;
        this.y = y;
        this.path = [];
        this.grid = grid;
        this.name = name;
        this.image = image;
    }
    getImage() {
        return this.image;
    }
    move(x, y, cb) {
        this.x = x;
        this.y = y;
        cb(x, y);
    }
}

export default Player;
