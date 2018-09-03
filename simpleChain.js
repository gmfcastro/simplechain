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
      .then(height => {
        newBlock.height = height + 1;
        newBlock.time = this.getCurrentTimeUTC();
        this.getBlock(height).then(previousBlock => {
          newBlock.previousBlockHash = previousBlock ? previousBlock.hash : "";
          newBlock.hash = this.generateBlockHash(newBlock);
          chainDB.add(newBlock).then(() => {
            resolve(newBlock.height);
          })
          .catch(error => {
            console.error("Unable to add the block " + newBlock.height + "Due to error: ", error);
          });
        });
      });
    });
  }

  getBlock(blockHeight) {
    return blockHeight >= 0 ? chainDB.get(blockHeight) : Promise.resolve();
  }

  getBlockHeight() {
    return new Promise((resolve, reject) => {
      chainDB.getCurrentBlock()
      .then(block => {
        let isFirstBlock = block ? false : true;
        let blockHeight = isFirstBlock ? -1 : block.height;
        resolve(blockHeight);
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

  constructor(){
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
    (function loop(i){
      this.bc.addBlock(new Block("Block " + i)).then(() => {
        if((i+1) < 10 ) {
          loop.bind(this)(i+1);
        } else {
          this.bc.validateChain();
          this.bc.getBlockHeight()
          .then(height => {
            let expectedSize = this.currentSize + 10;
            if(expectedSize !== height) {
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


