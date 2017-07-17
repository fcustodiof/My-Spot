angular.module('requestService', [])

.service('requestService', ['$http','$q', function($http, $q){
  var config = {
    headers:{
      'Access-Control-Allow-Origin': 'localhost/*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST',
      'Content-Type':'application/json'
    }
  };

  this.findUser = function(user){
		return $http.post('http://localhost:4000/findUser', user, config)
		.then(function(response) {
			if (typeof response.data === 'object') {
				return response.data;
			} else {
				// invalid response
				return $q.reject(response.data);
			}
		}, function(response) {
			// something went wrong
			return $q.reject(response.data);
		});
	}

  this.insertUser = function(user){
		return $http.post('http://localhost:4000/insertUser', user, config)
		.then(function(response) {
			if (typeof response.data === 'object') {
				return response.data;
			} else {
				// invalid response
				return $q.reject(response.status);
			}
		}, function(response) {
			// something went wrong
			return $q.reject(response.status);
		});
	}

}])
