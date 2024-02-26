import * as PIXI from 'pixi.js';

import BoardEntity from './entity/board';
import RoleEntity from './entity/role';
import AssistLineEnitity from './entity/assist-line';
import BlockEntity from './entity/block';

import Grid from './virtual/grid';
import Player from './virtual/player';

import { role1Img, role2Img, PlayerInitPos } from './const-value';

class Game extends PIXI.utils.EventEmitter {
    app;

    blockEntity;
    boardEntity;
    role1Entity;
    role2Entity;
    assist1LineEnitity;
    assist2LineEnitity;

    grid;
    player1;
    player2;

    currentPlayer;
    constructor(app) {
        super();
        this.app = app;
        this.init();
    }

    async init() {
        /* 虚拟对象 */
        this.grid = new Grid();
        this.player1 = new Player({
            x: PlayerInitPos.player1[0],
            y: PlayerInitPos.player1[1],
            targetX: PlayerInitPos.player2[0],
            targetY: PlayerInitPos.player2[1],
            grid: this.grid,
            image: role1Img,
            name: 'player1',
        });
        this.player2 = new Player({
            x: PlayerInitPos.player2[0],
            y: PlayerInitPos.player2[1],
            targetX: PlayerInitPos.player1[0],
            targetY: PlayerInitPos.player1[1],
            grid: this.grid,
            image: role2Img,
            name: 'player2',
        });

        /* 实体对象 */
        this.boardEntity = new BoardEntity(this.app, this.grid);

        this.blockEntity = new BlockEntity(this.boardEntity);
        const boardCtr = this.boardEntity.getContainer();
        boardCtr.addChild(this.blockEntity.block);
        boardCtr.addChild(this.blockEntity.virtualBlock);

        this.role1Entity = new RoleEntity(this.app, this.player1, this.boardEntity);
        this.role2Entity = new RoleEntity(this.app, this.player2, this.boardEntity);
        await this.role1Entity.init();
        await this.role2Entity.init();

        this.assist1LineEnitity = new AssistLineEnitity(this.app, this.player1, this.boardEntity);
        this.assist2LineEnitity = new AssistLineEnitity(this.app, this.player2, this.boardEntity, 0xff6f64);

        this.initEvent();

        /* 开始第一回合 */
        this.nextTurn();
    }

    // 切换回合
    nextTurn() {
        // TODO 高亮当前玩家，切换玩家移动权，处理界面内容，显示为当前玩家名称
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    initEvent() {
        this.boardEntity.on('onGapHover', this.onGapHover.bind(this));
        this.boardEntity.on('onGapLeave', this.onGapLeave.bind(this));
        this.boardEntity.on('onGapClick', this.onGapClick.bind(this));
    }

    onGapHover(gapInfo) {
        this.blockEntity.drawVirtualBlock(gapInfo.x, gapInfo.y, gapInfo.d);
    }

    onGapLeave() {
        this.blockEntity.clearVirtualBlock();
    }

    // 重新计算角色路径，辅助线重绘
    onGapClick(gapInfo) {
        if (!this.currentPlayer?.getRemainBlocks()) {
            console.log(`玩家${this.currentPlayer.name}剩余block不足`);
            return;
        }
        this.blockEntity.generateBlock(
            gapInfo.x,
            gapInfo.y,
            gapInfo.d,
            async () => {
                this.currentPlayer.useBlock();
                await this.role1Entity.updatePath();
                await this.role2Entity.updatePath();
                this.assist1LineEnitity.draw();
                this.assist2LineEnitity.draw();
                this.nextTurn();
            },
            () => {
                console.log('存在碰撞，不能放置');
            }
        );
    }
}

export default Game;
