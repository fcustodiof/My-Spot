var session = require('../infrastructure/session');

var quarto = session.tableMap('quarto')
    .columnMap('idQuarto', 'idQuarto',  { isAutoIncrement: true }) 
    .columnMap('tipoQuarto', 'tipoQuarto')
    .columnMap('sexoQuarto', 'sexoQuarto')
    .columnMap('valorQuarto', 'valorQuarto')
    .columnMap('vagaTotal', 'vagaTotal')
    .columnMap('desativado', 'desativado');

module.exports = quarto;