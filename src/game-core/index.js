import BoardEntity from './entity/board';
import Grid from './virtual/grid';

class Game {
    app;
    boardEntity;
    grid;
    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        // 创建棋盘
        this.boardEntity = new BoardEntity(this.app);
        // 创建格子
        this.grid = new Grid();
    }
}

export default Game;
