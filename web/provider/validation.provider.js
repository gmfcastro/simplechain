/**
 * Here is where is created the dependency injection of ValidationService and ValidationController
 * The service and controller should be singleton components.
 * All places that will use one of those components always should get it from here
 */

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