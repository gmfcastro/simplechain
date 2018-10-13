import ValidationFactory from "../factory/validation.factory"
import bitcoin from "bitcoinjs-message"

export default class ValidationService {

    constructor(mempoolService) {
        this.mempoolService = mempoolService;
    }

    newValidation(address) {
        const validation = ValidationFactory.createValidation(address);
        return this.mempoolService.add(address, validation, validation.validationWindow);
    }

    validate(address, signature) {
        const validationObject = this.mempoolService.get(address);
        if (validationObject && !validationObject.registerStar) {
            if(this._isValid(validationObject, address, signature)) {
                const validObject = ValidationFactory.createValidated(validationObject);
                this.mempoolService.evictAndReplace(address, validObject);
                return validObject;
            }

            throw new Error("INVALID");
        }
        
        return validationObject;
    }

    isAuthorized(address) {
        const validatedObject = this.mempoolService.get(address);
        return validatedObject && validatedObject.registerStar;
    }

    _isValid(validationObject, address, signature) {
        return this._isValidWidow(validationObject) && this._isValidSignature(validationObject, address, signature);
    }

    _isValidSignature(validationObject, address, signature) {
        const { message } = validationObject;
        return bitcoin.verify(message, address, signature);
   } 

    _isValidWidow(validationObject) {
        return validationObject.validationWindow > 0;
    }
}