import BlockException from "../../utils/errors/block.exception";
import BlockFactory from "../factory/block.factory";
import { BLOCK_NOT_FOUND } from "../../utils/errors/types";

export default class StarService {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    async getStarFilteredBy(filter) {
        const stars = await this.blockchain.getBlockBy(filter) || [];
        if(stars.length == 0) throw new BlockException(BLOCK_NOT_FOUND, "Star not found");
        return BlockFactory.createStarBlockResponse(stars);
    }
}