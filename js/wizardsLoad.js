'use strict';

(function(){
  var URL = "https://j.dump.academy/code-and-magick";

  window.load = function( onSuccess, onError){
    var xhr= new XMLHttpRequest();
    xhr.responseType ='json';
    xhr.timeout = 30000; //default

    xhr.open('GET', URL );

    xhr.addEventListener('load', function(){
      onSuccess(xhr.response);
    });

    xhr.send();

  };
})();