import Block from "../../blockchain/block";

export default class BlockService {

    constructor(blockchain) {
        this.blockchain = blockchain
    }

    getBlockByHeight(height) {
        return this.blockchain.getBlock(height);
    }

    addBlock(payload) {
        let newBlock = new Block(payload);
        return this.blockchain.addBlock(newBlock);
    }
}