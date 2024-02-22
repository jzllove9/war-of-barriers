import * as PIXI from 'pixi.js';
import { boardRectSize, boardGapSize, boardRow, boardCol, GapDirect, ColorEnum, ElementTypeEnum } from '../const-value';
import RectEntity from './rect';
import GapEntity from './gap';

class Board {
    app;
    boardEntityArr = [];
    constructor(app) {
        this.app = app;
        this.init();
    }
    init() {
        const board = new PIXI.Container();
        this.initBoardArr();
        this.drawBoard(board);
        this.app.stage.addChild(board);
        return board;
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
                            GapDirect.vertical
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
                            GapDirect.horizontal
                        );
                        board.addChild(gap);
                        this.boardEntityArr[i][j] = gap;
                    } else {
                        // 横向 gap
                        const currentJ = j * 0.5;
                        const currentI = Math.ceil(i * 0.5);
                        const gap = new GapEntity(
                            currentJ * (boardRectSize + boardGapSize),
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
    getElementByPos(x, y) {
        return this.boardEntityArr[y][x];
    }
}

export default Board;
