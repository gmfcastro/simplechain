import Blockchain from "../src/blockchain";
import chainDao from "../../persistance/dao/chain.dao"

let component = null;

const blockchain = () => {
    if(!component) {
        component = new Blockchain(chainDao);
    }
    return component;
}

module.exports = {
    blockchain: blockchain()
}
