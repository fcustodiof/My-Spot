angular.module('index', [
    'ngRoute', 
    'ngCookies',
    'routes', 
    'requestService',
    'ui.materialize', 
    'angular-md5', 
    'homeController', 
    'userService', 
    'navService', 
    'gerenciarQuartosController'])

.controller('indexController', function($location){
 $location.path('/');
})
