angular.module('reservarController',[])

.controller('reservarController', function($scope, $http, md5, requestService){
  $scope.user = {
    nome:'',
    sobrenome:'',
    cpf: '',
    rg: '',
    pais: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero:'',
    complemento: ''
  }
})
