import Boom from "boom";
import HttpStatus from "http-status-codes";

export default class ValidationController {
    constructor(validationService) {
        this.validationService = validationService;
    }

    async postValidation(request, h) {
        return "HELLO";
    }
}