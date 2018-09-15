import Block from "./blockchain/block"
import Blockchain from "./blockchain/blockchain"

class Test {

    constructor() {
        this.currentSize = 0;
    }

    static setup() {
        this.bc = new Blockchain();
    }

    static before() {
        return new Promise((resolve, reject) => {
            this.bc.getBlockHeight()
                .then(height => {
                    this.currentSize = height;
                    resolve(this.currentSize);
                })
                .catch(error => console.error("ERROR in geting block height"));
        });
    }

    static happyPath() {
        (function loop(i) {
            this.bc.addBlock(new Block("Block " + i)).then(() => {
                if ((i + 1) < 10) {
                    loop.bind(this)(i + 1);
                } else {
                    this.bc.validateChain();
                    this.bc.getBlockHeight()
                        .then(height => {
                            let expectedSize = this.currentSize + 10;
                            if (expectedSize !== height) {
                                console.error("ERROR");
                            }
                        })
                        .catch(error => console.error("ERROR in getting block height"));
                }
            });
        }).bind(this)(0);
    }

    static execute() {
        this.setup();
        this.before()
            .then(() => this.happyPath());
    }
}

Test.execute();