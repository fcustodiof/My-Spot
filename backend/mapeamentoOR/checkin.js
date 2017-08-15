var session = require('../infrastructure/session');

var checkin = session.tableMap('checkin')
    .columnMap('idCheckin', 'idCheckin',  { isAutoIncrement: true })
    .columnMap('idReserva', 'idReserva')
    .columnMap('data', 'data');

module.exports = checkin;