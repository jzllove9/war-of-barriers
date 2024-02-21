import { createBoard } from './board';

class Game {
    app;
    board;
    constructor(app) {
        this.app = app;
        // 创建棋盘
        this.board = createBoard(this.app);
    }
}

export default Game;
