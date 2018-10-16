import { starController } from "../provider/star.provider"

export default [
    {
        method: "GET",
        path: "/stars/hash:{hash}",
        handler: (request, h) => starController.getStar(request, h)
    },
    {
        method: "GET",
        path: "/stars/address:{address}",
        handler: (request, h) => starController.getStars(request, h)
    }
]