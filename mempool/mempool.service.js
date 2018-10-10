export default class MempoolService {
    constructor(mempool) {
        this.mempool = mempool;
    }

    add(key, value, expiration = 60000) {
        const valueToSet = this._addTimeout(expiration, value, key);
        this.mempool.set(key, valueToSet);
        return value;
    }

    has(key) {
        return this.mempool.has(key);
    }

    get(key) {
        const object = this.mempool.get(key)
        return object.data;
    }

    evict(key) {
        if( this.mempool.has(key) ) {
            const object = this.mempool.get(key);
            object.timeout && clearTimeout(object.timeout);
            this.mempool.delete(key);
        }
    }

    _addTimeout(expiration, value, key) {
        return Object.assign({}, { 
                timeout: setTimeout(() => this.mempool.delete(key), expiration),
                data: value
        });
    }
}