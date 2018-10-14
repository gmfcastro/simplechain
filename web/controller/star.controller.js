export default class StarController {
    constructor(starService) {
        this.starService = starService;
    }

    async getStar(request, h) {
        const { hash, address } = request.params;
        const star = await this.starService.getStarFilteredBy({hash, address});
        return star;
    }
}