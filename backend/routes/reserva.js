const reserva = require('../mapeamentoOR/reserva');
var session = require('../infrastructure/session');

exports.post = function (req, res) {

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
};

exports.get = function (req, res) {

    let query = 'select * from reserva';

    session.executeSql(query).then(function(result){
        res.status(200).json(result);
    }).catch(function(error){
        res.status(400).send(error);
    });
};

exports.getOne = function (req, res) {

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
};

exports.put = function (req, res) {

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
};

exports.delete = function(req, res) {
    // TO DO
 };


exports.disponibilidade = function (req, res){

    let quarto = req.query.idquarto;
    let data = req.query.data;

    consultaDisponbilidadeReserva(quarto, data).then(function(result){
        res.status(200).send(result);
    }).catch(function(error){
        res.status(400).send(error);
    });
};

//Retorna [disponibilidade, mensagem]
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