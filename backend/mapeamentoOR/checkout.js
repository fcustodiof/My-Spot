var session = require('../infrastructure/session');

var checkout = session.tableMap('checkout')
    .columnMap('idCheckout', 'idCheckout',  { isAutoIncrement: true })
    .columnMap('idReserva', 'idReserva')
    .columnMap('data', 'data');

module.exports = checkout;