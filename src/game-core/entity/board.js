import * as PIXI from 'pixi.js';
import { boardRectSize, boardGapSize, boardRow, boardCol, GapDirect } from '../const-value';
import RectEntity from './rect';
import GapEntity from './gap';

class Board {
    app;
    grid;
    boardEntityArr = [];
    constructor(app, grid) {
        this.app = app;
        this.grid = grid;
        this.init();
    }
    init() {
        const board = new PIXI.Container();
        this.app.stage.addChild(board);
        this.initBoardArr();
        this.drawBoard(board);
    }
    initBoardArr() {
        this.boardEntityArr = new Array(boardRow);
        for (let i = 0; i < this.boardEntityArr.length; i++) {
            this.boardEntityArr[i] = new Array(boardCol).fill(null);
        }
    }
    drawBoard(board) {
        for (let i = 0; i < boardRow; i++) {
            for (let j = 0; j < boardCol; j++) {
                if (i % 2 === 0) {
                    const currentI = i * 0.5;
                    if (j % 2 === 0) {
                        // 棋盘格子
                        const currentJ = j * 0.5;
                        const rect = new RectEntity(
                            currentJ * (boardRectSize + boardGapSize),
                            currentI * (boardRectSize + boardGapSize)
                        );
                        this.boardEntityArr[i][j] = rect;
                        board.addChild(rect);
                    } else {
                        const currentJ = Math.ceil(j * 0.5);
                        // 纵向 gap
                        const gap = new GapEntity(
                            currentJ * boardRectSize + (currentJ - 1) * boardGapSize,
                            currentI * (boardRectSize + boardGapSize),
                            GapDirect.vertical,
                            j,
                            i
                        );
                        this.boardEntityArr[i][j] = gap;
                        board.addChild(gap);
                    }
                } else {
                    if (j % 2 === 0) {
                        // 横向 gap
                        const currentJ = j * 0.5;
                        const currentI = Math.ceil(i * 0.5);
                        const gap = new GapEntity(
                            currentJ * (boardRectSize + boardGapSize),
                            currentI * boardRectSize + (currentI - 1) * boardGapSize,
                            GapDirect.horizontal,
                            j,
                            i
                        );
                        board.addChild(gap);
                        this.boardEntityArr[i][j] = gap;
                    } else {
                        // 无方向 gap
                        const currentJ = j * 0.5;
                        const currentJCeil = Math.ceil(currentJ);
                        const currentI = Math.ceil(i * 0.5);
                        const gap = new GapEntity(
                            currentJCeil * boardRectSize + (currentJCeil - 1) * boardGapSize,
                            currentI * boardRectSize + (currentI - 1) * boardGapSize,
                            GapDirect.none
                        );
                        board.addChild(gap);
                        this.boardEntityArr[i][j] = gap;
                    }
                }
            }
        }
    }
    // 通过二维数组坐标获取元素
    getElementByPos(x, y) {
        return this.boardEntityArr[y][x];
    }
}

export default Board;
