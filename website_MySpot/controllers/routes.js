angular.module('routes', ['ngRoute'])

.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'pages/home.html',
        controller: 'homeController'
    });
})
