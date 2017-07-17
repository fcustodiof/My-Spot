angular.module('index', ['ngRoute', 'ngCookies','routes', 'ui.materialize', 'homeController', 'userService', 'navService', 'angular-md5', 'requestService'])

.controller('indexController', function($location){
 $location.path('/');
})
