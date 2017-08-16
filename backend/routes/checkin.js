const checkin = require('../mapeamentoOR/checkin');
var session = require('../infrastructure/session');

exports.post = function (req, res) {
       
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
};

exports.get = function (req, res) {

    let query = 'select * from checkin';

    session.executeSql(query).then(function(result){
        res.status(200).json(result);
    }).catch(function(error){
        res.status(400).send(error);
    });
};

exports.getOne = function (req, res) {

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
};

exports.put = function (req, res) {
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
};

exports.delete = function(req, res) {
 // TO DO
};