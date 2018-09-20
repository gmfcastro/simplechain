require("babel-register");

const server = require("../app.js").server;

server.start()
.then(() => console.log("Server running on ", server.info.uri) )
.catch( err => {
    console.error(err);
    process.exit(1);
});