/**
 * Here is where is created the dependency injection of StarService and StarController
 * The service and controller should be singleton components.
 * All places that will use one of those components always should get it from here
 */

import StarController from "../controller/star.controller"
import StarService from "../service/star.service"
import { blockchain } from "../../blockchain/provider/blockchain.provider"

let controller = null;
let service = null;

const starService = () => {
    if(!service) {
        service = new StarService(blockchain);
    }
    return service;
}

const starController = () => {
    if(!controller) {
        controller = new StarController(starService());
    }
    return controller;
}

module.exports = {
    starService: starService(),
    starController: starController()
}