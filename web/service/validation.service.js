import ValidationFactory from "../factory/validation.factory"

export default class ValidationService {

    constructor(mempoolService) {
        this.mempoolService = mempoolService;
    }

    newValidation(address) {
        const validation = ValidationFactory.createValidation(address);
        return this.mempoolService.addValidation(address, validation);
    }
}