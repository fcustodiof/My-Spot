var session = require('../infrastructure/session');

var hospede = session.tableMap('hospede')
    .columnMap('idHospede', 'idHospede',  { isAutoIncrement: true })
    .columnMap('dataNascimento', 'dataNascimento')
    .columnMap('cpf', 'cpf', { isUnique: true })
    .columnMap('rg', 'rg')
    .columnMap('nome', 'nome')
    .columnMap('email', 'email')
    .columnMap('telefone', 'telefone');

module.exports = hospede;