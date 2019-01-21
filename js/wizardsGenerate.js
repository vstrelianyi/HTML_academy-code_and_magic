'use strict';

(function(){


  // список похожих персонажей
  // var wizards = [
  //   {
  //     name : 'Пендольф' ,
  //     coatColor : 'red'
  //   },
  //   {
  //     name : 'Марио' ,
  //     coatColor : 'yellow'
  //   },
  //   {
  //     name : 'Шао Кан' ,
  //     coatColor : 'green'
  //   },
  //   {
  //     name : 'Баба Яга' ,
  //     coatColor : 'blue'
  //   }
  // ];


  var names = [ "Иван", "Хуан Себастьян","Мария","Кристоф", "Виктор","Юлия","Люпита","Вашингтон"];
  var surnames = [ "да Марья", "Верон","Мирабелла","Вальц", "Онопко","Топольницкая","Нионго","Ирвинг" ];
  var coatColors = [ "rgb(101, 137, 164)", "rgb(241, 43, 107)", "rgb(146, 100, 161)", "rgb(56, 159, 117)", "rgb(215, 210, 55)", "rgb(0, 0, 0)"];
  var eyesColors = [ "black", "red", "blue", "yellow", "green" ];

  window.wizards = [];

  var generateWizards = function( targetArray, namesAmount, namesArray, surnamesArray, coatColorsArray, eyesColorsArray ){
    for( var i = 0; i <= namesAmount - 1; i++ ){
      var nameIndex =  Math.round( Math.random() * (namesArray.length - 1) );
      var surnameIndex =  Math.round( Math.random() * ( surnamesArray.length -1 ) );
      var coatcolorsIndex =  Math.round( Math.random() * ( coatColorsArray.length -1 ) );
      var eyesColorIndex = Math.round( Math.random() * ( eyesColorsArray.length -1) );
      targetArray[i] = {
        name: namesArray[nameIndex] + " " + surnamesArray[surnameIndex],
        coatColor: coatColorsArray[coatcolorsIndex],
        eyesColor: eyesColorsArray[eyesColorIndex]
      };
    }
  };

  generateWizards( window.wizards, 4, names, surnames, coatColors, eyesColors );
})();