(function(){

  var setup = document.querySelector('.setup');

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

})();