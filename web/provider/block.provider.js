import BlockService from "../service/block.service";
import BlockController from "../controller/block.controller";
import Blockchain from "../../blockchain/blockchain";

let service = null;
let controller = null;

const blockchain = () => new Blockchain();

const blockService = () => {
    if(!service) service = new BlockService(blockchain());
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
