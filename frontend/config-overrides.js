const path = require("path");

module.exports = function override(config) {
    // See https://stackoverflow.com/questions/65893787/create-react-app-with-typescript-and-npm-link-enums-causing-module-parse-failed.
    config.module.rules[1].oneOf[3].include = [
        path.join(__dirname, './src'),
        path.join(__dirname, '../mina/src')
    ];
    return config
}