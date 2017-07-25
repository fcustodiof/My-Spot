angular.module('routes', ['ngRoute'])

.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    }).when('/gerenciarQuartos', {
        templateUrl: 'pages/gerenciarQuartos.html',
        controller: 'gerenciarQuartosController'
    }).otherwise({
        redirectTo: "/"
  });
})
