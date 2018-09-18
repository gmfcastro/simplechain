import config from "../../.env/config/config.json";

export function getServerConfiguration() {
    const env = process.env.ENV || "dev";
    const host = config[env].host;
    const port = config[env].port;
    return { host, port };
}
