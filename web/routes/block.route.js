import { blockController } from "../provider/block.provider";

export default [
    {
        method: "GET",
        path: "/block/{height}",
        handler: (request, h) => blockController.getBlockHeight(request, h)
    }, {
        method: "POST",
        path: "/block",
        handler: (request, h) => blockController.postBlock(request, h)
    }
]