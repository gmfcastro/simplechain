import config from "../../.env/config/config.json";

export function getServerConfiguration() {
    const env = process.env.ENV || "dev";
    const host = config[env].host;
    const port = config[env].port;
    return { host, port };
}

export function getValidationWindow() {
    const env = process.env.ENV || "dev";
    const validationWindow = config[env].validationWindow || 5000;
    return validationWindow;
}
