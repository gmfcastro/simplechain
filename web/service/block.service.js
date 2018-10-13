import Block from "../../blockchain/block";
import BlockFactory from "../factory/block.factory";
import BlockException from "../../utils/errors/block.exception"
import { UNAUTHORIZED } from "../../utils/errors/types"

export default class BlockService {

    constructor(blockchain, validationService) {
        this.blockchain = blockchain;
        this.validationService = validationService;
    }

    getBlockByHeight(height) {
        return this.blockchain.getBlock(height);
    }

    addStarBlock(block) {
        if(!this.validationService.isAuthorized(block.address)) {
            throw new BlockException(UNAUTHORIZED, "Validate first");
        }
        
        let newBlock = BlockFactory.createStarBlock(block)
        return this.blockchain.addBlock(newBlock);
    }
}