'use strict';

(function(){

  // Form sending
  var userDialog = document.querySelector('.setup');
  var form = userDialog.querySelector('.setup-wizard-form');

  var onSuccess = function( response ){
    userDialog.classList.add('hidden');
    alert( 'Данные успешно отправлены \n' + JSON.stringify(response) );
  };

  var onError = function(message){
    console.error( message );
  };

  form.addEventListener('submit', function(evt){
    evt.preventDefault();

    // way 1
    // window.upload( new FormData(form), function(response){
    //   userDialog.classList.add('hidden');
    //   console.log( response );
    //   alert("Form sent successfully \n" + JSON.stringify(response) );
    // });

    window.backend.save( new FormData(form), onSuccess, onError );

  });

})();