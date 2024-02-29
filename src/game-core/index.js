import * as PIXI from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

import BoardEntity from './entity/board';
import RoleEntity from './entity/role';
import AssistLineEnitity from './entity/assist-line';
import BlockEntity from './entity/block';
import GapEntity from './entity/gap';
import RectEntity from './entity/rect';

import Grid from './virtual/grid';
import Player from './virtual/player';

import {
    role1Img,
    role2Img,
    PlayerInit,
    boardTotalWidth,
    boardTotalHeight,
    RoleMoveModeEnum,
    GameStatusEnum,
} from './const-value';

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

    _cacheVaildRect = [];

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
            x: PlayerInit.player1.pos[0],
            y: PlayerInit.player1.pos[1],
            targetY: PlayerInit.player2.pos[1],
            grid: this.grid,
            image: role1Img,
            name: 'player1',
            gridColor: PlayerInit.player1.gridColor,
        });
        this.player2 = new Player({
            x: PlayerInit.player2.pos[0],
            y: PlayerInit.player2.pos[1],
            targetY: PlayerInit.player1.pos[1],
            grid: this.grid,
            image: role2Img,
            name: 'player2',
            gridColor: PlayerInit.player2.gridColor,
        });

        /* 实体对象 */
        this.boardEntity = new BoardEntity(this.container, this.grid);

        this.blockEntity = new BlockEntity(this.boardEntity);
        const boardCtr = this.boardEntity.getContainer();
        boardCtr.addChild(this.blockEntity.block);
        boardCtr.addChild(this.blockEntity.virtualBlock);

        this.role1Entity = new RoleEntity(this.container, this.player1, this.boardEntity);
        this.role2Entity = new RoleEntity(this.container, this.player2, this.boardEntity);

        await this.player1.init(this.player2, this.role1Entity);
        await this.player2.init(this.player1, this.role2Entity);
        // 通知外部更新角色信息
        this.emit('player-init', [this.player1, this.player2]);

        this.assist1LineEnitity = new AssistLineEnitity(this.container, this.player1, this.boardEntity);
        this.assist2LineEnitity = new AssistLineEnitity(this.container, this.player2, this.boardEntity, 0xff6f64);

        this.initEvent();

        /* 开始第一回合 */
        this.nextTurn();
    }

    // 切换回合
    nextTurn() {
        // 高亮当前玩家，切换玩家移动权，处理界面内容
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        // 通知外部 回合更新
        this.emit('turn-update', {
            current: this.currentPlayer,
            player1: this.player1,
            player2: this.player2,
        });
        this.changeCurrentTurnMode(RoleMoveModeEnum.Move);
    }

    // 改变本回合操作模式 移动/阻挡
    changeCurrentTurnMode(mode) {
        if (mode === RoleMoveModeEnum.Block) {
            this.toggleGapInteractive(true);
            this.toggleRectInteractive(false);
        } else {
            this.toggleGapInteractive(false);
            this.toggleRectInteractive(true);
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

    toggleRectInteractive(isOpen) {
        if (isOpen) {
            this.currentPlayer.toggleSelected(true);
            const gridColor = this.currentPlayer.getGridColor();
            const currentValidRects = this.currentPlayer.getValidRects();
            currentValidRects.forEach(item => {
                const ele = this.boardEntity.getElementByPos(item.x, item.y);
                if (ele instanceof RectEntity) {
                    this._cacheVaildRect.push(ele);
                    ele.doOpenInteractive(gridColor);
                }
            });
        } else {
            this.currentPlayer.toggleSelected(false);
            if (this._cacheVaildRect.length) {
                this._cacheVaildRect.forEach(ele => {
                    ele.doCloseInteractive();
                });
                this._cacheVaildRect = [];
            }
        }
    }

    initEvent() {
        this.boardEntity.on('onGapHover', this.onGapHover.bind(this));
        this.boardEntity.on('onGapLeave', this.onGapLeave.bind(this));
        this.boardEntity.on('onGapClick', this.onGapClick.bind(this));
        this.boardEntity.on('onRectClick', this.onRectClick.bind(this));
        this.app.ticker.add(() => {
            TWEEN.update();
        });
    }

    onGapHover(gapInfo) {
        this.blockEntity.drawVirtualBlock(gapInfo.x, gapInfo.y, gapInfo.d);
    }

    onGapLeave() {
        this.blockEntity.clearVirtualBlock();
    }

    // 重新计算角色路径，辅助线重绘
    onGapClick(gapInfo) {
        if (gapInfo?.b) return;
        if (!this.currentPlayer?.getRemainBlocks()) {
            this.emit('block-remain-lack', this.currentPlayer);
            return;
        }
        this.blockEntity.generateBlock(
            gapInfo.x,
            gapInfo.y,
            gapInfo.d,
            async () => {
                this.currentPlayer.useBlock();
                // 先进行玩家的下一回合数据计算，用来判断是否违规，以及获取下一回合玩家的可移动格子
                await this.updatePlayerInfo();
                const path1 = this.player1.getPaths();
                const path2 = this.player2.getPaths();

                // 判断是否为违规放置
                if (!path1?.length || !path2?.length) {
                    this.toggleGapInteractive(false);
                    this.toggleRectInteractive(false);
                    this.emit('illegal-path', this.currentPlayer);
                    this.emit('game-state-change', GameStatusEnum.End);
                } else {
                    // 执行游戏的下一回合
                    this.nextTurn();
                }
            },
            () => {
                this.emit('block-hit', this.currentPlayer);
            }
        );
    }

    async onRectClick({ indexPos, position }) {
        this.toggleGapInteractive(false);
        this.toggleRectInteractive(false);
        const originRect = this.boardEntity.getElementByPos(this.currentPlayer.y, this.currentPlayer.x);
        const targetRect = this.boardEntity.getElementByPos(indexPos.y, indexPos.x);
        await this.currentPlayer.move(indexPos, position);
        originRect.fillByRole = false;
        targetRect.fillByRole = true;

        if (this._checkGameEnd()) {
            this.emit('player-win', this.currentPlayer);
            this.emit('game-state-change', GameStatusEnum.End);
        } else {
            await this.updatePlayerInfo();
            this.nextTurn();
        }
    }

    _checkGameEnd() {
        return this.currentPlayer.isWin();
    }

    // 重新计算 player 信息
    async updatePlayerInfo() {
        await this.player1.nextTurn();
        await this.player2.nextTurn();
        this.assist1LineEnitity.draw();
        this.assist2LineEnitity.draw();
    }

    destory() {
        TWEEN.removeAll();
    }
}

export default Game;
