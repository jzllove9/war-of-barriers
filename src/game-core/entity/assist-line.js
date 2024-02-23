/**
 * 辅助线 - 用来绘制当前 A* 算法给出的最短路径
 */
import * as PIXI from 'pixi.js';
import { halfBordRectSize } from '../const-value';
import Rect from './rect';
class AssistLine {
    app;
    player;
    graph;
    boardEntity;
    color;
    offset;
    constructor(app, player, boardEntity, offset = 10, color = 0x00bd14) {
        this.app = app;
        this.player = player;
        this.boardEntity = boardEntity;
        this.graph = new PIXI.Graphics();
        this.offset = offset;
        this.color = color;
        this.graph.lineStyle(1, color, 0.8);
        this.app.stage.addChild(this.graph);
        this.draw();
    }
    draw() {
        if (!this.graph) return;
        const aStarPath = this.player.aStarPath;
        if (!aStarPath?.length) return;
        const elementArr = aStarPath.map(item => {
            return this.boardEntity.getElementByPos(item.x, item.y);
        });
        const currentElementArr = elementArr.filter(item => item instanceof Rect);
        for (let i = 0; i < currentElementArr.length; i++) {
            const element = currentElementArr[i];
            const tempPos = element.position;
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
