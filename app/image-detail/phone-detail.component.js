'use strict';

// Register `phoneDetail` component, along with its associated controller and template
angular.
module('imageDetail').
component('imageDetail', {
    template: 'TBD: Detail view for <span>{{$ctrl.imageId}}</span>',
    controller: ['$routeParams',
        function ImageDetailController($routeParams) {
            this.imageId = $routeParams.imageId;
        }
    ]
});
