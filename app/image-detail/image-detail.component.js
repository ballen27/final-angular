'use strict';

// Register `imageDetail` component, along with its associated controller and template
angular.
    module('imageDetail').
    component('imageDetail', {
    templateUrl: 'image-detail/image-detail.template.html',
    controller: ['$http', function ImageDetailController($http) {
        var self = this;

        $http.get('image-info/images.json').then(function(response) {
            self.images = response.data;
        });
    }]
});
