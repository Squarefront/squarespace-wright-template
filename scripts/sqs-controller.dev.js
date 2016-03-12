(function(window, document) {
  
  // weed out the bad browsers
  if (!document.querySelector) {
    return;
  }

  var DEBUG = false;
  
  // -------------
  
  var FPS = 10; // eyes

  document.addEventListener('DOMContentLoaded', function() {
    var throttled = null;

    Injector.register('$requestSqsControllerSync', function() {
      if (throttled !== null) {
        return; // window.clearTimeout(throttled);
      }
    
      throttled = window.setTimeout(function() {
        throttled = null;
        synchronizeControllers();
      }, 1000 / FPS); // eyes
    });
    
    synchronizeControllers();
  });
  
  // -------------
  
  var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  
  var Injector = {
    dependencies: {},
    
    process: function(target, extras) {
      var args;
      var functionToInvoke = target;

      if (target instanceof Array) {
        args = target.slice(0, target.length - 1);
        functionToInvoke = target[target.length - 1];
      } else {
        args = target.toString().match(FN_ARGS)[1].split(',').map(function(val) {
          return val.trim();
        });
      }
      
      try {
        functionToInvoke.apply(functionToInvoke, this.getDependencies(args, extras));
      } catch (e) {
        console.error('ERROR!', e);
      }
    },
    
    getDependencies: function(arr, extras) {
      var self = this;
      if (!extras) {
        extras = {};
      }

      return arr.map(function(value) {
        var result = self.dependencies[value] || extras[value];

        if (self.dependencies.hasOwnProperty(value)) {
          return self.dependencies[value];
        } else if (extras.hasOwnProperty(value)) {
          return extras[value];
        } else {

          console.warn('Could not locate dependency with name:', value);

          return null;
        }
      });
    },
    
    register: function(name, dependency) {
      if (this.dependencies[name]) {
        console.warn('Over writing existing registration of the dependency named: ' + name);
      }

      this.dependencies[name] = dependency;
    }
  };
  
  // -------------
  
  var _liveControllers = [];
  
  function synchronizeControllers() {

    var nodesThatHaveACntrl = Array.prototype.slice.call(document.querySelectorAll('[sqs-controller]'), 0);
    
    var nodesDiscovered = [];
    
    nodesThatHaveACntrl.forEach(function(node) {
      nodesDiscovered.push(node);
    });
    
    var cntrlToBeCleaned = [];
    
    _liveControllers.forEach(function(cntrl) {
      if (nodesDiscovered.indexOf(cntrl.element) === -1) {
        cntrlToBeCleaned.push(cntrl);
      } else {
        nodesDiscovered.splice(nodesDiscovered.indexOf(cntrl.element), 1);
      }
    });
    
    if (nodesDiscovered.length === 0) {
      if (DEBUG) {
        console.log('quiet cycle');
      }
    }
    
    nodesDiscovered.forEach(function(element) {
      element.getAttribute('sqs-controller').split(',').forEach(function(cntrlName) {

        var foundPath = ['window'];

        var ctor = cntrlName.trim().split('.').reduce(function(prevVal, name) {
          if (!prevVal) {
            return prevVal;
          }
          
          var newVal = prevVal[name];

          if (newVal) {
            foundPath.push(name);
          }

          return newVal;

        }, window);
        
        if (ctor === window || !ctor) {
          console.error('Could not locate controller with name: ' + cntrlName + '. Last valid path parsed: ' + foundPath.join('.'));
          return;
        }
        
        var instance = Injector.process(ctor, {
          element: element
        });

        var cntrl = {
          val: instance,
          element: element
        };
        
        if (DEBUG) {
          console.log('initialized!', element);
        }
        
        _liveControllers.push(cntrl);

      });

      element.classList.add('sqs-controller-binded');

    });
    
    cntrlToBeCleaned.forEach(function(cntrl) {
      if (DEBUG) {
        console.log('needs to be gced', cntrl);
      }
    });

  }

})(window, document);