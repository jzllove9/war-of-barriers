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
    constructor(app, player, boardEntity, color = 0x00bd14) {
        this.app = app;
        this.player = player;
        this.boardEntity = boardEntity;
        this.graph = new PIXI.Graphics();
        this.color = color;
        this.app.stage.addChild(this.graph);
        this.draw();
    }
    draw() {
        if (!this.graph) return;
        const aStarPath = this.player.aStarPath;
        this.graph.clear();
        if (!aStarPath?.length) {
            return;
        }
        this.graph.lineStyle(1, this.color, 1);
        const elementArr = aStarPath.map(item => {
            return this.boardEntity.getElementByPos(item.x, item.y);
        });
        const currentElementArr = elementArr;
        for (let i = 0; i < currentElementArr.length; i++) {
            const element = currentElementArr[i];
            const tempPos = element.position;
            if (i === 0) {
                this.graph.moveTo(tempPos.x + halfBordRectSize, tempPos.y + halfBordRectSize);
            } else {
                this.graph.lineTo(tempPos.x + halfBordRectSize, tempPos.y + halfBordRectSize);
            }
        }
    }
    clear() {
        this.graph?.clear?.();
    }
}

export default AssistLine;
