import Role1Img from '@/assets/role1.png';
import Role2Img from '@/assets/role2.png';
// 角色图片
const role1Img = Role1Img;
const role2Img = Role2Img;

// 棋盘格子size
const boardRectSize = 26;
const halfBordRectSize = boardRectSize * 0.5;
// 棋盘格子间距
const boardGapSize = 10;
/**
 * 棋盘格子数量 N 需要符合条件:
 * (N % 2 !== 0) && (Math.floor(N * 0.5) % 2 === 0)
 * 例如: 3,5,9,13,17...
 */
const N = 5;
const boardRow = 2 * N - 1;
const boardCol = 2 * N - 1;
const boardTotalWidth = boardRectSize * N + boardGapSize * (N - 1);
const boardTotalHeight = boardRectSize * N + boardGapSize * (N - 1);
// 棋盘格子间距方向
const GapDirect = {
    horizontal: 'h',
    vertical: 'v',
    none: 'none',
};
// 元素类型枚举
const ElementTypeEnum = {
    rect: 'rect',
    gap: 'gap',
};
// 颜色
const ColorEnum = {
    // 棋盘格子颜色
    boardRectColor: 0x0000ff,
    // 棋盘格子高亮颜色
    boardRectHighlightColor: 0x7a06d6,
    // 棋盘间隔颜色
    boardGapColor: 0x222222,
    // 棋盘间隔颜色2
    boardGapColor2: 0x333333,
    // 阻挡块颜色
    blockColor: 0xffff00,
    // 无效阻挡块颜色
    invalidBlockColor: 0xff0000,
};
// 角色初始化位置
const PlayerInitPos = {
    player1: [Math.floor(boardCol * 0.5), boardRow - 1],
    player2: [Math.floor(boardCol * 0.5), 0],
};
// 每人最大 block 数量
const MaxBlocksNum = 10;

// 玩家当前回合的操作模式枚举
const RoleMoveModeEnum = {
    Move: 'move',
    Block: 'block',
};

// 游戏状态
const GameStatusEnum = {
    Running: 'running', // 游戏正常运行
    RoleMoving: 'role-moving', // 角色移动中
    End: 'end', // 游戏结束
};

export {
    boardRectSize,
    halfBordRectSize,
    boardGapSize,
    boardRow,
    boardCol,
    GapDirect,
    ColorEnum,
    ElementTypeEnum,
    PlayerInitPos,
    role1Img,
    role2Img,
    MaxBlocksNum,
    boardTotalWidth,
    boardTotalHeight,
    RoleMoveModeEnum,
    GameStatusEnum,
};
