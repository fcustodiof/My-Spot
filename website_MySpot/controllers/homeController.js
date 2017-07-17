angular.module('homeController',[])

.controller('homeController', function($scope, $http, md5, requestService){
  $(document).ready(function(){
    $('ul.tabs').tabs();
    $('.tooltipped').tooltip({delay: 50});
  });
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
})
