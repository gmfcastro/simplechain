
const promisedDelay = (delay = 100) => {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve();
        }, delay);
    });
}

module.exports = {
    promisedDelay: promisedDelay
}