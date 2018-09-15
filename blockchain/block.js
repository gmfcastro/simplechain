export default class Block {
  constructor(data) {
    this.hash = "",
    this.body = data,
    this.time = 0,
    this.previousBlockHash = ""
  }
}