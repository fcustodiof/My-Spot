angular.module('homeController',[])

.controller('homeController', function($scope, $http, md5, requestService){
  $scope.select = [0,1,2,3,4];
  $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });
  $scope.reserva = {
    dataInicio:currentTime = new Date(),
    dataFim: currentTime = new Date()
    
  };
  var currentTime = new Date();
  $scope.currentTime = currentTime;
  $scope.month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'December'];
  $scope.monthShort = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  $scope.weekdaysFull = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  $scope.weekdaysLetter = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  // $scope.disable = [false, 1, 7];
  $scope.today = 'Hoje';
  $scope.clear = 'Limpar';
  $scope.close = 'Ok';
  var days = 15;
  $scope.minDate = (new Date().toISOString());
  $scope.maxDate = (new Date($scope.currentTime.getTime() + ( 1000 * 60 * 60 *24 * days ))).toISOString();
  $scope.onStart = function () {
    console.log('onStart');
  };
  $scope.onRender = function () {
    console.log('onRender');
  };
  $scope.onOpen = function () {
    console.log('onOpen');
  };
  $scope.onClose = function () {
    console.log('onClose');
  };
  $scope.onSet = function () {
    console.log('onSet');
  };
  $scope.onStop = function () {
    console.log('onStop');
  };
})
