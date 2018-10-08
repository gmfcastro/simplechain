import ValidationController from "../controller/validation.controller";
import ValidationService from "../service/validation.service";
import { mempoolService } from "../../mempool/provider/mempool.provider";

let controller = null;
let service = null;

const validationService = () => {
    if(!service) service = new ValidationService(mempoolService);
    return service;
}

const validationController = () => {
    if(!controller) controller = new ValidationController(validationService());
    return controller;
}

module.exports = {
    validationService: validationService(),
    validationController: validationController()
}