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

// ÑÐ¿Ð¸ÑÐ¾Ðº Ð¿Ð¾ÑÐ¾Ð¶Ð¸Ñ Ð¿ÐµÑÑÐ¾Ð½Ð°Ð¶ÐµÐ¹
var wizards = [
  {
    name : 'ÐÐµÐ½Ð´Ð¾Ð»ÑÑ' ,
    coatColor : 'red'
  },
  {
    name : 'ÐÐ°ÑÐ¸Ð¾' ,
    coatColor : 'yellow'
  },
  {
    name : 'Ð¨Ð°Ð¾ ÐÐ°Ð½' ,
    coatColor : 'green'
  },
  {
    name : 'ÐÐ°Ð±Ð° Ð¯Ð³Ð°' ,
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
    userNameInput.setCustomValidity('ÐÐ¼Ñ Ð´Ð¾Ð»Ð¶Ð½Ð¾ ÑÐ¾ÑÑÐ¾ÑÑÑ Ð¼Ð¸Ð½Ð¸Ð¼ÑÐ¼ Ð¸Ð· 2-Ñ ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²');
  }
  else if( userNameInput.validity.tooLong){
    userNameInput.setCustomValidity('ÐÐ¼Ñ Ð½Ðµ Ð´Ð¾Ð»Ð¶Ð½Ð¾ Ð¿ÑÐµÐ²ÑÑÐ°ÑÑ 25-ÑÐ¸ ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²');
  }
  else if( userNameInput.validity.valueMissing){
    userNameInput.setCustomValidity('ÐÐ±ÑÐ·Ð°ÑÐµÐ»ÑÐ½Ð¾Ðµ Ð¿Ð¾Ð»Ðµ');
  }
});
