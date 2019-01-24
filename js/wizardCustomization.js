'use strict';

(function(){

  var setup = document.querySelector('.setup');

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

  var updateSimilarWizardsList = function(){
    window.renderSimilarWizardsList( window.createSimilarWizardsList(window.wizardsExternal) );
  };

  setupWizardCoat.addEventListener( 'click', updateSimilarWizardsList );
  setupWizardEyes.addEventListener( 'click', updateSimilarWizardsList );
  setupWizardFireball.addEventListener( 'click', updateSimilarWizardsList );



})();