export default class MempoolService {
    constructor(mempool) {
        this.mempool = mempool;
    }

    add(key, value, expiration = 60000) {
        const valueToSet = this._buildDataWithTimeout(expiration, value, key);
        this.mempool.set(key, valueToSet);
        return value;
    }

    evictAndReplace(key, value) {
        if (this.mempool.has(key)) {
            const object = this.mempool.get(key);
            object.timeout && clearTimeout(object.timeout);
            const valueToSet = this._buildData(value);
            this.mempool.set(key, valueToSet);
            return value;
        }
    }

    get(key) {
        const object = this.mempool.get(key)
        if(object) {
            const enrichedData = this._updateValidationWindow(object);
            return object.timeout ? enrichedData : object.data;
        }
    }

    evict(key) {
        if (this.mempool.has(key)) {
            const object = this.mempool.get(key);
            object.timeout && clearTimeout(object.timeout);
            this.mempool.delete(key);
        }
    }

    _buildData(object) {
        return Object.assign({}, {
            data: object
        });
    }

    _updateValidationWindow(object) {
        return Object.assign({}, object.data, {
            validationWindow: this._getRemainingTime(object)
        });
    }

    _getRemainingTime(object) {
        return object.expiration - (Date.now() - object.startTime);
    }

    _buildDataWithTimeout(expiration, value, key) {
        return Object.assign({}, {
            startTime: Date.now(),
            expiration: expiration,
            timeout: setTimeout(() => this.mempool.delete(key), expiration),
            data: value
        });
    }
}