// Create a new object that just contains the passed in value as a member variable
function TableRow (text) {
  this.content = text
}

var module = angular.module('module', [])

.controller('Controller1', ['$scope', function ($scope) {
    $scope.butter = "Test Me!!"
    $scope.bread = new TableRow('bread')
    //console.log ($scope.bread.content)
}])
.controller('Controller2', ['$scope', function ($scope) {
    $scope.butter = "Test Two!"
    $scope.cream = 'Cherry Cream'
    $scope.items = ['Ferrari', 'Sunglasses', 'Badge']
    $scope.greenLettuce = {name: 'Green Lettuce', calories: 25}
    $scope.darkerGreenLettuce = {name: 'Darker Green Lettuce', calories: 35}
    
    $scope.submit = function () {
      $scope.items.push($scope.newItem)
      $scope.newItem = '';
    }
    $scope.remove = function (index) {
      $scope.items.splice (index, 1)
    }  

    $scope.$watch('butter', function(value, old) {
      console.log ('watch triggered with new value: ' + value)
    })
}])

.controller('Controller3', ['$scope', function ($scope) {
    $scope.butter = "I am a third level dream."
    $scope.pepper = 99
    $scope.info = 'I am the parent scope content, I am good!!'
    $scope.checkBoxes = []
    $scope.cards = [
      {
        face: 'Jack',
        filter: ''
      }, 
      {
        face: '125.2200',
        filter: 'currency'
      },
      {
        face: '03/15/2013',
        filter: 'date'
      },
      {
        face: '144.780000',
        filter: 'reverse'
      }                   
    ]

    $scope.messageMe = function (message) {
      alert (message);
    }

    $scope.inputBoxFocus = function () {
      console.log ('input box focus')
      $scope.openInput()
    }

    $scope.focusOnMonths = false
    $scope.openInput = function () {
      console.log ('open 2')
      $scope.focusOnMonths = true
    };

    $scope.closeInput = function () {
      console.log ('close')
      $scope.focusOnMonths = false
      // http://plnkr.co/edit/ts3EMoaqMhjxmbD13Jcz?p=preview
    };    
}])

.directive('testDirective', function () {
    // Just a very simple directive to use for scope example
    return {
        restrict: 'E',     // restrict to only match on element names
        scope: {           // isolate scope
          lettuce: "=info" // this binds different scope based on the info attribute
                           // In this way, you can pass in models to a 
                           // directive that is using the isolate scope.
                           // Best Practice: Use the scope option to create 
                           // isolate scopes when making components that you 
                           // want to reuse throughout your app.
        },
        template: "<br>Directive: {{lettuce.name}} has {{lettuce.calories}} calories."   
                  // Normally, this would be in an
                  // external file, but don't know how to do this in JSFiddle.
    }
})
.directive('anotherDir', function() {
  //   https://docs.angularjs.org/guide/directive
  //   http://stackoverflow.com/questions/20018507/angularjs-what-is-the-need-of-the-directives-link-function-when-we-already-had
  //   http://jasonmore.net/angular-js-directives-difference-controller-link/
  return {
    restrict: 'A',     // restrict to only attribute directives
    template: "I see this: {{val}} and have this object: {{bread.content}}",
    scope: {          // isolate scope, pulls in nothing from the parent 
                      //  scope when empty.
    },    
    link: function(scope, element, attrs) {
      console.log('link ran')
      //console.log (attrs)

      scope.val = attrs.anotherDir
      scope.bread = new TableRow('bread absorbs ' + scope.val)

    }
  }
})
.directive('callOut', function () {
    // Just a very simple directive to use for scope example
    return {
        scope: {           // isolate scope
          call: "&" // The & binding allows a directive to trigger evaluation 
                    //of an expression in the context of the parent scope, at 
                    // a specific time.
        },
        template: '<button ng-click="call()">Call Out {{name}}</button>',   
                  // Normally, this would be in an
                  // external file, but don't know how to do this in JSFiddle.
        link: function (scope, element, attrs) {
          scope.name = attrs.name
        }
    }
})
.directive('aDialog', function() {
  return {
    restrict: 'E',
    transclude: true,  // The transclude option changes the way scopes are nested. 
                       // It makes it so that the contents of a transcluded 
                       // directive have whatever scope is outside the directive, 
                       // rather than whatever scope is on the inside. In doing so, 
                       // it gives the contents access to the outside scope.
                       // Best Practice: only use transclude: true when you want 
                       // to create a directive that wraps arbitrary content.
    scope: {},        // Note isolate scope, remove this and you do not get
                      // transclude, info shows up from link function.
    template: '<div class="alert" ng-transclude></div>',
    // controller: function($scope){
    //   $scope.info = 'Should not be seeing this!'
    // }
    link: function (scope, element, attrs) {
      scope.info = 'Should not be seeing this!'
    }
  };
})
.directive('focusMe', function($timeout) {
  // based on demo:   http://plnkr.co/edit/LbHRBB?p=preview
  return {
    link: function(scope, element, attrs) {
      var model = attrs.focusMe;
      scope.$watch(model, function(value) {    // Will set a watch on focusOnMonths
        console.log ('watch tr ' + value)
         if(value === true) {
          console.log ('setting timeout')
           $timeout(function() {
             element[0].focus(); 
           } )
         }
         if (value === false) {
           console.log ('was false')
            $timeout(function() {
              console.log ('setting false timeout')
              scope.focusOnMonths = false;
              element[0].blur();
            }, 100 )   // BUG FIX:  Temp patch to fix repeated state shifting noted below
         }
      });
      element.bind('blur', function() {   // Catch user action blur
        // BUG FIX:  Repeated state shifting / events when user unchecks the box.
        console.log ('blur')
        scope.focusOnMonths = false;
        scope.$apply()
        //scope.closeInput()
      })
      element.bind('focus', function() {  // Catch user action focus
        console.log ('focus 1')
        scope.focusOnMonths = true;
        scope.$apply()
        //scope.closeInput()
      })      
    }
  };
})
.filter('namedFilter', function($filter) {
  // return a function that accepts a value and a filter name, see return below for details.
  // This works because pipe takes an Angular expression, as in this format:
  //  someValue | rsFilter:item.type.filter      where item.type.filter is 'currency' or 'date', etc.
  return function(value, filterName) {
    //console.log ('FILTER: ' + value + filterName)
    if (filterName.length == 0) return value
    return $filter(filterName)(value);   // invokes the named filter function on the value and returns it
  };
})
.filter('reverse', function() {
  return function(input, uppercase) {
    input = input || '';
    var out = "";
    for (var i = 0; i < input.length; i++) {
      out = input.charAt(i) + out;
    }
    // conditional based on optional argument
    if (uppercase) {
      out = out.toUpperCase();
    }
    return out;
  };
})

// https://github.com/angular/angular.js/wiki/Understanding-Directives
// http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
// http://www.sitepoint.com/understanding-angulars-apply-digest/
// http://plnkr.co/edit/ts3EMoaqMhjxmbD13Jcz?p=preview
// http://jsfiddle.net/31qgzfvk/1/

