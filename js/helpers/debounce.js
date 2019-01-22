'use strict';

(function(){
  window.debounce = function( fun, debounceInterval ){
    var lastTimeout = null;
    var DEBOUNCE_INTERVAL = debounceInterval || 500; // ms

    return function(){
      var args = arguments;
      if (lastTimeout){
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout( function(){
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL );
    };
  };

})();