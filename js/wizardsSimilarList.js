'use strict';

(function(){

  document.querySelector('.setup-similar').classList.remove('hidden');

  var similarListElement = document.querySelector('.setup-similar-list');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template')
    .content
    .querySelector('.setup-similar-item');

  var renderWizard = function (wizard) {
    var wizardElement = similarWizardTemplate.cloneNode(true);
    wizardElement.querySelector('.setup-similar-label').textContent = wizard.name;
    wizardElement.querySelector('.wizard-coat').style.fill = wizard.colorCoat;
    wizardElement.querySelector('.wizard-eyes').style.fill = wizard.colorEyes;

    return wizardElement;
  };

  var onSuccessLoad = function(data){
    window.wizardsExternal = data.slice(0,4);

    var fragment = document.createDocumentFragment();
    for( var i =0; i< window.wizardsExternal.length ; i++){
      fragment.appendChild( renderWizard( window.wizardsExternal[i] ) );
    }
    similarListElement.appendChild( fragment );

    // console.log( window.wizardsExternal );
  };

  var onErrorLoad = function(message){
    console.error( message );
  };

  window.backend.load( onSuccessLoad , onErrorLoad );

  // var fragment = document.createDocumentFragment();
  // for( var i =0; i< window.wizards.length ; i++){
  //   fragment.appendChild( renderWizard( window.wizards[i] ) );
  // }
  // similarListElement.appendChild( fragment );

})();