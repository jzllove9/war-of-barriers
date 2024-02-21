import * as PIXI from 'pixi.js';

// 棋盘格子大小
const boardItemSize = 20;
// 格子间距大小
const gap = 20;
// 格子数量
const row = 9;
const col = 9;

export const createBoard = app => {
    const board = new PIXI.Container();
    // 创建 9* 9棋盘
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const square = new PIXI.Graphics();
            square.beginFill(0x0000ff);
            square.drawRect(i * boardItemSize + i * gap, j * boardItemSize + j * gap, boardItemSize, boardItemSize);
            square.endFill();
            board.addChild(square);
        }
    }
    app.stage.addChild(board);
};
