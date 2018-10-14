import SHA256 from "crypto-js/sha256"
import chainDB from "../persistance/dao/chainDAO"
import Block from "./block"

export default class Blockchain {
    constructor() {
      this.init();
    }
  
    async init() {
      try{
        let lastBlockOnDb = await chainDB.getCurrentBlock();
        !lastBlockOnDb && await this.generateGenesisBlock();
      } catch(error) {
        console.log(error);
      }
    }
  
    async addBlock(newBlock) {
      try {
        let height = await this.getBlockHeight();
        let previousBlock = await this.getBlock(height);

        newBlock.height = height + 1;
        newBlock.time = this.getCurrentTimeUTC();
        newBlock.previousBlockHash = previousBlock ? previousBlock.hash : "";
        newBlock.hash = this.generateBlockHash(newBlock);

        await chainDB.add(newBlock);
        return newBlock;
      } catch (error) {
        console.error(`Unable to add the block ${newBlock.height} Due to error: ${error}`);
      }
    }

    async getBlockHeight() {
      try {
        let block = await chainDB.getCurrentBlock();
        return !block ? -1 : block.height;
      } catch(error) {
        console.error(error);
      }
    }
  
    getBlock(blockHeight) {
      return blockHeight >= 0 ? chainDB.get(blockHeight) : Promise.resolve();
    }

    getBlockBy(filter) {
      return chainDB.getBy(filter);
    }
    
    generateGenesisBlock() {
      return this.addBlock(new Block("Genesis"));
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
  