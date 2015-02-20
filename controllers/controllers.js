// ANGULAR / JAVASCRIPT EXAMPLE
//
// JAVASCRIPT OO EXAMPLE
// Create a new object that just contains the passed in value as a member variable
// This is a good way to simulate a class with members, also shows how to do private vars
// and inheritance.
// 

//  TableRow constructor function
function TableRow (text) {
  var mylen = text.length;     // private var
  this.content = text;         // instance var
  this.len = mylen.toString() + " chars.";  
  this.showMe = function () {  // instance method
    return '|*' + this.content + '*|'
  }
}

// Table Element constructor function
function TableElement (text, inherit) {
  this.item = text;
  this.__proto__ = inherit;   // supported in Firefox, Chrome, and IE 11, 
                              // standard in upcoming ECMA6.  This is faster than using .prototype
                              // http://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript
  this.showMe = function () {
    return '(' + this.item + ')';
  }
  this.showAll = function () {
    return '(' + this.item + ')' + this.__proto__.showMe();  // specifically call a method on super
  }  
  this.showLength = function () {
    return this.len;   // goes up the proto chain to get this property
  }
}

var firstTR = new TableRow('It all starts here');
var firstElement = new TableElement ('a Cell of data', firstTR);  // inheritance happens here
console.log ('Inheritance testing:');
console.log (firstTR.mylen);             // undefined, private var
console.log (firstElement.item);         // a public property on the object
console.log (firstElement.showMe());     // call "instance method" on the object
console.log (firstElement.showAll());    // instance method that accesses up the proto chain
console.log (firstElement.showLength()); // instance method that accesses up the proto chain
console.log ('***  End  ***');

// END JAVASCRIPT OO EXAMPLE



angular.module('module', [])



