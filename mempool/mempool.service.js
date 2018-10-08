export default class MempoolService {
    constructor(mempool) {
        this.mempool = mempool;
    }

    addValidation(key, value) {
        this.mempool.set(key, value);
        return this.mempool.get(key);
    }
}