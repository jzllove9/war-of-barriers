import * as PIXI from 'pixi.js';
import { boardRectSize, boardGapSize, boardRow, boardCol, GapDirect, ColorEnum, ElementTypeEnum } from '../const-value';
import RectEntity from './rect';
import GapEntity from './gap';

class Board {
    app;
    boardEntityArr = new Array(boardRow).fill(new Array(boardCol).fill(null));
    constructor(app) {
        this.app = app;
        this.init();
    }
    init() {
        const board = new PIXI.Container();
        this.drawBoard(board);
        this.app.stage.addChild(board);
        return board;
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
                        board.addChild(rect);
                        this.boardEntityArr[j][i] = rect;
                    } else {
                        const currentJ = Math.ceil(j * 0.5);
                        // 纵向 gap
                        const gap = new GapEntity(
                            currentJ * boardRectSize + (currentJ - 1) * boardGapSize,
                            currentI * (boardRectSize + boardGapSize),
                            GapDirect.vertical
                        );
                        board.addChild(gap);
                        this.boardEntityArr[j][i] = gap;
                    }
                } else {
                    // if (j % 2 === 0) {
                    //     // 横向 gap
                    //     const currentJ = j * 0.5;
                    //     const currentI = Math.ceil(i * 0.5);
                    //     const gap = new GapEntity(
                    //         currentJ * (boardRectSize + boardGapSize),
                    //         currentI * boardRectSize + (currentI - 1) * boardGapSize,
                    //         GapDirect.horizontal
                    //     );
                    //     board.addChild(gap);
                    //     this.boardEntityArr[j][i] = gap;
                    // } else {
                    //     this.boardEntityArr[j][i] = null;
                    // }
                }
            }
        }
        console.log('jzl:  ~ Board ~ drawBoard ~  this.boardEntityArr:', this.boardEntityArr);
    }
    drawGap(x, y, direct, board) {
        const gap = new PIXI.Graphics();
        gap.beginFill(ColorEnum.boardGapColor);
        const width = direct === GapDirect.vertical ? boardGapSize : boardRectSize;
        const height = direct === GapDirect.vertical ? boardRectSize : boardGapSize;
        gap.drawRect(x, y, width, height);
        gap.endFill();
        gap.elementType = ElementTypeEnum.gap;
        gap.gapDirect = direct;
        board.addChild(gap);
        return gap;
    }
}

export default Board;
