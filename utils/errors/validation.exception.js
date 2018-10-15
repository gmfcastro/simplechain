export default class ValidationException {
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}