const checkout = require('../mapeamentoOR/checkout');
var session = require('../infrastructure/session');

exports.post = function (req, res) {

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
};

exports.get = function (req, res) {

    let query = 'select * from checkout';

    session.executeSql(query).then(function(result){
        res.status(200).json(result);
    }).catch(function(error){
        res.status(400).send(error);
    });
};

exports.getOne = function (req, res) {
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
};

exports.put = function (req, res) {
    
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
};

exports.delete = function(req, res) {
 // TO DO
};