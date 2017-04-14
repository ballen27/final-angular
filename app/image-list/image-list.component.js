'use strict';

// Register `imageList` component, along with its associated controller and template
angular.
  module('imageList').
  component('imageList', {
    templateUrl: 'image-list/image-list.template.html',
    controller: ['$http', function ImageListController($http) {
        var self = this;

        $http.get('image-info/images.json').then(function(response) {
            self.images = response.data;
        });
    }]
  });
