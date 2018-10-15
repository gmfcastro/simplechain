import { INVALID_BLOCK } from "../../utils/errors/types"
import BlockException from "../../utils/errors/block.exception"
import Block from "../../blockchain/src/block"
import _ from "lodash"

export default class BlockFactory {
    constructor() {}

    static createStarBlock(block) {
        const { address, star } = block;
        const starObject = star;
        if(star.story) {
            const starStory = this._validStoryAndEncode(star.story);
            starObject.story = starStory;
        }

        return new Block({ address, star: starObject });
    }

    static createStarBlockResponse(blocks) {
        if(blocks.length == 1) return this._enrichWithDecodedStory(blocks[0]);
        return blocks.map(block => this._enrichWithDecodedStory(block));
    }

    static _validStoryAndEncode(story) {
        const wordsCount = story.split(" ").length;
        const encoded = new Buffer(story).toString("hex");
        if(wordsCount > 250) throw new BlockException(INVALID_BLOCK, "Story should have maximum of 250 words");
        if(Buffer.byteLength(encoded, "hex") > 500 ) throw new BlockException(INVALID_BLOCK, "Story exceeds 500 bytes");
        return encoded;
    }

    static _enrichWithDecodedStory(block) {
        const { body } = block;
        const { star } = body;
        if( star ) return _.merge(block, { body: { 
            star: { 
                storyDecoded: new Buffer(star.story, "hex").toString()
            }
        }});

        return block;
    }
}