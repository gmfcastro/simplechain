import Boom from "boom";
import HttpStatus from "http-status-codes";
import { BLOCK_NOT_FOUND } from "../../utils/errors/types"

export default class StarController {
    constructor(starService) {
        this.starService = starService;
    }

    async getStar(request, h) {
        try {
        const { hash, address } = request.params;
        const stars = await this.starService.getStarFilteredBy({hash, address});
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