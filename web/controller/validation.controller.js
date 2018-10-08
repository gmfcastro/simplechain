import Boom from "boom";
import HttpStatus from "http-status-codes";

export default class ValidationController {
    constructor(validationService) {
        this.validationService = validationService;
    }

    postValidation(request, h) {
        const { payload } = request;
        if(!payload) throw Boom.badRequest();
        const { address } = payload;
        if(!address) throw Boom.badRequest();

        return this.validationService.newValidation(address);
    }
}