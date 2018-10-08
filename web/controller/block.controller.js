import Boom from "boom";
import HttpStatus from "http-status-codes";

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
        const { payload } = request;

        if(!payload) throw Boom.badRequest();

        try {
            let data = await this.blockService.addBlock(payload);
            return h.response(data).code(HttpStatus.OK);
        } catch (error) {
            switch(error.type) {
                default: throw Boom.internal();
            }
        }
    }
}