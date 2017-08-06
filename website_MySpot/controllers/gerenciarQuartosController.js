angular.module('gerenciarQuartosController', [])

.controller('gerenciarQuartosController', function($scope, $location){
  $(document).ready(function(){
    $('ul.tabs').tabs();
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();
    Materialize.updateTextFields();
  });
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
})