'use strict';

(function(){

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var setupOpen = document.querySelector('.setup-open-icon');
  var setupClose = document.querySelector('.setup-close');
  var setup = document.querySelector('.setup');

  // console.log( setupOpen, setupClose, setup );

   var openPopup = function(){
    setup.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress );
  };
  var closePopup = function(){
    setup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress );
  };
  var onPopupEscPress = function(e){
    if(e.keyCode === ESC_KEYCODE ){
      closePopup();
    }
  };

  setupOpen.addEventListener( 'click', function(){
    openPopup();
  });

  setupOpen.addEventListener( 'keydown', function(e){
    if( e.keyCode === ENTER_KEYCODE ){
      openPopup();
    }
  });
  setupClose.addEventListener( 'click', function(){
    closePopup();
  });
  setupClose.addEventListener( 'keydown', function(e){
    if( e.keyCode === ENTER_KEYCODE){
      closePopup();
    }
  });

  // Form validation
  var userNameInput = setup.querySelector('.setup-user-name');
  userNameInput.addEventListener('invalid', function(e){
    if(userNameInput.validity.tooShort){
      userNameInput.setCustomValidity('Имя должно состоять минимум из 2-х символов');
    }
    else if( userNameInput.validity.tooLong){
      userNameInput.setCustomValidity('Имя не должно превышать 25-ти символов');
    }
    else if( userNameInput.validity.valueMissing){
      userNameInput.setCustomValidity('Обязательное поле !!!');
    }
  });

  // Form sending
  var userDialog = document.querySelector('.setup');
  var form = userDialog.querySelector('.setup-wizard-form');

  form.addEventListener('submit', function(evt){
    evt.preventDefault();

    window.upload( new FormData(form), function(response){
      userDialog.classList.add('hidden');
      // console.log( response );
      alert("Form sent successfully \n" + JSON.stringify(response) );
    });

  });

})();