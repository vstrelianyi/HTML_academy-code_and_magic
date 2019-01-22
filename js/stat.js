'use strict';

(function(){

  var CLOUD_WIDTH = 500;
  var CLOUD_HEIGHT = 200;
  var CLOUD_X = 100;
  var CLOUD_Y = 50;
  var GAP = 10;
  var FONT_GAP = 15;
  var TEXT_WIDTH = 50;
  var BAR_HEIGHT = 20;
  var barWidth = CLOUD_WIDTH - GAP - TEXT_WIDTH - GAP;
  var text = ['Ура вы победили!', 'Список результатов: '];

  // Выводим надпись на облаке
  var renderCloudHeading = function( ctxObject, textArray) {
    ctxObject.fillStyle = '#000';
    ctxObject.font = '16px PT Mono';
    for (var i = 0; i < textArray.length; i++) {
      ctxObject.fillText(textArray[i], CLOUD_X + FONT_GAP, CLOUD_Y + (i + 1) * 25);
    }
  };

  var renderCloud = function(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, CLOUD_WIDTH, CLOUD_HEIGHT);
  };

  var getMaxElement = function(arr) {
    var maxElement = arr[0];

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] > maxElement) {
        maxElement = arr[i];
      }
    }

    return maxElement;
  };

  // Вычисляем цвет бара в зависимости от имени игрока
  var generateFullBarColor  = function(namePlayer) {
    console.log( namePlayer );
    var randomOpacity = Math.random().toFixed(2);
    if (namePlayer === 'Вы') {
      return 'rgba(255, 0, 0, 1)';
    }
    return 'rgba(0, 0, 255, ' + randomOpacity + ')';
  };

  window.renderStatistics = function(ctx, players, times) {
    // render cloud shadow
    renderCloud(ctx, CLOUD_X + GAP, CLOUD_Y + GAP, 'rgba(0, 0, 0, 0.3)');
    // render cloud
    renderCloud(ctx, CLOUD_X, CLOUD_Y, '#fff');

    renderCloudHeading(ctx, text);

    var maxTime = getMaxElement(times);

    for (var i = 0; i < players.length; i++) {
      ctx.fillStyle = generateFullBarColor( players[i] );
      ctx.fillText(players[i], CLOUD_X + GAP, 60 + CLOUD_Y + GAP + FONT_GAP + (GAP + BAR_HEIGHT) * i);
      ctx.fillRect(CLOUD_X + GAP + TEXT_WIDTH, CLOUD_Y + GAP + (GAP + BAR_HEIGHT) * i + 60, (barWidth * times[i]) / maxTime, BAR_HEIGHT);
    }
  };
})();