const SHA256 = require('crypto-js/sha256');
const chainDB = require('./chainDAO');

class Block {
  constructor(data) {
    this.hash = "",
    this.body = data,
    this.time = 0,
    this.previousBlockHash = ""
  }
}

class Blockchain {
  constructor() {
    this.init();
  }

  init() {
    chainDB.getCurrentBlock().then(lastBlockOnDb => {
      !lastBlockOnDb && this.generateGenesisBlock();
    });
  }

  addBlock(newBlock) {
    return new Promise(resolve => {
      this.getBlockHeight()
      .then(previousBlock => {
        newBlock.time = this.getCurrentTimeUTC();
        newBlock.previousBlockHash = previousBlock ? previousBlock.hash : "";
        newBlock.height = previousBlock ? previousBlock.height + 1 : 0;
        newBlock.hash = this.generateBlockHash(newBlock);
        chainDB.add(newBlock).then(() => {
          resolve(newBlock.height);
        })
        .catch(error => {
          console.error("Unable to add the block " + newBlock.height + "Due to error: ", error);
        });
      });
    });
  }

  getBlock(blockHeight) {
    return chainDB.get(blockHeight);
  }

  getBlockHeight() {
    return new Promise((resolve, reject) => {
      chainDB.getCurrentBlock()
      .then(block => {
        resolve(block.height);
      })
      .catch(error => reject(error));
    });
  }

  generateGenesisBlock() {
    this.addBlock(new Block("Genesis"));
  }

  generateBlockHash(block) {
    return SHA256(JSON.stringify(block)).toString();
  }

  getCurrentTimeUTC() {
    return new Date().getTime().toString().slice(0, -3);
  }

  validateBlock(blockHeight) {
    return new Promise(resolve => {
      chainDB.get(blockHeight).then(block => {
        let blockClone = Object.assign({}, block);
        let blockHash = block.hash;
        blockClone.hash = '';
        let validBlockHash = SHA256(JSON.stringify(blockClone)).toString();
        if (blockHash === validBlockHash) {
          resolve(block);
        } else {
          console.log('Block #' + blockHeight.height + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
          resolve(false);
        }
      });
    });
  }

  validateChain() {
    chainDB.getCurrentBlock().then(currentBlock => {
      let chainLenght = currentBlock.height;
      let errorLog = [];
      (function loop(index) {
        this.validateBlock(index).then(block => {
          if (block) {
            let nextBlockHeight = index + 1;
            if (nextBlockHeight < chainLenght) {
              this.getBlock(nextBlockHeight).then(nextBlock => {
                block.hash !== nextBlock.previousBlockHash && errorLog.push(index);
                loop.bind(this)(nextBlockHeight);
              });
            } else {
              if (errorLog.length > 0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: ' + errorLog);
              } else {
                console.log('No errors detected');
              }
            }
          } else {
            errorLog.push(block.height);
          }
        });
      }).bind(this)(0);
    });
  }
}

/**
 * Testing functions
 */

class Test{

  constructor(){}

  static setup() {
    this.bc = new Blockchain();
  }

  static happyPath() {
    (function loop(i){
      this.bc.addBlock(new Block("Block " + i)).then(() => {
        if((i+1) < 10 ) {
          loop.bind(this)(i+1);
        } else {
          this.bc.validateChain();
        }
      });
    }).bind(this)(0);
  }
  
  static execute() {
    this.setup();
    this.happyPath();
  }
}

Test.execute();


