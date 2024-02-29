<template>
    <div ref="container" class="container">
        <div
            class="player-ui player1"
            :class="[
                { disabled: gameState !== GameStatusEnum.Running || currentPlayer?.name === 'player2' },
                { current: currentPlayer?.name === 'player1' },
            ]"
        >
            <PlayerController
                ref="player1Ctrl"
                :info="player1Info"
                @change-mode="changeCurrentTurnMode"
                @change-assistLine-display="changeAssistLineDisplay"
            ></PlayerController>
        </div>
        <div
            class="player-ui player2"
            :class="[
                { disabled: gameState !== GameStatusEnum.Running || currentPlayer?.name === 'player1' },
                { current: currentPlayer?.name === 'player2' },
            ]"
        >
            <PlayerController
                ref="player2Ctrl"
                :info="player2Info"
                @change-mode="changeCurrentTurnMode"
                @change-assistLine-display="changeAssistLineDisplay"
            ></PlayerController>
        </div>
    </div>

    <VueFinalModal
        v-model="isShow"
        title="Hello World!"
        :clickToClose="false"
        :escToClose="false"
        :hide-overlay="true"
        @confirm="() => confirm()"
        :class="$style['modal-wrap']"
    >
        <div class="modal-container">
            <div class="title">游戏结束</div>
            <div v-if="modalText" class="content">{{ modalText }}</div>
            <div class="btn" @click="onRestart">重新开始</div>
        </div>
    </VueFinalModal>
</template>

<script setup>
import * as PIXI from 'pixi.js';
import { VueFinalModal } from 'vue-final-modal';
import { toast } from 'vue3-toastify';

import Game from '../game-core/index';
import PlayerController from '../components/player-controller.vue';
import { RoleMoveModeEnum, GameStatusEnum } from '@/game-core/const-value';

const usePIXI = () => {
    const container = ref();
    // 不要用 ref 包裹 PIXI.Application 实例，会导致 app 内部的元素链接到舞台失败，导致各种报错
    // 而且将 app 定义为 ref 也确实没有其必要性
    // const app = ref(null);
    const initApp = async cb => {
        await nextTick();
        const app = new PIXI.Application({ resizeTo: window, backgroundColor: 0x000000 });
        container.value.appendChild(app.view);
        cb(app);
    };

    return { initApp, container };
};

const { initApp, container } = usePIXI();

const useGame = () => {
    const currentPlayer = ref();
    const player1Info = ref({});
    const player2Info = ref({});
    const player1Ctrl = ref();
    const player2Ctrl = ref();
    const gameState = ref(GameStatusEnum.Running);
    let game = null;

    const gamePlayerInitHandler = playerArr => {
        player1Info.value = { ...playerArr[0] };
        player2Info.value = playerArr[1];
    };

    const gameTurnUpdateHandler = ({ current, player1, player2 }) => {
        currentPlayer.value = current;
        player1Info.value = { ...player1Info.value, ...player1 };
        player2Info.value = { ...player2Info.value, ...player2 };
        player1Ctrl.value.setMode(RoleMoveModeEnum.Move);
        player2Ctrl.value.setMode(RoleMoveModeEnum.Move);
    };

    const gameStateChangeHandler = status => {
        gameState.value = status;
        switch (gameState.value) {
            case GameStatusEnum.End:
                currentPlayer.value = null;
                break;

            default:
                break;
        }
    };

    const gameIllegalPathHandler = player => {
        showModal(`玩家 ${player.name} 违规`);
    };

    const gamePlayerWinHandler = player => {
        showModal(`玩家 ${player.name} 胜利`);
    };

    const gameBlockRemainLackHandler = player => {
        toast(`玩家 ${player.name} 剩余挡板不足！`, {
            theme: 'dark',
        });
    };

    const gameBlockHitHandler = () => {
        toast('存在碰撞，不能在此处放置挡板!')
    };

    const initGame = app => {
        game = new Game(app);
        game.on('player-init', gamePlayerInitHandler);
        game.on('turn-update', gameTurnUpdateHandler);
        game.on('player-win', gamePlayerWinHandler);
        game.on('illegal-path', gameIllegalPathHandler);
        game.on('block-remain-lack', gameBlockRemainLackHandler);
        game.on('block-hit', gameBlockHitHandler);
        // 监听 game 状态改变
        game.on('game-state-change', gameStateChangeHandler);
        game.init();
    };

    // 切换当前回合操作模式
    const changeCurrentTurnMode = mode => {
        game.changeCurrentTurnMode(mode);
    };

    // 显隐辅助线
    const changeAssistLineDisplay = value => {
        game.changeAssistLineDisplay(currentPlayer.value, value);
    };

    return {
        initGame,
        currentPlayer,
        player1Info,
        player2Info,
        changeCurrentTurnMode,
        changeAssistLineDisplay,
        player1Ctrl,
        player2Ctrl,
        gameState,
        game,
    };
};

const {
    initGame,
    currentPlayer,
    player1Info,
    player2Info,
    changeCurrentTurnMode,
    changeAssistLineDisplay,
    player1Ctrl,
    player2Ctrl,
    gameState,
    game,
} = useGame();

initApp(initGame);

const useModal = () => {
    const modalText = ref();
    const isShow = ref(false);
    function showModal(text) {
        modalText.value = text;
        isShow.value = true;
    }

    function confirm() {
        isShow.value = false;
    }

    return { isShow, showModal, confirm, modalText };
};

const { isShow, showModal, confirm, modalText } = useModal();

const onRestart = () => {
    location.reload();
};

onBeforeUnmount(() => {
    game?.destory();
});
</script>

<style lang="less" scoped>
.container {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;

    .player-ui {
        position: absolute;
        width: 100%;
        height: 150px;
        box-sizing: border-box;
        background-color: #117b00;
        pointer-events: none;
        border: 5px dashed #117b00;

        &.player1 {
            bottom: 0;
        }

        &.player2 {
            top: 0;
            background-color: #880303;
            border: 5px dashed #880303;
        }

        &.current {
            border: 5px dashed #f7fd17;
            pointer-events: auto;
        }

        &.disabled {
            &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                background-color: rgba(0, 0, 0, 0.5);
                pointer-events: none;
            }
        }
    }
}
</style>

<style lang="less" module>
.modal-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    :global {
        .modal-container {
            width: 500px;
            background-color: rgb(17, 24, 39);
            border: 1px solid rgb(55, 65, 81);
            border-radius: 8px;
            padding: 32px;
            color: #ecebe8;
            display: flex;
            align-items: center;
            flex-direction: column;

            .title {
                font-size: 30px;
                font-weight: 500;
            }

            .content {
                margin-top: 16px;
            }

            .btn {
                margin-top: 32px;
                padding: 4px 8px;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
                cursor: pointer;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }
}
</style>
