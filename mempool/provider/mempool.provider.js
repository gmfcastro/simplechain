import MempoolService from "../mempool.service"
import mempool from "../mempool"

let service = null

const mempoolService = () => {
    if(!service) service = new MempoolService(mempool);
    return service;
}

module.exports = {
    mempoolService: mempoolService()
}