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
// 棋盘格子数量
const boardRow = 5;
const boardCol = 5;
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
    // 棋盘间隔颜色
    boardGapColor: 0x222222,
    // 棋盘间隔颜色2
    boardGapColor2: 0x999999,
};
// 角色初始化位置
const PlayerInitPos = {
    player1: [Math.floor(boardCol * 0.5), boardRow - 1],
    player2: [Math.floor(boardCol * 0.5), 0],
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
};
