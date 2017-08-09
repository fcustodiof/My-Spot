var express = require('express');
var session = require('./infrastructure/session');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;
app.listen(port);

var quarto = require('./mapeamentoOR/quarto');

var router = express.Router();

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.route('/quartos')
    .post(function (req, res) {
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
    })
    .get(function (req, res) {
        var query = session.query(quarto).where(
            quarto.desativado.Equal('FALSE')
        );
        query.then(function(result){
            res.status(200).json(result);
        }).catch(function(error){
            res.status(400).send(error);
        });
    });

router.route('/quartos/:idQuarto')
    .get(function (req, res) {
        var query = session.query(quarto).where(
            quarto.idQuarto.Equal(req.params.idQuarto)
        );
        query.then(function(result){
            if(result.length > 0){
                res.status(200).json(result);
            }else{
                res.status(404).send("Quarto não encontrado!");
            }
        }).catch(function(error){
            res.status(400).send(error);
        });
    })
    .put(function (req, res) {
        var sql = 'UPDATE quarto SET tipoQuarto = \''+req.body.tipoQuarto+
        '\', sexoQuarto = \''+req.body.sexoQuarto+
        '\', valorQuarto = '+req.body.valorQuarto+
        ', vagaTotal = '+req.body.vagaTotal+
        ' WHERE idQuarto = '+req.params.idQuarto;
        console.log(sql);
        var query = session.executeSql(sql);
        
        query.then(function(result) {
            res.status(200).json({ message: 'Quarto atualizado!' });
        }).catch(function(error) {
            res.status(400).send(error);
        });

        // var newQuarto = {
        //     idQuarto: req.params.idQuarto,
        //     tipoQuarto: req.body.tipoQuarto,
        //     sexoQuarto: req.body.sexoQuarto,
        //     valorQuarto: req.body.valorQuarto,
        //     vagaTotal: req.body.vagaTotal
        // }

        // quarto.Insert(newQuarto).then(function (result) {
        //     res.status(200).json({ message: 'Quarto criado!' });
        // }).catch(function (error) {
        //     res.status(400).send(error);
        // });
    })
    .delete(function(req, res) {
       var sql = 'UPDATE quarto SET desativado = TRUE WHERE idQuarto = '+req.params.idQuarto;
        var query = session.executeSql(sql);
            
        query.then(function(result) {
            res.status(200).json({ message: 'Quarto excluído!' });
        }).catch(function(error) {
            res.status(400).send(error);
        });
    });

    app.use('/api', router);