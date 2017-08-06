angular.module('homeController',[])

.controller('homeController', function($scope, $http, md5, requestService){
  $scope.select = [0,1,2,3,4];
  $(document).ready(function(){
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
  });
})
