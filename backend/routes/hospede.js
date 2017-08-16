const hospede = require('../mapeamentoOR/hospede');
var session = require('../infrastructure/session');

exports.post = function (req, res) {
    let novoHospede = {
        dataNascimento: req.body.dataNascimento,
        cpf: req.body.cpf,
        rg: req.body.rg,
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone
    }

    hospede.Insert(novoHospede).then(function (result) {
        res.status(200).json({ message: 'Hospede cadastrado!' });
    }).catch(function (error) {

        if (error.sqlState === "23000"){
            res.status(400).json({ message: 'CPF já cadastrado!' });

        } else {
            res.status(400).send(error);
        }
    });
       
};

exports.get = function (req, res) {
    let query = 'select * from hospede';

    session.executeSql(query).then(function(result){
        res.status(200).json(result);
    }).catch(function(error){
        res.status(400).send(error);
    });
};

exports.getOne = function (req, res) {

    var query = session.query(hospede).where(
        hospede.idHospede.Equal(req.params.idHospede)
    );

    query.then(function(result){

        if(result.length > 0){

            res.status(200).json(result);

        }else{

            res.status(404).json({ message: 'Hospede não encontrado!' });
        }

    }).catch(function(error){
        res.status(400).send(error);
    });

};

exports.put = function (req, res) {

    var sql = 'UPDATE hospede SET dataNascimento = \''+ req.body.dataNascimento+
    '\', cpf = '+req.body.cpf+
    ', rg = \''+req.body.rg+
    '\', nome = \''+req.body.nome+
    '\', email = \''+req.body.email+
    '\', telefone = '+req.body.telefone+
    ' WHERE idHospede = '+req.params.idHospede;

    var query = session.executeSql(sql);

    query.then(function(result) {
        res.status(200).json({ message: 'Hospede atualizado!' });
    }).catch(function(error) {
        res.status(400).send(error);
    });
};

exports.delete = function(req, res) {
    // TO DO
 };