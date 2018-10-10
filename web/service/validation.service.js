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
        if (this.mempoolService.has(address)) {
            let validationObject = this.mempoolService.get(address);
            if(this._isValid(validationObject, address, signature)) {
                this.mempoolService.evict(address);
                return ValidationFactory.createValidated(validationObject);
            }
        }
        
        throw new Error("INVALID");
    }

    _isValid(validationObject, address, signature) {
        return this._isValidWidow(validationObject) && this._isValidSignature(validationObject, address, signature);
    }

    _isValidSignature(validationObject, address, signature) {
        const { message } = validationObject;
        return bitcoin.verify(message, address, signature);
    }

    _isValidWidow(validationObject) {
        const { 
            validationWindow,
            requestTimeStamp
        } = validationObject;
        const currentTimeStamp = Date.now();
        const validTimeStamp = validationWindow + requestTimeStamp;
        return currentTimeStamp <= validTimeStamp;
    }
}