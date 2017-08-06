angular.module('homeController',[])

.controller('homeController', function($scope, $http, md5, requestService){
  $(document).ready(function(){
    $('ul.tabs').tabs();
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
    Materialize.updateTextFields();
  });
  $scope.data = new Date();
  $scope.novoHospedeForm;
  $scope.selectCama = '';
  $scope.camas = [{ cama: 'Cama 1' }, { cama: 'Cama 2' }, { cama: 'Cama 3' }, { cama: 'Cama 4' }];
  $scope.tipoQuartos = [{ tipo: 'Privativo' }, { tipo: 'Albergue' }];
  $scope.novoHospede = true;
  $scope.formNovoHospede = function(){
    $scope.novoHospede = true;
  };
  $scope.hospedeReserva = function(){
    $scope.novoHospede =  false;
  };
  $scope.user = {
    email:"testeteste@email",
    password:"teste",
    name:"Teste"
  };
  $scope.login = function() {
    var user = {
      email: $scope.user.email,
      password: md5.createHash($scope.user.password),
      name: $scope.user.name
    };
    requestService.insertUser(user)
      .then(function(response) {
        console.log(response);
        alert("login")
      }, function(error) {
          if (error == 204) {
            alert("Email já cadastrado no sistema");
          }else {
            alert("Aconteceu algo :'(");
          }
        }
    );
  };
  var currentTime = new Date();
  $scope.currentTime = currentTime;
  $scope.month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  $scope.monthShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  $scope.weekdaysFull = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  $scope.weekdaysLetter = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  $scope.today = 'Hoje';
  $scope.clear = 'Limpar';
  $scope.close = 'Ok';
  // $scope.onStart = function () {
  //     console.log('onStart');
  // };
  // $scope.onRender = function () {
  //     console.log('onRender');
  // };
  // $scope.onOpen = function () {
  //     console.log('onOpen');
  // };
  // $scope.onClose = function () {
  //     console.log('onClose');
  // };
  // $scope.onSet = function () {
  //     console.log('onSet');
  // };
  // $scope.onStop = function () {
  //     console.log('onStop');
  // };
})
