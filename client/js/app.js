'user strict';

angular.module('myApp', ['ngRoute', 'ngResource', 'cgNotify'])

.factory('authInterceptor', function ($rootScope, $q, $window) {
	return {
		request: function (config) {
			config.headers = config.headers || {};
			if ($window.localStorage.token) {
				config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
			}
			return config;
		},
		responseError: function (rejection) {
			if (rejection.status === 401) {
				if ($window.localStorage.token) {
					delete $window.localStorage.token;
				}
				$rootScope.$broadcast('auth-not-authenticated');
				// handle the case where the user is not authenticated
			}
			if (rejection.status === 403) {
				$rootScope.$broadcast('auth-not-authorized');
				// handle the case where the user is not authenticated
			}
			if (rejection.status === 419 || rejection.status === 440) {
				if ($window.localStorage.token) {
					delete $window.localStorage.token;
				}
				$rootScope.$broadcast('auth-session-timeout');
				// handle the case where the user is not authenticated
			}
			return $q.reject(rejection);
		}
	};
})

.config(function ($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
})

.controller('AppCtrl', function ($scope, $rootScope, $http, $window, $location) {

	//this is used to parse the profile
	function url_base64_decode(str) {
		var output = str.replace('-', '+').replace('_', '/');
		switch (output.length % 4) {
			case 0:
				break;
			case 2:
				output += '==';
				break;
			case 3:
				output += '=';
				break;
			default:
				throw 'Illegal base64url string!';
		}
		return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
	}

	function updateLocalStorageWithToken (token) {
		$window.localStorage.token = token;
		$rootScope.isAuthenticated = true;
		var encodedProfile = token.split('.')[1];
		var profile = JSON.parse(url_base64_decode(encodedProfile));
		$scope.profile = profile;
		$window.localStorage.user = angular.toJson(profile);
	}

	function checkTokenExpiration () {
		// console.log('checkTokenExpiration');
		var userInfo = angular.fromJson($window.localStorage.user);
		// console.log(userInfo);
		if (userInfo && userInfo.exp) {
			var exp = userInfo.exp;
			// console.log('exp: ' + exp);
			if (!Date.now) {
				Date.now = function() { return new Date().getTime(); }
			}
			var now = Math.floor(Date.now() / 1000);
			// console.log('now: ' + now);
			var diff = exp - now;
			// console.log('diff: ' + diff);
			if (diff < 60 * 60 * 12) {
				$rootScope.$broadcast('auth-token-expiring');
			}
		}
	}

	$scope.user = {username: '', password: ''};
	$rootScope.isAuthenticated = false;
	$scope.profile = {};

	if ($window.localStorage.token) {
		$scope.isAuthenticated = true;
	}
	if ($window.localStorage.user) {
		$scope.profile = angular.fromJson($window.localStorage.user);
	}

	$scope.login = function () {
		$http
		.post('/auth', $scope.user)
		.success(function (data, status, headers, config) {
			updateLocalStorageWithToken(data.token);
			$location.path( "/bookmark" );
			})
		.error(function (data, status, headers, config) {
			// Erase the token if the user fails to log in
			delete $window.localStorage.token;
			delete $window.localStorage.user;
			$rootScope.isAuthenticated = false;

			// Handle login errors here
			$scope.error = 'Error: Invalid user or password';
			$scope.welcome = '';
			});
	};

	$scope.refreshToken = function () {
		$http
		.post('/api/refreshtoken')
		.success(function (data, status, headers, config) {
			updateLocalStorageWithToken(data.token);
			console.log('token refreshed.');
		})
		.error(function (data, status, headers, config) {
			// Erase the token if the user fails to log in
			delete $window.localStorage.token;
			delete $window.localStorage.user;
			$rootScope.isAuthenticated = false;

			console.log('error in refreshing token');
			$scope.error = 'Error: Error refreshing token';
			$scope.welcome = '';
			});
	};

	$scope.logout = function () {
		// console.log('logout');
		$scope.welcome = '';
		$scope.message = '';
		$rootScope.isAuthenticated = false;
		delete $window.localStorage.token;
		delete $window.localStorage.user;
		$scope.profile = {};
		$location.path('/');
	};

	$scope.handleServerError = function () {

	};

	loginRedirect = function() {
		var path = $location.path();
		if ($window.localStorage.token) {
			if (path != '' && path != '/') {
				$location.path('/bookmark');
			}
		}
		else {
			if (path != '' && path != '/') {
				$location.path('/login');
			}
		}
	};

	$scope.$on('$routeChangeStart', function (next, current) {
		checkTokenExpiration();
	});

	$scope.$on('auth-not-authenticated', function() {
		loginRedirect()
	});

	$scope.$on('auth-session-timeout', function() {
		loginRedirect()
	});

	$scope.$on('auth-not-authenticated', function() {
		loginRedirect()
	});

	$scope.$on('auth-token-expiring', function() {
		console.log('auth-token-expiring');
		$scope.refreshToken();
	});

	loginRedirect();

})


.config(function($routeProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : '/js/pages/landing.html'
		})

		.when('/login', {
			templateUrl : '/js/pages/login.html'
		})

		.when('/bookmark', {
			templateUrl : '/js/bookmark/index.html',
			controller  : 'BookmarkCtrl'
		})


})

.directive('ngReallyClick', [function() {
		return {
				restrict: 'A',
				link: function(scope, element, attrs) {
						element.bind('click', function() {
								var message = attrs.ngReallyMessage;
								if (message && confirm(message)) {
										scope.$apply(attrs.ngReallyClick);
								}
						});
				}
		}
}]);

