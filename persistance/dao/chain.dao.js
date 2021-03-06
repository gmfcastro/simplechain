import { BLOCK_NOT_FOUND } from "../../utils/errors/types"

const level = require("level");
const chainDB = "./chaindata";
const db = level(chainDB);

const get = key => {
  return new Promise((resolve, reject) => {
    db.get(key, (error, value) => {
      if (error) {
        let returnError = error;
        if(error instanceof level.errors.NotFoundError) {
          returnError = Object.assign({type: BLOCK_NOT_FOUND} ,error);
        }
        reject(returnError);
      }
      value && resolve(JSON.parse(value))
    })
  });
}

const getBy = filter => {
  return new Promise((resolve, reject) => {
    let returnBlocks = [];
    db.createReadStream()
    .on('data', data => {
      if(data.value) {
        const block = JSON.parse(data.value);
        const body = block.body;
        for(let prop in filter) {
          if(filter[prop] && (body[prop] == filter[prop] || block[prop] == filter[prop])) {
            returnBlocks.push(block);
          }
        }
      } 
    })
    .on('error', error => reject(error))
    .on('close', () => resolve(returnBlocks))
  });
}

const getCurrentBlock = () => {
  return new Promise((resolve, reject) => {
    let returnBlock;
    db.createReadStream()
    .on('data', data => {
      if(data.value) {
        let block = JSON.parse(data.value);
        if(!returnBlock || returnBlock.height < block.height) {
          returnBlock = block;
        }
      } 
    })
    .on('error', error => reject(error))
    .on('close', () => resolve(returnBlock))
  });
}

const add = block => {
  return new Promise((resolve, reject) => {
    let rawValue = JSON.stringify(block);
    db.put(block.height, rawValue, error => {
      if (error) reject(error);
      resolve(block.height);
    })
  })
}

module.exports = { add, get, getBy, getCurrentBlock }
