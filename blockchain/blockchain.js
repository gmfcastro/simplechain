import SHA256 from "crypto-js/sha256"
import chainDB from "../persistance/dao/chainDAO"
import Block from "./block"

export default class Blockchain {
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
              resolve(newBlock);
            })
            .catch(error => {
              console.error("Unable to add the block " + newBlock.height + "Due to error: ", error);
            });
          });
        });
      });
    }
  
    getBlock(blockHeight) {
      return blockHeight >= 0 ? chainDB.get(blockHeight) : Promise.reject({type: "BAD_REQUEST"});
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
  