import Boom from "boom";
import HttpStatus from "http-status-codes";
import { BLOCK_NOT_FOUND } from "../../utils/errors/types"

export default class StarController {
    constructor(starService) {
        this.starService = starService;
    }

    async getStar(request, h) {
        try {
        const { hash } = request.params;
        const stars = await this.starService.getStarFilteredBy({ hash });
        return h.response(stars[0]).code(HttpStatus.OK);
        } catch(error) {
            switch(error.type) {
                case BLOCK_NOT_FOUND: throw Boom.notFound(error.message);
                default: {
                    console.error(error.stack);
                    throw Boom.internal();
                }
            }
        }
    }

    async getStars(request, h) {
        try {
        const { address } = request.params;
        const stars = await this.starService.getStarFilteredBy({ address });
        return h.response(stars).code(HttpStatus.OK);
        } catch(error) {
            switch(error.type) {
                case BLOCK_NOT_FOUND: throw Boom.notFound(error.message);
                default: {
                    console.error(error.stack);
                    throw Boom.internal();
                }
            }
        }
    }
}