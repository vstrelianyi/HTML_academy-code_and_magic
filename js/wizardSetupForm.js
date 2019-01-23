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

})();