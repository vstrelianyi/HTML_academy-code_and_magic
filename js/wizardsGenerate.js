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
  var colorCoat = [ "rgb(101, 137, 164)", "rgb(241, 43, 107)", "rgb(146, 100, 161)", "rgb(56, 159, 117)", "rgb(215, 210, 55)", "rgb(0, 0, 0)"];
  var colorEyes = [ "black", "red", "blue", "yellow", "green" ];

  var generateWizards = function( targetArray, namesAmount, namesArray, surnamesArray, colorCoatArray, colorEyesArray ){
    for( var i = 0; i <= namesAmount - 1; i++ ){
      var nameIndex =  Math.round( Math.random() * (namesArray.length - 1) );
      var surnameIndex =  Math.round( Math.random() * ( surnamesArray.length -1 ) );
      var colorCoatIndex =  Math.round( Math.random() * ( colorCoatArray.length -1 ) );
      var colorEyesIndex = Math.round( Math.random() * ( colorEyesArray.length -1) );
      targetArray[i] = {
        name: namesArray[nameIndex] + " " + surnamesArray[surnameIndex],
        colorCoat: colorCoatArray[colorCoatIndex],
        colorEyes: colorEyesArray[colorEyesIndex]
      };
    }
  };

  //export wizards to global
  window.wizards = [];
  generateWizards( window.wizards, 4, names, surnames, colorCoat, colorEyes );

})();