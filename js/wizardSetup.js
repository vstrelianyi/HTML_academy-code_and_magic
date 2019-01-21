'use strict';

(function(){
  var setupOpen = document.querySelector('.setup-open-icon');
  var setupClose = document.querySelector('.setup-close');
  var setup = document.querySelector('.setup');
  var setupSimilar = document.querySelector('.setup-similar');
  // console.log( setupOpen, setupClose, setup );

   var openPopup = function(){
    setup.classList.remove('hidden');
    setupSimilar.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress );
  };
  var closePopup = function(){
    setup.classList.add('hidden');
    setupSimilar.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress );
  };
  var onPopupEscPress = function(e){
    if(e.keyCode ===27){
      closePopup();
    }
  };

  setupOpen.addEventListener( 'click', openPopup );
  setupOpen.addEventListener( 'keydown', function(e){
    if(e.keyCode===13){
      openPopup();
    }
  });
  setupClose.addEventListener( 'click', closePopup );
  setupClose.addEventListener( 'keydown', function(e){
    if(e.keyCode===13){
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
      console.log( response );
    });

  });

  // wizard customization
  var coatColors = [ "rgb(101, 137, 164)", "rgb(241, 43, 107)", "rgb(146, 100, 161)", "rgb(56, 159, 117)", "rgb(215, 210, 55)", "rgb(0, 0, 0)"];
  var eyesColors = [ "black", "red", "blue", "yellow", "green" ];
  var fireballColors = [ "#ee4830", "#30a8ee", "#5ce6c0" , "#e848d5" , "#e6e848"];

  var setupWizardCoat = setup.querySelector('.wizard-coat');
  var setupWizardEyes = setup.querySelector('.wizard-eyes');
  var setupWizardFireball = setup.querySelector('.setup-fireball-wrap');

  var changeCoatColor = function( evt ){
    var randomIndex = Math.round( Math.random() * ( coatColors.length -1 ) );
    setupWizardCoat.style.fill = coatColors[randomIndex];
    setup.querySelector('[name="coat-color"]').value = coatColors[randomIndex];
  };

  var changeWizardEyesColor = function( evt ){
    var randomIndex = Math.round( Math.random() * ( eyesColors.length -1 ) );
    setupWizardEyes.style.fill = eyesColors[randomIndex];
    setup.querySelector('[name="eyes-color"]').value = eyesColors[randomIndex];
  };

  var changeWizardFireballColor = function( evt ){
    var randomIndex = Math.round( Math.random() * ( fireballColors.length -1 ) );
    setupWizardFireball.style.backgroundColor = fireballColors[randomIndex];
    setup.querySelector('[name="fireball-color"]').value = fireballColors[randomIndex];
  };

  setupWizardCoat.addEventListener( 'click', changeCoatColor );
  setupWizardEyes.addEventListener( 'click', changeWizardEyesColor );
  setupWizardFireball.addEventListener( 'click', changeWizardFireballColor );

})();