import Boom from "boom";
import HttpStatus from "http-status-codes";
import { INVALID, VALIDATION_NOT_FOUND } from "../../utils/errors/types"

export default class ValidationController {
    constructor(validationService) {
        this.validationService = validationService;
    }

    postNewValidation(request, h) {
        const { payload } = request;
        if(!payload) throw Boom.badRequest();
        const { address } = payload;
        if(!address) throw Boom.badRequest();

        try {
            const data = this.validationService.newValidation(address);
            return h.response(data).code(HttpStatus.OK);
        } catch (error) {
            console.error(error.stack);
            throw Boom.internal();
        }
    }

    postValidate(request) {
        const { payload } = request;
        if(!payload) throw Boom.badRequest();
        const { address, signature } = payload;
        if(!address || !signature) throw Boom.badRequest();

        try {
            return this.validationService.validate(address, signature);
        } catch (error) {
            switch(error.type) {
                case INVALID: throw Boom.unauthorized(error.message);
                case VALIDATION_NOT_FOUND: throw Boom.unauthorized(error.message);
                default: {
                    console.error(error.stack);
                    throw Boom.internal();
                }
            }
        }
    }
}