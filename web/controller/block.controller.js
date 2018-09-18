import Boom from "boom";

export default class BlockController {
    constructor(blockService) {
        this.blockService = blockService;
    }

    async getBlockHeight(request, header) {
        const { height = 0 } = request.params;

        try {
            return await this.blockService.getBlockByHeight(height);
        } catch (error) {
            throw Boom.badRequest();
        }
    }

    async postBlock(request, header) {
        const { payload = {} } = request;

        try {
            return await this.blockService.addBlock(payload);
        } catch (error) {
            throw Boom.badRequest();
        }
    }
}