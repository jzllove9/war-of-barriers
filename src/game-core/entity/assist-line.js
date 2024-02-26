/**
 * 辅助线 - 用来绘制当前 A* 算法给出的最短路径
 */
import * as PIXI from 'pixi.js';
import { halfBordRectSize } from '../const-value';

class AssistLine {
    container;
    player;
    graph;
    boardEntity;
    color;
    elementCache = {};

    constructor(container, player, boardEntity, color = 0x00bd14) {
        this.container = container;
        this.player = player;
        this.boardEntity = boardEntity;
        this.graph = new PIXI.Graphics();
        this.graph.visible = false;
        this.color = color;
        this.container.addChild(this.graph);
        this.draw();
    }

    draw() {
        if (!this.graph) return;
        const aStarPaths = this.player.aStarPaths;
        this.graph.clear();
        if (!aStarPaths?.length) {
            return;
        }
        this.graph.lineStyle(1, this.color, 1);
        aStarPaths.map(path => {
            const elementArr = path.map(item => {
                let ele;
                if (this.elementCache[`${item.x}-${item.y}`]) {
                    ele = this.elementCache[`${item.x}-${item.y}`];
                } else {
                    ele = this.boardEntity.getElementByPos(item.x, item.y);
                    this.elementCache[`${item.x}-${item.y}`] = ele;
                }
                return ele;
            });

            for (let i = 0; i < elementArr.length; i++) {
                const element = elementArr[i];
                const tempPos = element.position;
                if (i === 0) {
                    this.graph.moveTo(tempPos.x + halfBordRectSize, tempPos.y + halfBordRectSize);
                } else {
                    this.graph.lineTo(tempPos.x + halfBordRectSize, tempPos.y + halfBordRectSize);
                }
            }
        });
    }

    clear() {
        this.graph?.clear?.();
    }

    toggleVisible(isShow) {
        this.graph.visible = isShow;
    }
}

export default AssistLine;
