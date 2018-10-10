import { getValidationWindow } from "../utils/server.configuration"

export default class ValidationFactory {
    constructor() {}

    static createValidation(address) {
        const requestTimeStamp = Date.now();
        const validationWindow = getValidationWindow();
        const message = `${address}:${requestTimeStamp}:starRegistry`;
        return { address, requestTimeStamp, message, validationWindow };
    }

    static createValidated(validationObject) {
        const registerStar = true;
        const status = Object.assign({}, {messageSignature: "valid"}, validationObject);
        return { registerStar, status };
    }
}