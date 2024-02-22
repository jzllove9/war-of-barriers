// 棋盘格子size
const boardRectSize = 25;
// 棋盘格子间距
const boardGapSize = 10;
// 棋盘格子数量
const boardRow = 17;
const boardCol = 17;
// 棋盘格子间距方向
const GapDirect = {
    horizontal: 'h',
    vertical: 'v',
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
};

export { boardRectSize, boardGapSize, boardRow, boardCol, GapDirect, ColorEnum, ElementTypeEnum };
