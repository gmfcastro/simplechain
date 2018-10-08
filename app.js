import Hapi from "hapi"
import blockRoutes from "./web/routes/block.route"
import validationRoutes from "./web/routes/validation.route"
import { getServerConfiguration } from "./web/utils/server.configuration"

const serverConfiguration = getServerConfiguration();
const server = Hapi.server(serverConfiguration)

server.route(blockRoutes);
server.route(validationRoutes);

module.exports = { server }