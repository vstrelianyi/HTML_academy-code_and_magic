'use strict';

(function(){

  window.getCurrentWizardParameters = function(){

    var setup = document.querySelector('.setup');
    var setupWizardCoat = setup.querySelector('.wizard-coat');
    var setupWizardEyes = setup.querySelector('.wizard-eyes');
    var setupWizardFireball = setup.querySelector('.setup-fireball-wrap');

    var setupWizardCoat = setup.querySelector('[name="coat-color"]').value;
    var setupWizardEyes = setup.querySelector('[name="eyes-color"]').value;
    var setupWizardFireball = setup.querySelector('[name="fireball-color"]').value;

    var paramsArray = [ setupWizardCoat , setupWizardEyes , setupWizardFireball];

    return paramsArray;
  };

  window.setSimilarWizardsRatings = function( array, searchKeys, searchKeyValues, ratingValues){
    array.forEach( function( arrayItem, arrIndex ){
      arrayItem.rating = 0;

      searchKeys.forEach( function( searchKeysItem, searchKeyindex ){

        if( arrayItem[searchKeysItem] === searchKeyValues[searchKeyindex] ){
          arrayItem.rating += ratingValues[searchKeyindex];
          // console.log( arrayItem.rating );
        }

      });

    });
  };

  window.sortWizardsByRating = function( array, sortKey, sortType){

    var compareStringsAsc = function(a, b){
      if( a[sortKey] < b[sortKey] ){
        return 1 ;
      }

      if( a[sortKey] > b[sortKey] ){
        return -1;
      }
      return 0;
    };

    var compareStringsDesc = function(a, b){
      if( a[sortKey] < b[sortKey] ){
        return -1 ;
      }

      if( a[sortKey] > b[sortKey] ){
        return 1;
      }
      return 0;
    };

    var compareNumbersAsc = function(a, b){
      return b[sortKey] - a[sortKey]; // in number is positive - no swap, negative -swap
    };

    var compareNumbersDesc = function(a, b){
      return a[sortKey] - b[sortKey];
    };

    if( sortType == 'asc' ){
      // console.log( 'sort asc');
      array.sort( compareNumbersAsc );
    }
    else if( sortType == 'desc' ){
      // console.log( 'sort desc');
      array.sort( compareNumbersDesc );
    }
    else{
      // console.log( 'not sorted ');
    }

  };

})();