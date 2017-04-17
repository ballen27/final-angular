/**
 * Created by brons on 4/14/2017.
 */
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
        // when('/images/:imageId', {
        //     template: '<image-detail></image-detail>'
        // }).
        otherwise('/images');
    }
]);
