import { blockController } from "../provider/block.provider";

export default [
    {
        method: 'GET',
        path: '/block/{height}',
        handler: (request, header) => blockController.getBlockHeight(request, header)
    }, {
        method: 'POST',
        path: '/block',
        handler: (request, header) => blockController.postBlock(request, header)
    }
]