import chai from "chai"
import sinon from "sinon"
import Block from "../src/block"
import Blockchain from "../src/blockchain"
import chainDao from "../../persistance/dao/chain.dao"
import { promisedDelay } from "../../utils/test/testutils"

const expect = chai.expect;

describe("Blockchain's instantiation test", () => {
    const sandbox = sinon.createSandbox();

    it("should create genesis block when there is no block created", async () => {
        sandbox.stub(chainDao, "getCurrentBlock").resolves();
        sandbox.stub(chainDao, "add").resolves();
        sandbox.spy(Blockchain.prototype, "init");
        sandbox.spy(Blockchain.prototype, "generateGenesisBlock");
        
        new Blockchain(chainDao);
        
        await promisedDelay();
        expect(Blockchain.prototype.generateGenesisBlock.calledOnce).to.be.true;
    });

    afterEach(() => {
        sandbox.restore();
    });
});

describe("Blockchain's add block tests", () => {
    const sandbox = sinon.createSandbox();

    it("should be able to add a new genesis block", async () => {
        sandbox.stub(chainDao, "getCurrentBlock").resolves();
        sandbox.stub(chainDao, "add").resolves();
        const blockchain = new Blockchain(chainDao);

        const newBlock = await blockchain.addBlock(new Block("Genesis"));

        expect(newBlock.hash).to.be.not.empty;
        expect(newBlock.previousBlockHash).to.be.equals("");
        expect(newBlock.height).to.be.equals(0);
    });

    it("should be able to add a new block with the previous hash", async () => {
        sandbox.stub(chainDao, "getCurrentBlock").resolves({ height: 1});
        sandbox.stub(chainDao, "get").withArgs(1).resolves({ hash: "hash" });
        sandbox.stub(chainDao, "add").resolves();
        const blockchain = new Blockchain(chainDao);

        const newBlock = await blockchain.addBlock(new Block("Block 2"));

        expect(newBlock.hash).to.be.not.empty;
        expect(newBlock.previousBlockHash).to.be.equals("hash");
        expect(newBlock.height).to.be.equals(2);
    });

    afterEach(() => {
        sandbox.restore();
    });
});

describe("Blockchain's get block height tests", () => {
    const sandbox = sinon.createSandbox();

    it("should be able to add a new genesis block", async () => {
        sandbox.stub(chainDao, "getCurrentBlock").resolves();
        const blockchain = new Blockchain(chainDao);

        const height = await blockchain.getBlockHeight();

        expect(height).to.be.equals(-1);
    });

    it("should be able to add a new block with the previous hash", async () => {
        sandbox.stub(chainDao, "getCurrentBlock").resolves({ height: 10 });
        const blockchain = new Blockchain(chainDao);

        const height = await blockchain.getBlockHeight();

        expect(height).to.be.equals(10);
    });

    afterEach(() => {
        sandbox.restore();
    });
});

describe("Blockchain's get block tests", () => {
    const sandbox = sinon.createSandbox();

    it("should return undefined when trying to get a block with height < 0 ", async () => {
        sandbox.stub(chainDao, "get").resolves({});
        const blockchain = new Blockchain(chainDao);

        const block = await blockchain.getBlock(-1);

        expect(block).to.be.undefined;
    });

    it("should call the get method from DAO when trying to get block = 0", async () => {
        sandbox.stub(chainDao, "get").resolves({});
        const blockchain = new Blockchain(chainDao);

        const block = await blockchain.getBlock(0);

        expect(block).to.be.deep.equals({});
    });
    
    it("should call the get method from DAO when trying to get block > 0", async () => {
        sandbox.stub(chainDao, "get").resolves({});
        const blockchain = new Blockchain(chainDao);

        const block = await blockchain.getBlock(1);

        expect(block).to.be.deep.equals({});
    });

    afterEach(() => {
        sandbox.restore();
    });
});



