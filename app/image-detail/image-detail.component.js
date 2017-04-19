'use strict';

// Register `imageDetail` component, along with its associated controller and template
angular.
module('imageDetail').
component('imageDetail', {
    templateUrl: 'image-detail/image-detail.template.html',
    controller: ['$http', '$routeParams', function ImageDetailController($http, $routeParams) {
        var self = this;

        $http.get('image-info/' + $routeParams.imageId + '.json').then(function(response) {
            self.image = response.data;
        });

        // $http.get('image-info/img_3912id.json').then(function(response) {
        //     self.image = response.data;
        // });

        $http.get('/users').then(function(stuff) {
            self.user = stuff.data;
        });
    }]
});
