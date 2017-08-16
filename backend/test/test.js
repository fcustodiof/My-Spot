const quarto = require('../mapeamentoOR/quarto');
const hospede = require('../mapeamentoOR/hospede');
const reserva = require('../mapeamentoOR/reserva');
const checkin = require('../mapeamentoOR/checkin');
const checkout = require('../mapeamentoOR/checkout');

describe('Teste reserva', function() {
  describe('Salvar', function() {
    it('deve salvar sem erros', function(done) {
        var novaReserva = {
            idHospede: 1,
            idQuarto: 1,
            dataEntrada: "2017/09/09",
            dataSaida: "2017/09/10",
            privativa: 1,
            quantidade: 2
        }
        var controle = false;

        reserva.Insert(novaReserva).then(function (result) {
            controle = true;
        }).catch(function (error) {
            console.log(error);
        });
        if(controle){
            done();
        }else{
            done("Reserva não salva!");
        }
    });
  });

  describe('Salvar com data inferior a data atual', function() {
    it('não deve salvar', function(done) {
        var novaReserva = {
            idHospede: 1,
            idQuarto: 1,
            dataEntrada: "2017/01/01",
            dataSaida: "2017/01/01",
            privativa: 1,
            quantidade: 2
        }
        var controle = false;

        reserva.Insert(novaReserva).then(function (result) {
            
        }).catch(function (error) {
            controle = true;
        });
        if(controle){
            done();
        }else{
            done("Erro, foi salva reserva para uma data ja passada!");
        }
    });
  });
});