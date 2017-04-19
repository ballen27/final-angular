'use strict';

angular.
module('finalApp').
    config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
        when('/images', {
            template: '<image-list></image-list>'
        }).
        when('/admin', {
            templateUrl: 'admin.html'
        }).
        when('/images/:imageId', {
            template: '<image-detail></image-detail>'
        }).
        otherwise('/images');
    }
  ]);