//  Better to use the controller as view syntax instead of setting a controller for a div
//  https://github.com/johnpapa/angularjs-styleguide#table-of-contents       ****  STYLE GUIDE
.controller('Controller1', ['$scope', function ($scope) { 
  // ** You can define a controller for a div or element.
  // ** You can also define a controller for a directive, and then inject that into other directives:
  // ** http://www.bennadel.com/blog/2446-using-controllers-in-directives-in-angularjs.htm
  // ** http://www.bennadel.com/blog/2709-directive-controllers-can-use-dependency-injection-in-angularjs.htm
  // ** http://icelab.com.au/articles/an-all-in-one-directive-controller-with-angularjs/
  // NOTE:  better to use a named function here and use a ViewModel var instead of injecting $scope (see style guide)
  $scope.butter = "Test Me!!"
  $scope.bread = new TableRow('bread')
  //console.log ($scope.bread.content)
}])
.controller('Controller2', ['$scope', function ($scope) {
  // NOTE:  better to bind these model vars to a ViewModel var instead of $scope, as in style guide.
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

  $scope.messageMe = function (message) {
    alert (message);
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
    },
    {
      face: 'The War is Over!!',
      filter: 'capitalize'
    }                           
  ]
  $scope.lastCard = 'If you can Read me, it did not work.';

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


// Make a directive for a table row that includes an input for a number.  Use a filter on it that 
// restricts to numbers and keeps the value between the set params (such as 1 to 100).
// Each directive should keep its own model value (number) and include a getter but not setter.
// Make a second directive that keeps a running total for all rows.  
// NOTE:  directives make more sense as components or widgets, and to do all DOM manipulation in a
//        directive.
.directive('testDirective', function () {
  // Just a very simple directive to use for scope example
  // Returns the Directive Definition Object
  return {
      restrict: 'E',     // restrict to only match on element names
      scope: {           // Isolate scope
        lettuce: "=info" // this binds different scope based on the info attribute
                         // In this way, you can pass in models to a 
                         // directive that is using the isolate scope.
                         // Best Practice: Use the scope option to create 
                         // isolate scopes when making components that you 
                         // want to reuse throughout your app.
                         // This way, they will not interfere with each other.
                         // See here: 
                         // https://umur.io/angularjs-directives-using-isolated-scope-with-attributes/
      },
      // lettuce below actually refers to the passed-in model name, ie
      // greenLettuce or darkerGreenLettuce in the controller.
      template: "<br>Directive: {{lettuce.name}} has {{lettuce.calories}} calories."   
                // Normally, this would be in an
                // external file, but this is small so will keep it here.
  }
})
.directive('anotherDir', function() {
  // Demonstrates an attribute type directive that passes in a string as the value
  // of the directive and then uses a link function for some processing.
  //   https://docs.angularjs.org/guide/directive
  //   http://stackoverflow.com/questions/20018507/angularjs-what-is-the-need-of-the-directives-link-function-when-we-already-had
  //   http://jasonmore.net/angular-js-directives-difference-controller-link/
  return {
    restrict: 'A',     // restrict to only attribute directives
    template: "I see this: {{val}} and have this object: {{bread.showMe()}}",  
                                          // could also be {{bread.content}}
    scope: {          // isolate scope, pulls in nothing from the parent 
                      //  scope when empty.
    },    
    link: function(scope, element, attrs) {
      console.log('link ran, attrs:')
      console.log (attrs)

      scope.val = attrs.anotherDir  // get the value of this directive
      scope.bread = new TableRow('bread absorbs ' + scope.val)  // Create an
                           // object that 'polishes' the data in some way.

    }
  }
})
.directive('callOut', function () {
  // Create a more elaborate directive that takes an Angular expression as
  // an attribute and then invokes that expression based on an event. 
  return {
      scope: {           // isolate scope
        call: "&" // The & binding allows a directive to trigger evaluation 
                  //of an expression in the context of the parent scope, at 
                  // a specific time.
                  // The angular expression that this attribute is bound to
                  // will be evaluated in the context of the parent scope.
                  // (Controller 2, and will be messageMe)
                  // This is shorthand notation for call: "&call"
                  // If two way binding is used (=) this gets executed on
                  // every link cycle.
      },
      template: '<button ng-click="call()">Call Out {{name}}</button>',   
      link: function (scope, element, attrs) {
        scope.name = attrs.name  // set a var on local scope based on attr value
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
  // This directive controls focus of another element entirely through a link
  // function.  The attribute that is passed in becomes the model to watch for
  // changes.  
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
  // $filter above is a dependency that gets injected
  return function(value, filterName) {
    if (filterName.length == 0) return value;
    return $filter(filterName)(value);   // invokes the named filter function on the value and returns it
  };
})
.filter('reverse', function() {
  // a custom filter to reverse a string
  return function(input) {
    input = input || '';
    var out = "";
    for (var i = 0; i < input.length; i++) {
      out = input.charAt(i) + out;
    }
    return out;
  };
})
.filter ('capitalize', function() {
  // Simple custom filter to capitalize something
  return function (input) {
    return input.toUpperCase();
  }
})



// Make a directive for a table row that includes an input for a number.  Use a filter on it that 
// restricts to numbers and keeps the value between the set params (such as 1 to 100).
// Each directive should keep its own model value (number) and include a getter but not setter.
// Make a second directive that keeps a running total for all rows.  

// Create a standard directive template by creating something that works in a table (for each row and data elements), for
// custom headers, and for the whole table itself to be like a template. 
// Also create a "widget", such as a simple input field with validation, add multiples to a page in different places,
// And then create a directive that aggregates those individual widgets in some way (such as totaling).  Let this directive
// query all the others for their results.  With all this, I will have some very useable software components.

// A great sample directive from John Papa Style guide:  https://github.com/johnpapa/angularjs-styleguide#style-y075
// https://github.com/johnpapa/angularjs-styleguide#style-y076
// Generally you will have a link function or a controller but not both.
// Controller code runs before compilation of the HTML, link runs after.
// http://jasonmore.net/angular-js-directives-difference-controller-link/
// https://docs.angularjs.org/guide/directive 
    // <div my-example max="77"></div>
    // angular
    //     .module('app')
    //     .directive('myExample', myExample);

    // function myExample() {
    //     var directive = {
    //         restrict: 'EA',
    //         templateUrl: 'app/feature/example.directive.html',
    //         scope: {
    //             max: '='
    //         },
    //         link: linkFunc,
    //         controller: ExampleController,
    //           controllerAs: 'vm',
    //           bindToController: true // because the scope is isolated
    //       };

    //     return directive;

    //     function linkFunc(scope, el, attr, ctrl) {
    //         console.log('LINK: scope.min = %s *** should be undefined', scope.min);
    //         console.log('LINK: scope.max = %s *** should be undefined', scope.max);
    //         console.log('LINK: scope.vm.min = %s', scope.vm.min);
    //         console.log('LINK: scope.vm.max = %s', scope.vm.max);
    //     }
    // }

    // ExampleController.$inject = ['$scope'];

    // function ExampleController($scope) {
    //     // Injecting $scope just for comparison
    //     var vm = this;

    //     vm.min = 3;

    //     console.log('CTRL: $scope.vm.min = %s', $scope.vm.min);
    //     console.log('CTRL: $scope.vm.max = %s', $scope.vm.max);
    //     console.log('CTRL: vm.min = %s', vm.min);
    //     console.log('CTRL: vm.max = %s', vm.max);
    // }
    // <!-- example.directive.html -->
    // <div>hello world</div>
    // <div>max={{vm.max}}<input ng-model="vm.max"/></div>
    // <div>min={{vm.min}}<input ng-model="vm.min"/></div>

// https://github.com/angular/angular.js/wiki/Understanding-Directives
// http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
// http://www.sitepoint.com/understanding-angulars-apply-digest/
// http://plnkr.co/edit/ts3EMoaqMhjxmbD13Jcz?p=preview
// http://jsfiddle.net/31qgzfvk/1/

