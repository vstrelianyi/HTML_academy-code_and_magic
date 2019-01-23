'use strict';
(function(){

  // HTTP

  // OPTION 1
  window.upload = function( data, onSuccess){
    var URL = "https://js.dump.academy/code-and-magick";
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function(){
      onSuccess(xhr.response);
    });

    xhr.open("POST", URL);
    xhr.send(data);
  };

  // OPTION 2
  window.backend = {

    load: function( onLoad, onError ){

      var URL = "https://js.dump.academy/code-and-magick/data";
      var xhr = new XMLHttpRequest();
      xhr.responseType ='json'; // whithout this the server will return string, otherwise it will return the stated type ('json')
      xhr.timeout = 30000; //default

      xhr.addEventListener('load', function(){
        var error;
        switch(xhr.status){
          case 200:
            onLoad(xhr.response);
            break;
          case 400:
            error = 'Неверный запрос';
            break;
          case 401:
            error = 'Пользователь не авторизован';
            break;
          case 404:
            error = 'Ничего не найдено';
            break;
          default:
            error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
        }
        if( error ){
          onError( error );
        }
      });

      xhr.addEventListener('error', function(){
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function(){
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('GET', URL );
      xhr.send();

    },
    save: function( data, onLoad, onError ){

      var URL = "https://js.dump.academy/code-and-magick";
      var xhr = new XMLHttpRequest();
      xhr.responseType ='json'; // whithout this the server will return string, otherwise it will return the stated type ('json')

      xhr.addEventListener('load', function(){
        var error;
        switch(xhr.status){
          case 200:
            onLoad(xhr.response);
            break;
          case 400:
            error = 'Неверный запрос';
            break;
          case 401:
            error = 'Пользователь не авторизован';
            break;
          case 404:
            error = 'Ничего не найдено';
            break;
          default:
            error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
        }
        if( error ){
          onError( error );
        }
      });

      xhr.addEventListener('error', function(){
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function(){
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('POST', URL );
      xhr.send( data );

    }

  };

})();