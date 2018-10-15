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

    async addStarBlock(block) {
        if(!this.validationService.isAuthorized(block.address)) {
            throw new BlockException(UNAUTHORIZED, "Validate first");
        }
        const newBlock = BlockFactory.createStarBlock(block);
        const addedBlock = await this.blockchain.addBlock(newBlock);
        this.validationService.unauthorize(block.address);
        return addedBlock;
    }
}