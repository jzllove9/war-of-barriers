import { MaxBlocksNum } from '../const-value';

class Blocks {
    color;
    remain = MaxBlocksNum;
    constructor() {}
    checkRemain() {
        return this.remain > 0;
    }
    // 减少一个
    decreaseRemain() {
        if (this.remain <= 0) return 0;
        this.remain--;
        return this.remain;
    }
}
export default Blocks;
