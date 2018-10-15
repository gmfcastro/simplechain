import MempoolService from "../src/mempool.service"
import mempool from "../src/mempool"

let service = null

const mempoolService = () => {
    if(!service) service = new MempoolService(mempool);
    return service;
}

module.exports = {
    mempoolService: mempoolService()
}