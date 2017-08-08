var jsORM = require('js-hibernate');

var dbconfig = {
    host: "localhost",
    user: "root",
    password: "xexuto65",
    database: "ghlavras_myspot"
};

var session = jsORM.session(dbconfig);

module.exports = session;