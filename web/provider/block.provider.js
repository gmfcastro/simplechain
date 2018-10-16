/**
 * Here is where is created the dependency injection of Blockservice and Blockcontroller
 * The service and controller should be singleton components.
 * All places that will use one of those components always should get it from here
 */

import BlockService from "../service/block.service";
import BlockController from "../controller/block.controller";
import { blockchain } from "../../blockchain/provider/blockchain.provider"
import { validationService } from "./validation.provider"

let service = null;
let controller = null;

const blockService = () => {
    if(!service) service = new BlockService(blockchain, validationService);
    return service;
}

const blockController = () => {
    if(!controller) controller = new BlockController(blockService());
    return controller;
}

module.exports = {
    blockService: blockService(),
    blockController: blockController()
}
