const level = require('level');
const chainDB = '../../chaindata';
const db = level(chainDB);

const get = key => {
  return new Promise((resolve, reject) => {
    db.get(key, (error, value) => {
      if (error) {
        let returnError = error;
        if(error instanceof level.errors.NotFoundError) {
          returnError = Object.assign({type: "NOT_FOUND"} ,error);
        }
        reject(returnError);
      }
      value && resolve(JSON.parse(value))
    })
  });
}

const getCurrentBlock = () => {
  return new Promise((resolve, reject) => {
    let returnBlock;
    db.createReadStream()
    .on('data', data => {
      let block = JSON.parse(data.value);
      if(!returnBlock || returnBlock.height < block.height) {
        returnBlock = block;
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

module.exports = {
  add: add,
  get: get,
  getCurrentBlock: getCurrentBlock
}
