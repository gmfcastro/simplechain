import Blockchain from "../src/blockchain";
import chainDAO from "../../persistance/dao/chain.dao"

let component = null;

const blockchain = () => {
    if(!component) {
        component = new Blockchain(chainDAO);
    }
    return component;
}

module.exports = {
    blockchain: blockchain()
}
