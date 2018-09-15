require("babel-register");

const config = require("./config/config.json");
const env = process.env.ENV || "dev";

const host = config[env].host;
const port = config[env].port;

const server = require("../app.js").server({
    host: host,
    port: port
});

server.start()
.then(() => console.log("Server running on ", server.info.uri) )
.catch( err => {
    console.error(err);
    process.exit(1);
});