class Blocks {
    color;
    // 每人初始化10个
    remain = 10;
    constructor() {}
    checkRemain() {
        return this.remain > 0;
    }
    // 减少一个
    decreaseRemain() {
        if (this.remain <= 0) return;
        this.remain--;
    }
}
export default Blocks;
