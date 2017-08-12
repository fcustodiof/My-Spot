var express = require('express');
var session = require('./infrastructure/session');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;
app.listen(port, function () {
   console.log("Servidor rodando na porta " +port);
});

const quarto = require('./mapeamentoOR/quarto');
const hospede = require('./mapeamentoOR/hospede');
const reserva = require('./mapeamentoOR/reserva');

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

router.route('/hospedes')
    .post(function (req, res) {
        
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
                res.status(400).send("CPF já cadastrado!");

            } else {
                res.status(400).send(error);
            }
        });
    })
    .get(function (req, res) {

        let query = 'select * from hospede';

        session.executeSql(query).then(function(result){
            res.status(200).json(result);
        }).catch(function(error){
            res.status(400).send(error);
        });
    });

router.route('/reservas')

    .post(function (req, res) {

        var novaReserva = {
            idHospede: req.body.idHospede,
            idQuarto: req.body.idQuarto,
            estadoReserva: req.body.estadoReserva,
            dataEntrada: req.body.dataEntrada,
            dataSaida: req.body.dataSaida,
            privativa: req.body.privativa,
            quantidade: req.body.quantidade
        }
        
        // Verifica disponibilidade de reserva antes de inserir
        consultaDisponbilidadeReserva(novaReserva.idQuarto, novaReserva.dataEntrada).then(function(result){

            let disponibilidade = result;
            let podeReservar = disponibilidade[0];

            if (podeReservar){

                // Parse do formato das datas para aceitação do SQL.
                novaReserva.dataEntrada = novaReserva.dataEntrada.replace(/'/g, "");
                novaReserva.dataSaida = novaReserva.dataSaida.replace(/'/g, "");

                reserva.Insert(novaReserva).then(function (result) {
                    res.status(200).json({ message: 'Reserva criada com sucesso!' });
                }).catch(function (error) {
                    res.status(400).send(error);
                });

            } else {
                res.status(401).send(disponibilidade[1]);
            }

        }).catch(function (error) {
            res.status(400).send(error);
        });
    })
    .get(function (req, res) {

        let query = 'select * from reserva';

        session.executeSql(query).then(function(result){
            res.status(200).json(result);
        }).catch(function(error){
            res.status(400).send(error);
        });
    });

// Retorna [disponibilidade, mensagem]
function consultaDisponbilidadeReserva(quarto, data){

        let querys = [];

        // Consulta as reservas cadastradas no quarto naquele periodo.
        querys.push(
            session.executeSql('select * from reserva where reserva.idQuarto = ' + quarto + ' AND ' + data 
            + 'BETWEEN reserva.dataEntrada AND reserva.dataSaida').then( function(result){

                return result;

            }).catch(function(error){

                return error;
            })
        );

        // Consulta o numero de camas naquele quarto.
        querys.push(
            session.executeSql('select vagaTotal from quarto where quarto.idQuarto = ' + quarto).then( function(result){

                return result;

            }).catch(function(error){

                return error;
            })
        );

        // Consulta a quantidade de camas reservadas no quarto naquele periodo.
        querys.push(
            session.executeSql('select quantidade from reserva where reserva.idQuarto = ' + quarto + ' AND ' + data 
            + 'BETWEEN reserva.dataEntrada AND reserva.dataSaida').then( function(result){

                return result;

            }).catch(function(error){

                return error;
            })
        );

        return Promise.all(querys).then(function(results){

            let reservasNoQuartoNoPeriodo = results.shift();
            let vagasTotaisNoQuarto = results.shift();
            let qntCamasNaReserva = results.shift();

            let existeReservaNoPeriodo = reservasNoQuartoNoPeriodo.length > 0 ? true : false;

            if (existeReservaNoPeriodo){

                // Verifica se a reserva é privativa
                if (reservasNoQuartoNoPeriodo[0].privativa === 1){
                    return [false, "Indisponível! Existe uma reserva privativa no quarto nesse período!"];

                } else {

                    let camasReservadas = 0;

                    // soma o número de camas reservadas em cada reserva.
                    for (let camas of _.values(qntCamasNaReserva)){
                        camasReservadas+= camas.quantidade;
                    }

                    let camasDisponiveis = vagasTotaisNoQuarto[0].vagaTotal - camasReservadas;

                    if (camasDisponiveis > 0)
                        return [true, camasDisponiveis + " camas disponíveis nesse período!"];
                    else
                        return [false, "Indisponível! Todas as camas estão reservadas nesse período!"];
                }

            } else {

                return [true, "Disponível para reserva!"];
            }

        }).catch(function(error){
            res.status(400).send(error);
        });
}

router.route('/consultaDisp')
    .get(function (req, res) {

        let quarto = req.query.idquarto;
        let data = req.query.data;

        consultaDisponbilidadeReserva(quarto, data).then(function(result){
            res.status(200).send(result);
        }).catch(function(error){
            res.status(400).send(error);
        });

    });
    app.use('/api', router);