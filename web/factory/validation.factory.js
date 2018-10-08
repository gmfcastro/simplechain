import { getValidationWindow } from "../utils/server.configuration"

export default class ValidationFactory {
    constructor() {}

    static createValidation(address) {
        const requestTimeStamp = Date.now();
        const validationWindow = getValidationWindow();
        const message = `${address}:${requestTimeStamp}:starRegistry`;
        return { address, requestTimeStamp, message, validationWindow };
    }
}