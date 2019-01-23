'use strict';

(function(){

  // Form sending
  var userDialog = document.querySelector('.setup');
  var form = userDialog.querySelector('.setup-wizard-form');

  form.addEventListener('submit', function(evt){
    evt.preventDefault();

    // way 1
    // window.upload( new FormData(form), function(response){
    //   userDialog.classList.add('hidden');
    //   console.log( response );
    //   alert("Form sent successfully \n" + JSON.stringify(response) );
    // });

    window.backend.save( new FormData(form) );

  });

})();