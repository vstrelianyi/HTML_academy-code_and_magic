'use strict';
(function(){
  window.removeChildNodes = function( parentNode ){
    var myNode = document.querySelector( parentNode );
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  };
})();