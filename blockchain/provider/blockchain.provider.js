import Blockchain from "../blockchain";
import chainDAO from "../../persistance/dao/chainDAO"

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
