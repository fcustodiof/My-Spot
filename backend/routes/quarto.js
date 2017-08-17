const quarto = require('../mapeamentoOR/quarto');
var session = require('../infrastructure/session');

exports.post = function (req, res) {
    var newQuarto = {
        tipoQuarto: req.body.tipoQuarto,
        sexoQuarto: req.body.sexoQuarto,
        valorQuarto: req.body.valorQuarto,
        vagaTotal: req.body.vagaTotal
    }
    
    quarto.Insert(newQuarto).then(function (result) {
        res.status(200).json({ message: 'Quarto criado!' });
    }).catch(function (error) {
        res.status(400).send(error);
    });
};

exports.get = function (req, res) {
    var query = session.query(quarto).where(
        quarto.desativado.Equal('FALSE')
    );
    query.then(function(result){
        res.status(200).json(result);
    }).catch(function(error){
        res.status(400).send(error);
    });
};

exports.getOne = function (req, res) {
    var query = session.query(quarto).where(
        quarto.idQuarto.Equal(req.params.idQuarto)
    );
    query.then(function(result){
        if(result.length > 0){
            res.status(200).json(result);
        }else{
            res.status(404).json({ message: 'Quarto não encontrado!' });
        }
    }).catch(function(error){
        res.status(400).send(error);
    });
};

exports.put = function (req, res) {

    var sql = 'UPDATE quarto SET tipoQuarto = \''+req.body.tipoQuarto+
    '\', sexoQuarto = \''+req.body.sexoQuarto+
    '\', valorQuarto = '+req.body.valorQuarto+
    ', vagaTotal = '+req.body.vagaTotal+
    ' WHERE idQuarto = '+req.params.idQuarto;

    var query = session.executeSql(sql);
    
    query.then(function(result) {
        res.status(200).json({ message: 'Quarto atualizado!' });
    }).catch(function(error) {
        res.status(400).send(error);
    });
};

exports.delete = function(req, res) {
    var sql = 'UPDATE quarto SET desativado = TRUE WHERE idQuarto = '+req.params.idQuarto;
    var query = session.executeSql(sql);
        
    query.then(function(result) {
        res.status(200).json({ message: 'Quarto excluído!' });
    }).catch(function(error) {
        res.status(400).send(error);
    });
};