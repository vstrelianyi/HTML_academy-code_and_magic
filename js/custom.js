'use strict';


var CLOUD_WIDTH = 500;
var CLOUD_HEIGHT = 200;

var renderCloud = function( ctx, x ,y ,color){
  ctx.fillStyle = color;
  ctx.fillRect( x, y, CLOUD_WIDTH, CLOUD_HEIGHT );
}

// players = ['Viktor', 'Player1'];

window.renderStatistics = function(ctx, players){
  renderCloud(ctx, 110, 50, 'rgba(0,0,0, 0.3)');
  renderCloud(ctx, 100, 60, '#fff');

  // ctx.fillStyle = '#000';
  // ctx.fillText('Вы', 100, 75);
  // ctx.fillRect(110, 60, 480,20);
}

