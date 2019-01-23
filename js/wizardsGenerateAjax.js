'use strict';

(function(){

  var onSuccessUpload = function( response ){
    userDialog.classList.add('hidden');
    alert("Form sent successfully \n" + JSON.stringify(response) );
  };

})();