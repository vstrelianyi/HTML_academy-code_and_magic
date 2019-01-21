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

  var similarListElement = document.querySelector('.setup-similar-list');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');

  for( var i =0; i< wizards.length ; i++){
    var wizardElement = similarWizardTemplate.cloneNode(true);
    wizardElement.querySelector('.setup-similar-label').textContent = wizards[i].name;
    wizardElement.querySelector('.wizard-coat').style.fill = wizards[i].coatColor;
    wizardElement.querySelector('.wizard-eyes').style.fill = wizards[i].eyesColor;
    similarListElement.appendChild(wizardElement);
  }

  // form validation
  var userNameInput = setup.querySelector('.setup-user-name');
  userNameInput.addEventListener('invalid', function(e){
    if(userNameInput.validity.tooShort){
      userNameInput.setCustomValidity('Имя должно состоять минимум из 2-х символов');
    }
    else if( userNameInput.validity.tooLong){
      userNameInput.setCustomValidity('Имя не должно превышать 25-ти символов');
    }
    else if( userNameInput.validity.valueMissing){
      userNameInput.setCustomValidity('Обязательное поле');
    }
  });
})();