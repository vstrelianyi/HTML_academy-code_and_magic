'use strict';

(function(){

  document.querySelector('.setup-similar').classList.remove('hidden');

  var similarListElement = document.querySelector('.setup-similar-list');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template')
    .content
    .querySelector('.setup-similar-item');

  window.createSimilarWizardsList = function( wizardsList ){
    var currentWizardParams = window.getCurrentWizardParameters();
    window.setSimilarWizardsRatings( wizardsList , ['colorCoat', 'colorEyes', 'colorFireball'], currentWizardParams, [3,2,1] );
    window.sortWizardsByRating( wizardsList, 'rating', 'asc' );
    window.wizardsExternalShortList = window.wizardsExternal.slice(0,4);
    return window.wizardsExternalShortList;
  };

  var renderWizard = function (wizard) {
    var wizardElement = similarWizardTemplate.cloneNode(true);
    wizardElement.querySelector('.setup-similar-label').textContent = wizard.name;
    wizardElement.querySelector('.wizard-coat').style.fill = wizard.colorCoat;
    wizardElement.querySelector('.wizard-eyes').style.fill = wizard.colorEyes;

    return wizardElement;
  };

  window.renderSimilarWizardsList = function( arrayToRender ){
    window.removeChildNodes('.setup-similar-list');
    var fragment = document.createDocumentFragment();
    for( var i =0; i < arrayToRender.length ; i++){
      fragment.appendChild( renderWizard( arrayToRender[i] ) );
    }
    similarListElement.appendChild( fragment );
  }

  var onSuccessLoad = function(data){
    window.wizardsExternal = data;

    window.renderSimilarWizardsList( window.createSimilarWizardsList(window.wizardsExternal) );
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