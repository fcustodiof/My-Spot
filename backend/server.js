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
const checkin = require('./mapeamentoOR/checkin');
const checkout = require('./mapeamentoOR/checkout');

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
                res.status(404).json({ message: 'Quarto não encontrado!' });
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

        var query = session.executeSql(sql);
        
        query.then(function(result) {
            res.status(200).json({ message: 'Quarto atualizado!' });
        }).catch(function(error) {
            res.status(400).send(error);
        });
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
                res.status(400).json({ message: 'CPF já cadastrado!' });

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

router.route('/hospedes/:idHospede')    
    .get(function (req, res) {

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

    })
    .put(function (req, res) {

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
    })
    .delete(function(req, res) {
       // TO DO
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

router.route('/reservas/:idReserva')    
    .get(function (req, res) {

        var query = session.query(reserva).where(
            reserva.idReserva.Equal(req.params.idReserva)
        );

        query.then(function(result){

            if(result.length > 0){

                res.status(200).json(result);

            }else{

                res.status(404).json({ message: 'Reserva não encontrada!' });
            }

        }).catch(function(error){
            res.status(400).send(error);
        });

    })
    .put(function (req, res) {

        var sql = 'UPDATE reserva SET idHospede = '+ req.body.idHospede+
        ', idQuarto = '+req.body.idQuarto+
        ', estadoReserva = \''+req.body.estadoReserva+
        '\', dataEntrada = \''+req.body.dataEntrada+
        '\', dataSaida = \''+req.body.dataSaida+
        '\', privativa = \''+req.body.privativa+
        '\', quantidade = '+req.body.quantidade+
        ' WHERE idReserva = '+req.params.idReserva;

        var query = session.executeSql(sql);
        
        query.then(function(result) {
            res.status(200).json({ message: 'Reserva atualizada!' });
        }).catch(function(error) {
            res.status(400).send(error);
        });
    })
    .delete(function(req, res) {
       // TO DO
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

// O ideal seria pegar a data do momento da requisição para efetuar o check-in,
// Se sobrar tempo implementar!
router.route('/checkin')
    .post(function (req, res) {
        
        let promises = [];
        let reservaValida;

        let newCheckin = {
            idReserva: req.body.idReserva,
            data: req.body.data
        }
        
        let queryReservaValida = 'select * from reserva where reserva.idReserva = ' + newCheckin.idReserva;
        
        let queryDataValida = 'select idReserva from reserva where idReserva = ' + newCheckin.idReserva + ' AND \'' + newCheckin.data 
                + '\' BETWEEN (select dataEntrada from reserva where reserva.idReserva = ' +newCheckin.idReserva + 
                ') AND ' +'(select dataSaida from reserva where reserva.idReserva =' + newCheckin.idReserva + ' )';

        let queryUpdateReserva = 'UPDATE reserva SET estadoReserva = true WHERE idReserva = '+newCheckin.idReserva;

                

        // Consulta a existencia de uma reserva com o id passado
        session.executeSql(queryReservaValida).then(function(result){

            // Se a reserva existir, consulta se a data para checkin está dentro do intervalo de
            // datas da reserva.
           if(result.length > 0){
                session.executeSql(queryDataValida).then( function(result){

                    if (result.length > 0){
                        
                        // Insere o checkin no banco
                        checkin.Insert(newCheckin).then(function () {
                            
                            // Atualiza o estado da reserva para TRUE
                            session.executeSql(queryUpdateReserva).then(function() {
                                res.status(200).json({ message: 'Checkin efetuado com sucesso!' });
                            }).catch(function(error) {
                                res.status(400).send(error);
                            });

                        }).catch(function (error) {
                            res.status(400).send(error);
                        });


                    } else {
                        res.status(400).send({ message: "A data informada não está entre as datas de saida/entrada da reserva!"})
                    }       
                       
                }).catch(function(error){
                    res.status(400).send(error); 
                });

           } else {
               res.status(400).send({ message: "Não existe uma reserva com o id informado!"})
           }

        }).catch(function(error){
            res.status(400).send(error);
        });
    })
    .get(function (req, res) {

        let query = 'select * from checkin';

        session.executeSql(query).then(function(result){
            res.status(200).json(result);
        }).catch(function(error){
            res.status(400).send(error);
        });
    });

router.route('/checkin/:idCheckin')    
    .get(function (req, res) {

        var query = session.query(checkin).where(
            checkin.idCheckin.Equal(req.params.idCheckin)
        );

        query.then(function(result){

            if(result.length > 0){

                res.status(200).json(result);

            }else{

                res.status(404).json({ message: 'Check-in não encontrado!' });
            }

        }).catch(function(error){
            res.status(400).send(error);
        });

    })
    .put(function (req, res) {

        // Faltam as devidas verificações para update
        var sql = 'UPDATE checkin SET idReserva = '+ req.body.idReserva+
        ', data = \''+req.body.data+
        '\' WHERE idCheckin = '+req.params.idCheckin;

        var query = session.executeSql(sql);
        
        query.then(function(result) {
            res.status(200).json({ message: 'Check-in atualizado!' });
        }).catch(function(error) {
            res.status(400).send(error);
        });

    })
    .delete(function(req, res) {
       // TO DO
    });

// O ideal seria pegar a data do momento da requisição para efetuar o check-out,
// Se sobrar tempo implementar!
router.route('/checkout')
    .post(function (req, res) {
        
        let newCheckout = {
            idReserva: req.body.idReserva,
            data: req.body.data
        }

        let queryReservaValida = 'select * from reserva where reserva.idReserva = ' + newCheckout.idReserva;

        let queryDataValida = 'select idReserva from reserva where idReserva = ' + newCheckout.idReserva + ' AND \'' + newCheckout.data 
                + '\' BETWEEN (select dataEntrada from reserva where reserva.idReserva = ' +newCheckout.idReserva + 
                ') AND ' +'(select dataSaida from reserva where reserva.idReserva =' + newCheckout.idReserva + ' )';

        let queryUpdateReserva = 'UPDATE reserva SET estadoReserva = false WHERE idReserva = '+newCheckout.idReserva;

        // Consulta a existencia de uma reserva com o id passado
        session.executeSql(queryReservaValida).then(function(result){

            // Se a reserva existir, consulta se a data para checkout está dentro do intervalo de
            // datas da reserva.
           if(result.length > 0){
                session.executeSql(queryDataValida).then( function(result){

                    if (result.length > 0){
                        
                        // Insere o checkout no banco
                        checkout.Insert(newCheckout).then(function () {
                            
                            // Atualiza o estado da reserva para FALSE
                            session.executeSql(queryUpdateReserva).then(function() {
                                res.status(200).json({ message: 'Checkout efetuado com sucesso!' });
                            }).catch(function(error) {
                                res.status(400).send(error);
                            });

                        }).catch(function (error) {
                            res.status(400).send(error);
                        });


                    } else {
                        res.status(400).send({ message: "A data informada não está entre as datas de saida/entrada da reserva!"})
                    }       
                       
                }).catch(function(error){
                    res.status(400).send(error); 
                });

           } else {
               res.status(400).send({ message: "Não existe uma reserva com o id informado!"})
           }

        }).catch(function(error){
            res.status(400).send(error);
        });
    })
    .get(function (req, res) {

        let query = 'select * from checkout';

        session.executeSql(query).then(function(result){
            res.status(200).json(result);
        }).catch(function(error){
            res.status(400).send(error);
        });
    });

router.route('/checkout/:idCheckout')    
    .get(function (req, res) {

        var query = session.query(checkout).where(
            checkout.idCheckout.Equal(req.params.idCheckout)
        );

        query.then(function(result){

            if(result.length > 0){

                res.status(200).json(result);

            }else{

                res.status(404).json({ message: 'Check-out não encontrado!' });
            }

        }).catch(function(error){
            res.status(400).send(error);
        });

    })
    .put(function (req, res) {

        // Faltam as devidas verificações para update
        var sql = 'UPDATE checkout SET idReserva = '+ req.body.idReserva+
        ', data = \''+req.body.data+
        '\' WHERE idCheckout = '+req.params.idCheckout;

        var query = session.executeSql(sql);
        
        query.then(function(result) {
            res.status(200).json({ message: 'Check-out atualizado!' });
        }).catch(function(error) {
            res.status(400).send(error);
        });
    })
    .delete(function(req, res) {
       // TO DO
    });

app.use('/api', router);