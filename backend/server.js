var express = require('express');
var session = require('./infrastructure/session');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require('path');

// Importando os modelos
const quarto = require('./routes/quarto');
const hospede = require('./routes/hospede');
const reserva = require('./routes/reserva');
const checkin = require('./routes/checkin');
const checkout = require('./routes/checkout');

// Config
var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.listen(port, function () {
   console.log("Servidor rodando na porta " +port);
});

// Rotas para quartos
app.post('/quartos', quarto.post);
app.get('/quartos', quarto.get);
app.get('/quartos/:idQuarto', quarto.getOne);
app.put('/quartos/:idQuarto', quarto.put);
app.delete('/quartos/:idQuarto', quarto.delete);

// Rotas para hospedes
app.post('/hospedes', hospede.post);
app.get('/hospedes', hospede.get);
app.get('/hospedes/:idHospede', hospede.getOne);
app.put('/hospedes/:idHospede', hospede.put);
//app.delete('/hospedes/:idHospede', hospede.delete);

// Rotas para reservas
app.post('/reservas', reserva.post);
app.get('/reservas', reserva.get);
app.get('/reservas/:idReserva', reserva.getOne);
app.put('/reservas/:idReserva', reserva.put);
app.get('/consultaDisp', reserva.disponibilidade);
//app.delete('/reservas/:idReserva', reserva.delete);

// Rotas para checkin
app.post('/checkin', checkin.post);
app.get('/checkin', checkin.get);
app.get('/checkin/:idCheckin', checkin.getOne);
app.put('/checkin/:idCheckin', checkin.put);
//app.delete('/checkin/:idCheckin', checkin.delete);

// Rotas para checkout
app.post('/checkout', checkout.post);
app.get('/checkout', checkout.get);
app.get('/checkout/:idCheckout', checkout.getOne);
app.put('/checkout/:idCheckout', checkout.put);
app.delete('/checkin/:idCheckin', checkin.delete);