export default class StarService {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    async getStarFilteredBy(filter) {
        const stars = await this.blockchain.getBlockBy(filter);
        return stars.length == 1 ? stars[0] : stars;
    }
}