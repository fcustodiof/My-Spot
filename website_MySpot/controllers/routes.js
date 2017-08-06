angular.module('routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    }).when('/gerenciarQuartos', {
        templateUrl: 'pages/gerenciarQuartos.html',
        controller: 'gerenciarQuartosController'
    }).when('/reservar', {
        templateUrl: 'pages/reservar.html',
        controller: 'reservarController'
    }).otherwise({
        redirectTo: "/"
    });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

})
