/**
 * 辅助线 - 用来绘制当前 A* 算法给出的最短路径
 */
import * as PIXI from 'pixi.js';
import { halfBordRectSize } from '../const-value';
class AssistLine {
    app;
    player;
    graph;
    boardEntity;
    color;
    offset;
    constructor(app, player, boardEntity, offset = 10, color = 0x1afa28) {
        this.app = app;
        this.player = player;
        this.boardEntity = boardEntity;
        this.graph = new PIXI.Graphics();
        this.offset = offset;
        this.color = color;
        this.graph.lineStyle(2, color, 1);
        this.app.stage.addChild(this.graph);
        this.draw();
    }
    draw() {
        if (!this.graph) return;
        const aStarPath = this.player.aStarPath;
        if (!aStarPath?.length) return;
        for (let i = 0; i < aStarPath.length; i++) {
            const pos = aStarPath[i];
            const tempPos = this.boardEntity.getElementByPos(pos.x, pos.y).position;
            if (i === 0) {
                this.graph.moveTo(
                    tempPos.x + halfBordRectSize + this.offset,
                    tempPos.y + halfBordRectSize + this.offset
                );
            } else {
                this.graph.lineTo(
                    tempPos.x + halfBordRectSize + this.offset,
                    tempPos.y + halfBordRectSize + this.offset
                );
            }
        }
    }
    clear() {
        this.graph?.clear?.();
    }
}

export default AssistLine;
