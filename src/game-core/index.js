import BoardEntity from './entity/board';
import RoleEntity from './entity/role';

import Grid from './virtual/grid';
import Player from './virtual/player';

import { role1Img, role2Img, PlayerInitPos } from './const-value';

class Game {
    app;

    boardEntity;
    role1Entity;
    role2Entity;

    grid;
    player1;
    player2;
    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        /* 虚拟对象 */
        this.grid = new Grid();
        this.player1 = new Player({
            x: PlayerInitPos.player1[0],
            y: PlayerInitPos.player1[1],
            grid: this.grid,
            image: role1Img,
            name: '玩家1',
        });
        console.log('jzl:  ~ Game ~ init ~ player1:', this.player1);
        this.player2 = new Player({
            x: PlayerInitPos.player2[0],
            y: PlayerInitPos.player2[1],
            grid: this.grid,
            image: role2Img,
            name: '玩家2',
        });

        /* 实体对象 */
        this.boardEntity = new BoardEntity(this.app);
        this.role1Entity = new RoleEntity(this.app, this.player1, this.boardEntity);
        this.role2Entity = new RoleEntity(this.app, this.player2, this.boardEntity);
    }
}

export default Game;
