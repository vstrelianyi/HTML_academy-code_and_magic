'use strict';

var setupOpen = document.querySelector('.setup-open-icon');
var setupClose = document.querySelector('.setup-close');
var setup = document.querySelector('.setup');
console.log( setupOpen, setupClose, setup );

var onSetupOpenClick = function(){
  // document.querySelector('.setup-similar').classList.remove('hidden');
};

var onSetupCloseClick = function(){
  // document.querySelector('.setup-similar').classList.add('hidden');
};

var openPopup = function(){
  setup.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress );
};
var closePopup = function(){
  setup.classList.add('hidden');
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

// список похожих персонажей
var wizards = [
  {
    name : 'Пендольф' ,
    coatColor : 'red'
  },
  {
    name : 'Марио' ,
    coatColor : 'yellow'
  },
  {
    name : 'Шао Кан' ,
    coatColor : 'green'
  },
  {
    name : 'Баба Яга' ,
    coatColor : 'blue'
  }
];

// var similarListElement = document.querySelector('.setup-similar-list');
// var similarWizardTemplate = document.querySelector('#similar-wizard-template').content.querySelector('.setup-similar-item');

for( var i =0; i< wizards.length ; i++){
  var wizardElement = similarWizardTemplate.cloneNode(true);
  wizardElement.querySelector('.setup-similar-label').textContent = wizards[i].name;
  wizardElement.querySelector('.wizard-coat').style.fill = wizards[i].coatColor;
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
