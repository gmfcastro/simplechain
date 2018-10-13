import Boom from "boom";
import HttpStatus from "http-status-codes";
import { INVALID_BLOCK, UNAUTHORIZED } from "../../utils/errors/types"

export default class ValidationController {
    constructor(blockService) {
        this.blockService = blockService;
    }

    async getBlockHeight(request, h) {
        const { height } = request.params;

        if(!height || height < 0) throw Boom.badRequest();

        try {
            let data = await this.blockService.getBlockByHeight(height);
            return h.response(data).code(HttpStatus.OK);
        } catch (error) {
            switch(error.type) {
              case "BAD_REQUEST": throw Boom.badRequest();
              case "NOT_FOUND": throw Boom.notFound();
              default: throw Boom.internal();
            } 
        }
    }

    async postBlock(request, h) {
        const block = request.payload;
        if(!this._isValidPostBlockRequest(block)) throw Boom.badRequest();

        try {
            let data = await this.blockService.addStarBlock(block);
            return h.response(data).code(HttpStatus.OK);
        } catch (error) {
            switch(error.type) {
                case UNAUTHORIZED: throw Boom.unauthorized(error.message);
                case INVALID_BLOCK: throw Boom.badRequest(error.message);
                default: throw Boom.internal();
            }
        }
    }

    _isValidPostBlockRequest(payload) {
        if(!payload) return false;
        const { address, star = {} } = payload;
        if(!address || !star.ra || !star.dec || !star.story) return false;

        return true;
    }
}