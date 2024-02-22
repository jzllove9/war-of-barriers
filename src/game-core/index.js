import BoardEntity from './entity/board';
import RoleEntity from './entity/role';
import AssistLineEnitity from './entity/assist-line';

import Grid from './virtual/grid';
import Player from './virtual/player';
import Blocks from './virtual/blocks';

import { role1Img, role2Img, PlayerInitPos } from './const-value';

class Game {
    app;

    boardEntity;
    role1Entity;
    role2Entity;
    assist1LineEnitity;
    assist2LineEnitity;

    grid;
    player1;
    player2;
    constructor(app) {
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
            blocks: new Blocks(),
            name: 'player1',
        });
        this.player2 = new Player({
            x: PlayerInitPos.player2[0],
            y: PlayerInitPos.player2[1],
            targetX: PlayerInitPos.player1[0],
            targetY: PlayerInitPos.player1[1],
            grid: this.grid,
            image: role2Img,
            blocks: new Blocks(),
            name: 'player2',
        });
        await this.player1.calcAStarPath();
        await this.player2.calcAStarPath();

        /* 实体对象 */
        this.boardEntity = new BoardEntity(this.app);
        this.role1Entity = new RoleEntity(this.app, this.player1, this.boardEntity);
        this.role2Entity = new RoleEntity(this.app, this.player2, this.boardEntity);
        this.assist1LineEnitity = new AssistLineEnitity(this.app, this.player1, this.boardEntity, 2);
        this.assist2LineEnitity = new AssistLineEnitity(this.app, this.player2, this.boardEntity, -2, 0xd01d0f);
    }
}

export default Game;
