import Boom from "boom";
import HttpStatus from "http-status-codes";

export default class ValidationController {
    constructor(validationService) {
        this.validationService = validationService;
    }

    postNewValidation(request, h) {
        try {
            const { payload } = request;
            if(!payload) throw Boom.badRequest();
            const { address } = payload;
            if(!address) throw Boom.badRequest();

            const data = this.validationService.newValidation(address);
            return h.response(data).code(HttpStatus.OK);
        } catch (error) {
            console.error(error.stack);
            throw Boom.internal();
        }
    }

    postValidate(request) {
        try {
            const { payload } = request;
            if(!payload) throw Boom.badRequest();
            const { address, signature } = payload;
            if(!address || !signature) throw Boom.badRequest();

            return this.validationService.validate(address, signature);
        } catch (error) {
            switch(error.message) {
                case "INVALID": throw Boom.unauthorized(error.message);
                default: {
                    console.error(error.stack);
                    throw Boom.internal();
                }
            }
        }
    }
}