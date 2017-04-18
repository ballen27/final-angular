'use strict';

// Define the `finalApp` module
angular.module('finalApp', [
  // ...which depends on the `imageList` module
    'ngRoute',
    'imageDetail',
    'imageList'
]);
