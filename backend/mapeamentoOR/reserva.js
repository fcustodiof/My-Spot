var session = require('../infrastructure/session');

var reserva = session.tableMap('reserva')
    .columnMap('idReserva', 'idReserva',  { isAutoIncrement: true }) 
    .columnMap('idHospede', 'idHospede')
    .columnMap('idQuarto', 'idQuarto')
    .columnMap('estadoReserva', 'estadoReserva')
    .columnMap('dataEntrada', 'dataEntrada')
    .columnMap('dataSaida', 'dataSaida')
    .columnMap('privativa', 'privativa')
    .columnMap('quantidade', 'quantidade');

module.exports = reserva;