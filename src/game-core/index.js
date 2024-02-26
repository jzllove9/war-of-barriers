import * as PIXI from 'pixi.js';

import BoardEntity from './entity/board';
import RoleEntity from './entity/role';
import AssistLineEnitity from './entity/assist-line';
import BlockEntity from './entity/block';
import GapEntity from './entity/gap';
import RectEntity from './entity/rect';

import Grid from './virtual/grid';
import Player from './virtual/player';

import { role1Img, role2Img, PlayerInitPos, boardTotalWidth, boardTotalHeight, RoleMoveModeEnum } from './const-value';

class Game extends PIXI.utils.EventEmitter {
    app;
    container = new PIXI.Container();

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
        this.app.stage.addChild(this.container);
        this.container.x = (this.app.screen.width - boardTotalWidth) * 0.5;
        this.container.y = (this.app.screen.height - boardTotalHeight) * 0.5;
    }

    async init() {
        /* 虚拟对象 */
        this.grid = new Grid();
        this.player1 = new Player({
            x: PlayerInitPos.player1[0],
            y: PlayerInitPos.player1[1],
            targetY: PlayerInitPos.player2[1],
            grid: this.grid,
            image: role1Img,
            name: 'player1',
        });
        this.player2 = new Player({
            x: PlayerInitPos.player2[0],
            y: PlayerInitPos.player2[1],
            targetY: PlayerInitPos.player1[1],
            grid: this.grid,
            image: role2Img,
            name: 'player2',
        });

        /* 实体对象 */
        this.boardEntity = new BoardEntity(this.container, this.grid);

        this.blockEntity = new BlockEntity(this.boardEntity);
        const boardCtr = this.boardEntity.getContainer();
        boardCtr.addChild(this.blockEntity.block);
        boardCtr.addChild(this.blockEntity.virtualBlock);

        this.role1Entity = new RoleEntity(this.container, this.player1, this.boardEntity);
        this.role2Entity = new RoleEntity(this.container, this.player2, this.boardEntity);
        await this.role1Entity.init();
        await this.role2Entity.init();

        this.emit('player-init', [this.player1, this.player2]);

        this.assist1LineEnitity = new AssistLineEnitity(this.container, this.player1, this.boardEntity);
        this.assist2LineEnitity = new AssistLineEnitity(this.container, this.player2, this.boardEntity, 0xff6f64);

        this.initEvent();

        /* 开始第一回合 */
        this.nextTurn();
    }

    // 切换回合
    nextTurn() {
        // TODO 高亮当前玩家，切换玩家移动权，处理界面内容
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        // 通知外部 回合更新
        this.emit('turn-update', {
            current: this.currentPlayer,
            player1: this.player1,
            player2: this.player2,
        });
        // 每回合重置为移动模式
        this.changeCurrentTurnMode(RoleMoveModeEnum.Move);
    }

    changeCurrentTurnMode(mode) {
        if (mode === RoleMoveModeEnum.Block) {
            this.toggleGapInteractive(true);
        } else {
            this.toggleGapInteractive(false);
        }
    }

    changeAssistLineDisplay(player, isShow) {
        if (player.name === 'player1') {
            this.assist1LineEnitity.toggleVisible(isShow);
        } else {
            this.assist2LineEnitity.toggleVisible(isShow);
        }
    }

    toggleGapInteractive(isOpen) {
        const allEnitity = this.boardEntity.getAllChildEnitity();
        if (isOpen) {
            allEnitity.forEach(row => {
                row.forEach(entity => {
                    if (entity instanceof GapEntity) {
                        entity.doOpenInteractive();
                    }
                });
            });
        } else {
            allEnitity.forEach(row => {
                row.forEach(entity => {
                    if (entity instanceof GapEntity) {
                        entity.doCloseInteractive();
                    }
                });
            });
        }
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
                const path1 = this.player1.getPaths();
                const path2 = this.player2.getPaths();

                // 判断是否为违规放置
                if (!path1?.length || !path2?.length) {
                    this.toggleGapInteractive(false);
                    this.emit('illegal-path', this.currentPlayer);
                } else {
                    this.nextTurn();
                }
            },
            () => {
                console.log('存在碰撞，不能放置');
            }
        );
    }
}

export default Game;
