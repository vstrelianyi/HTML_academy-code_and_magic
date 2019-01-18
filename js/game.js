'use strict';

window.GameConstants = {
  Fireball: {
    size: window.fireballSize || 24,
    speed: window.getFireballSpeed || function (movingLeft) {
      return movingLeft ? 2 : 5;
    }
  },
  Wizard: {
    speed: window.wizardSpeed || 2,
    width: window.wizardWidth || 61,
    getHeight: window.getWizardHeight || function (width) {
      return 1.377 * width;
    },
    getX: window.getWizardX || function (width) {
      return width / 3;
    },
    getY: window.getWizardY || function (height) {
      return height - 100;
    }
  }
};

window.Game = (function () {
  /**
   * @const
   * @type {number}
   */
  var HEIGHT = 300;

  /**
   * @const
   * @type {number}
   */
  var WIDTH = 700;

  /**
   * ID ÑÑÐ¾Ð²Ð½ÐµÐ¹.
   * @enum {number}
   */
  var Level = {
    INTRO: 0,
    MOVE_LEFT: 1,
    MOVE_RIGHT: 2,
    LEVITATE: 3,
    HIT_THE_MARK: 4
  };

  var NAMES = ['ÐÐµÐºÑ', 'ÐÐ°ÑÑ', 'ÐÐ³Ð¾ÑÑ'];

  /**
   * ÐÐ¾ÑÑÐ´Ð¾Ðº Ð¿ÑÐ¾ÑÐ¾Ð¶Ð´ÐµÐ½Ð¸Ñ ÑÑÐ¾Ð²Ð½ÐµÐ¹.
   * @type {Array.<Level>}
   */
  var LevelSequence = [
    Level.INTRO
  ];

  /**
   * ÐÐ°ÑÐ°Ð»ÑÐ½ÑÐ¹ ÑÑÐ¾Ð²ÐµÐ½Ñ.
   * @type {Level}
   */
  var INITIAL_LEVEL = LevelSequence[0];

  /**
   * ÐÐ¾Ð¿ÑÑÑÐ¸Ð¼ÑÐµ Ð²Ð¸Ð´Ñ Ð¾Ð±ÑÐµÐºÑÐ¾Ð² Ð½Ð° ÐºÐ°ÑÑÐµ.
   * @enum {number}
   */
  var ObjectType = {
    ME: 0,
    FIREBALL: 1
  };

  /**
   * ÐÐ¾Ð¿ÑÑÑÐ¸Ð¼ÑÐµ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ñ Ð¾Ð±ÑÐµÐºÑÐ¾Ð².
   * @enum {number}
   */
  var ObjectState = {
    OK: 0,
    DISPOSED: 1
  };

  /**
   * ÐÐ¾Ð´Ñ Ð½Ð°Ð¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ð¹.
   * @enum {number}
   */
  var Direction = {
    NULL: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 4,
    DOWN: 8
  };

  /**
   * ÐÐ°ÑÑÐ° ÑÐ¿ÑÐ°Ð¹ÑÐ¾Ð² Ð¸Ð³ÑÑ.
   * @type {Object.<ObjectType, Object>}
   */
  var SpriteMap = {};
  var REVERSED = '-reversed';

  SpriteMap[ObjectType.ME] = {
    width: 61,
    height: 84,
    url: 'img/wizard.gif'
  };

  // TODO: Find a clever way
  SpriteMap[ObjectType.ME + REVERSED] = {
    width: 61,
    height: 84,
    url: 'img/wizard-reversed.gif'
  };

  SpriteMap[ObjectType.FIREBALL] = {
    width: 24,
    height: 24,
    url: 'img/fireball.gif'
  };

  /**
   * ÐÑÐ°Ð²Ð¸Ð»Ð° Ð¿ÐµÑÐµÑÐ¸ÑÐ¾Ð²ÐºÐ¸ Ð¾Ð±ÑÐµÐºÑÐ¾Ð² Ð² Ð·Ð°Ð²Ð¸ÑÐ¸Ð¼Ð¾ÑÑÐ¸ Ð¾Ñ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ñ Ð¸Ð³ÑÑ.
   * @type {Object.<ObjectType, function(Object, Object, number): Object>}
   */
  var ObjectsBehaviour = {};

  /**
   * ÐÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ñ Ð¼Ð°Ð³Ð°. ÐÐ²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ð°Ð³Ð° Ð·Ð°Ð²Ð¸ÑÐ¸Ñ Ð¾Ñ Ð½Ð°Ð¶Ð°ÑÑÑ Ð² Ð´Ð°Ð½Ð½ÑÐ¹ Ð¼Ð¾Ð¼ÐµÐ½Ñ
   * ÑÑÑÐµÐ»Ð¾Ðº. ÐÐ°Ð³ Ð¼Ð¾Ð¶ÐµÑ Ð´Ð²Ð¸Ð³Ð°ÑÑÑÑ Ð¾Ð´Ð½Ð¾Ð²ÑÐµÐ¼ÐµÐ½Ð½Ð¾ Ð¿Ð¾ Ð³Ð¾ÑÐ¸Ð·Ð¾Ð½ÑÐ°Ð»Ð¸ Ð¸ Ð¿Ð¾ Ð²ÐµÑÑÐ¸ÐºÐ°Ð»Ð¸.
   * ÐÐ° Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ðµ Ð¼Ð°Ð³Ð° Ð²Ð»Ð¸ÑÐµÑ ÐµÐ³Ð¾ Ð¿ÐµÑÐµÑÐµÑÐµÐ½Ð¸Ðµ Ñ Ð¿ÑÐµÐ¿ÑÑÑÑÐ²Ð¸ÑÐ¼Ð¸.
   * @param {Object} object
   * @param {Object} state
   * @param {number} timeframe
   */
  ObjectsBehaviour[ObjectType.ME] = function (object, state, timeframe) {
    // ÐÐ¾ÐºÐ° Ð·Ð°Ð¶Ð°ÑÐ° ÑÑÑÐµÐ»ÐºÐ° Ð²Ð²ÐµÑÑ, Ð¼Ð°Ð³ ÑÐ½Ð°ÑÐ°Ð»Ð° Ð¿Ð¾Ð´Ð½Ð¸Ð¼Ð°ÐµÑÑÑ, Ð° Ð¿Ð¾ÑÐ¾Ð¼ Ð»ÐµÐ²Ð¸ÑÐ¸ÑÑÐµÑ
    // Ð² Ð²Ð¾Ð·Ð´ÑÑÐµ Ð½Ð° Ð¾Ð¿ÑÐµÐ´ÐµÐ»ÐµÐ½Ð½Ð¾Ð¹ Ð²ÑÑÐ¾ÑÐµ.
    // NB! Ð¡Ð»Ð¾Ð¶Ð½Ð¾ÑÑÑ Ð·Ð°ÐºÐ»ÑÑÐ°ÐµÑÑÑ Ð² ÑÐ¾Ð¼, ÑÑÐ¾ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¾ Ð² ÐºÐ¾Ð¾ÑÐ´Ð¸Ð½Ð°ÑÐ°Ñ
    // ÐºÐ°Ð½Ð²Ð°ÑÐ°, Ð° Ð½Ðµ ÐºÐ¾Ð¾ÑÐ´Ð¸Ð½Ð°ÑÐ°Ñ, Ð¾ÑÐ½Ð¾ÑÐ¸ÑÐµÐ»ÑÐ½Ð¾ Ð½Ð¸Ð¶Ð½ÐµÐ¹ Ð³ÑÐ°Ð½Ð¸ÑÑ Ð¸Ð³ÑÑ.
    if (state.keysPressed.UP && object.y > 0) {
      object.direction = object.direction & ~Direction.DOWN;
      object.direction = object.direction | Direction.UP;
      object.y -= object.speed * timeframe * 2;
    }

    // ÐÑÐ»Ð¸ ÑÑÑÐµÐ»ÐºÐ° Ð²Ð²ÐµÑÑ Ð½Ðµ Ð·Ð°Ð¶Ð°ÑÐ°, Ð° Ð¼Ð°Ð³ Ð½Ð°ÑÐ¾Ð´Ð¸ÑÑÑ Ð² Ð²Ð¾Ð·Ð´ÑÑÐµ, Ð¾Ð½ Ð¿Ð»Ð°Ð²Ð½Ð¾
    // Ð¾Ð¿ÑÑÐºÐ°ÐµÑÑÑ Ð½Ð° Ð·ÐµÐ¼Ð»Ñ.
    if (!state.keysPressed.UP) {
      if (object.y < HEIGHT - object.height) {
        object.direction = object.direction & ~Direction.UP;
        object.direction = object.direction | Direction.DOWN;
        object.y += object.speed * timeframe / 3;
      }
    }

    // ÐÑÐ»Ð¸ Ð·Ð°Ð¶Ð°ÑÐ° ÑÑÑÐµÐ»ÐºÐ° Ð²Ð»ÐµÐ²Ð¾, Ð¼Ð°Ð³ Ð¿ÐµÑÐµÐ¼ÐµÑÐ°ÐµÑÑÑ Ð²Ð»ÐµÐ²Ð¾.
    if (state.keysPressed.LEFT) {
      object.direction = object.direction & ~Direction.RIGHT;
      object.direction = object.direction | Direction.LEFT;
      object.x -= object.speed * timeframe;
    }

    // ÐÑÐ»Ð¸ Ð·Ð°Ð¶Ð°ÑÐ° ÑÑÑÐµÐ»ÐºÐ° Ð²Ð¿ÑÐ°Ð²Ð¾, Ð¼Ð°Ð³ Ð¿ÐµÑÐµÐ¼ÐµÑÐ°ÐµÑÑÑ Ð²Ð¿ÑÐ°Ð²Ð¾.
    if (state.keysPressed.RIGHT) {
      object.direction = object.direction & ~Direction.LEFT;
      object.direction = object.direction | Direction.RIGHT;
      object.x += object.speed * timeframe;
    }

    // ÐÐ³ÑÐ°Ð½Ð¸ÑÐµÐ½Ð¸Ñ Ð¿Ð¾ Ð¿ÐµÑÐµÐ¼ÐµÑÐµÐ½Ð¸Ñ Ð¿Ð¾ Ð¿Ð¾Ð»Ñ. ÐÐ°Ð³ Ð½Ðµ Ð¼Ð¾Ð¶ÐµÑ Ð²ÑÐ¹ÑÐ¸ Ð·Ð° Ð¿ÑÐµÐ´ÐµÐ»Ñ Ð¿Ð¾Ð»Ñ.
    if (object.y < 0) {
      object.y = 0;
    }

    if (object.y > HEIGHT - object.height) {
      object.y = HEIGHT - object.height;
    }

    if (object.x < 0) {
      object.x = 0;
    }

    if (object.x > WIDTH - object.width) {
      object.x = WIDTH - object.width;
    }
  };

  /**
   * ÐÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð´Ð²Ð¸Ð¶ÐµÐ½Ð¸Ñ ÑÐ°Ð¹ÑÐ±Ð¾Ð»Ð°. Ð¤Ð°Ð¹ÑÐ±Ð¾Ð» Ð²ÑÐ¿ÑÑÐºÐ°ÐµÑÑÑ Ð² Ð¾Ð¿ÑÐµÐ´ÐµÐ»ÐµÐ½Ð½Ð¾Ð¼ Ð½Ð°Ð¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ð¸
   * Ð¸ Ð¿Ð¾ÑÐ»Ðµ ÑÑÐ¾Ð³Ð¾ Ð½ÐµÑÐ¿ÑÐ°Ð²Ð»ÑÐµÐ¼Ð¾ Ð´Ð²Ð¸Ð¶ÐµÑÑÑ Ð¿Ð¾ Ð¿ÑÑÐ¼Ð¾Ð¹ Ð² Ð·Ð°Ð´Ð°Ð½Ð½Ð¾Ð¼ Ð½Ð°Ð¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ð¸. ÐÑÐ»Ð¸
   * Ð¾Ð½ Ð¿ÑÐ¾Ð»ÐµÑÐ°ÐµÑ Ð²ÐµÑÑ ÑÐºÑÐ°Ð½ Ð½Ð°ÑÐºÐ²Ð¾Ð·Ñ, Ð¾Ð½ Ð¸ÑÑÐµÐ·Ð°ÐµÑ.
   * @param {Object} object
   * @param {Object} _state
   * @param {number} timeframe
   */
  ObjectsBehaviour[ObjectType.FIREBALL] = function (object, _state, timeframe) {
    if (object.direction & Direction.LEFT) {
      object.x -= object.speed * timeframe;
    }

    if (object.direction & Direction.RIGHT) {
      object.x += object.speed * timeframe;
    }

    if (object.x < 0 || object.x > WIDTH) {
      object.state = ObjectState.DISPOSED;
    }
  };

  /**
   * ID Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½ÑÑ Ð¾ÑÐ²ÐµÑÐ¾Ð² ÑÑÐ½ÐºÑÐ¸Ð¹, Ð¿ÑÐ¾Ð²ÐµÑÑÑÑÐ¸Ñ ÑÑÐ¿ÐµÑ Ð¿ÑÐ¾ÑÐ¾Ð¶Ð´ÐµÐ½Ð¸Ñ ÑÑÐ¾Ð²Ð½Ñ.
   * CONTINUE Ð³Ð¾Ð²Ð¾ÑÐ¸Ñ Ð¾ ÑÐ¾Ð¼, ÑÑÐ¾ ÑÐ°ÑÐ½Ð´ Ð½Ðµ Ð·Ð°ÐºÐ¾Ð½ÑÐµÐ½ Ð¸ Ð¸Ð³ÑÑ Ð½ÑÐ¶Ð½Ð¾ Ð¿ÑÐ¾Ð´Ð¾Ð»Ð¶Ð°ÑÑ,
   * WIN Ð¾ ÑÐ¾Ð¼, ÑÑÐ¾ ÑÐ°ÑÐ½Ð´ Ð²ÑÐ¸Ð³ÑÐ°Ð½, FAIL â Ð¾ Ð¿Ð¾ÑÐ°Ð¶ÐµÐ½Ð¸Ð¸. PAUSE Ð¾ ÑÐ¾Ð¼, ÑÑÐ¾ Ð¸Ð³ÑÑ
   * Ð½ÑÐ¶Ð½Ð¾ Ð¿ÑÐµÑÐ²Ð°ÑÑ.
   * @enum {number}
   */
  var Verdict = {
    CONTINUE: 0,
    WIN: 1,
    FAIL: 2,
    PAUSE: 3,
    INTRO: 4
  };

  /**
   * ÐÑÐ°Ð²Ð¸Ð»Ð° Ð·Ð°Ð²ÐµÑÑÐµÐ½Ð¸Ñ ÑÑÐ¾Ð²Ð½Ñ. ÐÐ»ÑÑÐ°Ð¼Ð¸ ÑÐ»ÑÐ¶Ð°Ñ ID ÑÑÐ¾Ð²Ð½ÐµÐ¹, Ð·Ð½Ð°ÑÐµÐ½Ð¸ÑÐ¼Ð¸ ÑÑÐ½ÐºÑÐ¸Ð¸
   * Ð¿ÑÐ¸Ð½Ð¸Ð¼Ð°ÑÑÐ¸Ðµ Ð½Ð° Ð²ÑÐ¾Ð´ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ðµ ÑÑÐ¾Ð²Ð½Ñ Ð¸ Ð²Ð¾Ð·Ð²ÑÐ°ÑÐ°ÑÑÐ¸Ðµ true, ÐµÑÐ»Ð¸ ÑÐ°ÑÐ½Ð´
   * Ð¼Ð¾Ð¶Ð½Ð¾ Ð·Ð°Ð²ÐµÑÑÐ°ÑÑ Ð¸Ð»Ð¸ false ÐµÑÐ»Ð¸ Ð½ÐµÑ.
   * @type {Object.<Level, function(Object):boolean>}
   */
  var LevelsRules = {};

  /**
   * Ð£ÑÐ¾Ð²ÐµÐ½Ñ ÑÑÐ¸ÑÐ°ÐµÑÑÑ Ð¿ÑÐ¾Ð¹Ð´ÐµÐ½Ð½ÑÐ¼, ÐµÑÐ»Ð¸ Ð±ÑÐ» Ð²ÑÐ¿ÑÑÐµÐ½ ÑÐ°Ð¹Ð»Ð±Ð¾Ð»Ð» Ð¸ Ð¾Ð½ ÑÐ»ÐµÑÐµÐ»
   * Ð·Ð° ÑÐºÑÐ°Ð½.
   * @param {Object} state
   * @return {Verdict}
   */
  LevelsRules[Level.INTRO] = function (state) {
    var deletedFireballs = state.garbage.filter(function (object) {
      return object.type === ObjectType.FIREBALL;
    });

    var fenceHit = deletedFireballs.filter(function (fireball) {
      // Did we hit the fence?
      return fireball.x < 10 && fireball.y > 240;
    })[0];

    return fenceHit ? Verdict.WIN : Verdict.CONTINUE;
  };

  /**
   * ÐÐ°ÑÐ°Ð»ÑÐ½ÑÐµ ÑÑÐ»Ð¾Ð²Ð¸Ñ Ð´Ð»Ñ ÑÑÐ¾Ð²Ð½ÐµÐ¹.
   * @enum {Object.<Level, function>}
   */
  var LevelsInitialize = {};

  /**
   * ÐÐµÑÐ²ÑÐ¹ ÑÑÐ¾Ð²ÐµÐ½Ñ.
   * @param {Object} state
   * @return {Object}
   */
  LevelsInitialize[Level.INTRO] = function (state) {
    state.objects.push(
        // Ð£ÑÑÐ°Ð½Ð¾Ð²ÐºÐ° Ð¿ÐµÑÑÐ¾Ð½Ð°Ð¶Ð° Ð² Ð½Ð°ÑÐ°Ð»ÑÐ½Ð¾Ðµ Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ. ÐÐ½ ÑÑÐ¾Ð¸Ñ Ð² ÐºÑÐ°Ð¹Ð½ÐµÐ¼ Ð»ÐµÐ²Ð¾Ð¼
        // ÑÐ³Ð»Ñ ÑÐºÑÐ°Ð½Ð°, Ð³Ð»ÑÐ´Ñ Ð²Ð¿ÑÐ°Ð²Ð¾. Ð¡ÐºÐ¾ÑÐ¾ÑÑÑ Ð¿ÐµÑÐµÐ¼ÐµÑÐµÐ½Ð¸Ñ Ð¿ÐµÑÑÐ¾Ð½Ð°Ð¶Ð° Ð½Ð° ÑÑÐ¾Ð¼
        // ÑÑÐ¾Ð²Ð½Ðµ ÑÐ°Ð²Ð½Ð° 2px Ð·Ð° ÐºÐ°Ð´Ñ.
        {
          direction: Direction.RIGHT,
          height: window.GameConstants.Wizard.getHeight(window.GameConstants.Wizard.width),
          speed: window.GameConstants.Wizard.speed,
          sprite: SpriteMap[ObjectType.ME],
          state: ObjectState.OK,
          type: ObjectType.ME,
          width: window.GameConstants.Wizard.width,
          x: window.GameConstants.Wizard.getX(WIDTH),
          y: window.GameConstants.Wizard.getY(HEIGHT)
        }
    );

    return state;
  };

  /**
   * ÐÐ¾Ð½ÑÑÑÑÐºÑÐ¾Ñ Ð¾Ð±ÑÐµÐºÑÐ° Game. Ð¡Ð¾Ð·Ð´Ð°ÐµÑ canvas, Ð´Ð¾Ð±Ð°Ð²Ð»ÑÐµÑ Ð¾Ð±ÑÐ°Ð±Ð¾ÑÑÐ¸ÐºÐ¸ ÑÐ¾Ð±ÑÑÐ¸Ð¹
   * Ð¸ Ð¿Ð¾ÐºÐ°Ð·ÑÐ²Ð°ÐµÑ Ð¿ÑÐ¸Ð²ÐµÑÑÑÐ²ÐµÐ½Ð½ÑÐ¹ ÑÐºÑÐ°Ð½.
   * @param {Element} container
   * @constructor
   */
  var Game = function (container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._pauseListener = this._pauseListener.bind(this);

    this.setDeactivated(false);
  };

  Game.prototype = {
    /**
     * Ð¢ÐµÐºÑÑÐ¸Ð¹ ÑÑÐ¾Ð²ÐµÐ½Ñ Ð¸Ð³ÑÑ.
     * @type {Level}
     */
    level: INITIAL_LEVEL,

    /** @param {boolean} deactivated */
    setDeactivated: function (deactivated) {
      if (this._deactivated === deactivated) {
        return;
      }

      this._deactivated = deactivated;

      if (deactivated) {
        this._removeGameListeners();
      } else {
        this._initializeGameListeners();
      }
    },

    /**
     * Ð¡Ð¾ÑÑÐ¾ÑÐ½Ð¸Ðµ Ð¸Ð³ÑÑ. ÐÐ¿Ð¸ÑÑÐ²Ð°ÐµÑ Ð¼ÐµÑÑÐ¾Ð¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ Ð¾Ð±ÑÐµÐºÑÐ¾Ð² Ð½Ð° Ð¸Ð³ÑÐ¾Ð²Ð¾Ð¹ ÐºÐ°ÑÑÐµ
     * Ð¸ Ð²ÑÐµÐ¼Ñ Ð¿ÑÐ¾Ð²ÐµÐ´ÐµÐ½Ð½Ð¾Ðµ Ð½Ð° ÑÑÐ¾Ð²Ð½Ðµ Ð¸ Ð² Ð¸Ð³ÑÐµ.
     * @return {Object}
     */
    getInitialState: function () {
      return {
        // Ð¡ÑÐ°ÑÑÑ Ð¸Ð³ÑÑ. ÐÑÐ»Ð¸ CONTINUE, ÑÐ¾ Ð¸Ð³ÑÐ° Ð¿ÑÐ¾Ð´Ð¾Ð»Ð¶Ð°ÐµÑÑÑ.
        currentStatus: Verdict.CONTINUE,

        // ÐÐ±ÑÐµÐºÑÑ, ÑÐ´Ð°Ð»ÐµÐ½Ð½ÑÐµ Ð½Ð° Ð¿Ð¾ÑÐ»ÐµÐ´Ð½ÐµÐ¼ ÐºÐ°Ð´ÑÐµ.
        garbage: [],

        // ÐÑÐµÐ¼Ñ Ñ Ð¼Ð¾Ð¼ÐµÐ½ÑÐ° Ð¾ÑÑÐ¸ÑÐ¾Ð²ÐºÐ¸ Ð¿ÑÐµÐ´ÑÐ´ÑÑÐµÐ³Ð¾ ÐºÐ°Ð´ÑÐ°.
        lastUpdated: null,

        // Ð¡Ð¾ÑÑÐ¾ÑÐ½Ð¸Ðµ Ð½Ð°Ð¶Ð°ÑÑÑ ÐºÐ»Ð°Ð²Ð¸Ñ.
        keysPressed: {
          ESC: false,
          LEFT: false,
          RIGHT: false,
          SPACE: false,
          UP: false
        },

        // ÐÑÐµÐ¼Ñ Ð½Ð°ÑÐ°Ð»Ð° Ð¿ÑÐ¾ÑÐ¾Ð¶Ð´ÐµÐ½Ð¸Ñ ÑÑÐ¾Ð²Ð½Ñ.
        levelStartTime: null,

        // ÐÑÐµ Ð¾Ð±ÑÐµÐºÑÑ Ð½Ð° ÐºÐ°ÑÑÐµ.
        objects: [],

        // ÐÑÐµÐ¼Ñ Ð½Ð°ÑÐ°Ð»Ð° Ð¿ÑÐ¾ÑÐ¾Ð¶Ð´ÐµÐ½Ð¸Ñ Ð¸Ð³ÑÑ.
        startTime: null
      };
    },

    /**
     * ÐÐ°ÑÐ°Ð»ÑÐ½ÑÐµ Ð¿ÑÐ¾Ð²ÐµÑÐºÐ¸ Ð¸ Ð·Ð°Ð¿ÑÑÐº ÑÐµÐºÑÑÐµÐ³Ð¾ ÑÑÐ¾Ð²Ð½Ñ.
     * @param {boolean=} restart
     */
    initializeLevelAndStart: function (restart) {
      restart = typeof restart === 'undefined' ? true : restart;

      if (restart || !this.state) {
        // ÑÐ±ÑÐ¾ÑÐ¸ÑÑ ÐºÑÑ Ð¿ÑÐ¸ Ð¿ÐµÑÐµÐ·Ð°Ð³ÑÑÐ·ÐºÐµ ÑÑÐ¾Ð²Ð½Ñ
        this._imagesArePreloaded = void 0;

        // ÐÑÐ¸ Ð¿ÐµÑÐµÐ·Ð°Ð¿ÑÑÐºÐµ ÑÑÐ¾Ð²Ð½Ñ, Ð¿ÑÐ¾Ð¸ÑÑÐ¾Ð´Ð¸Ñ Ð¿Ð¾Ð»Ð½Ð°Ñ Ð¿ÐµÑÐµÐ·Ð°Ð¿Ð¸ÑÑ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ñ
        // Ð¸Ð³ÑÑ Ð¸Ð· Ð¸Ð·Ð½Ð°ÑÐ°Ð»ÑÐ½Ð¾Ð³Ð¾ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ñ.
        this.state = this.getInitialState();
        this.state = LevelsInitialize[this.level](this.state);
      } else {
        // ÐÑÐ¸ Ð¿ÑÐ¾Ð´Ð¾Ð»Ð¶ÐµÐ½Ð¸Ð¸ ÑÑÐ¾Ð²Ð½Ñ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ðµ ÑÐ¾ÑÑÐ°Ð½ÑÐµÑÑÑ, ÐºÑÐ¾Ð¼Ðµ Ð·Ð°Ð¿Ð¸ÑÐ¸ Ð¾ ÑÐ¾Ð¼,
        // ÑÑÐ¾ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ðµ ÑÑÐ¾Ð²Ð½Ñ Ð¸Ð·Ð¼ÐµÐ½Ð¸Ð»Ð¾ÑÑ Ñ Ð¿Ð°ÑÐ·Ñ Ð½Ð° Ð¿ÑÐ¾Ð´Ð¾Ð»Ð¶ÐµÐ½Ð¸Ðµ Ð¸Ð³ÑÑ.
        this.state.currentStatus = Verdict.CONTINUE;
      }

      // ÐÐ°Ð¿Ð¸ÑÑ Ð²ÑÐµÐ¼ÐµÐ½Ð¸ Ð½Ð°ÑÐ°Ð»Ð° Ð¸Ð³ÑÑ Ð¸ Ð²ÑÐµÐ¼ÐµÐ½Ð¸ Ð½Ð°ÑÐ°Ð»Ð° ÑÑÐ¾Ð²Ð½Ñ.
      this.state.levelStartTime = Date.now();
      if (!this.state.startTime) {
        this.state.startTime = this.state.levelStartTime;
      }

      this._preloadImagesForLevel(function () {
        // ÐÑÐµÐ´Ð²Ð°ÑÐ¸ÑÐµÐ»ÑÐ½Ð°Ñ Ð¾ÑÑÐ¸ÑÐ¾Ð²ÐºÐ° Ð¸Ð³ÑÐ¾Ð²Ð¾Ð³Ð¾ ÑÐºÑÐ°Ð½Ð°.
        this.render();

        // Ð£ÑÑÐ°Ð½Ð¾Ð²ÐºÐ° Ð¾Ð±ÑÐ°Ð±Ð¾ÑÑÐ¸ÐºÐ¾Ð² ÑÐ¾Ð±ÑÑÐ¸Ð¹.
        this._initializeGameListeners();

        // ÐÐ°Ð¿ÑÑÐº Ð¸Ð³ÑÐ¾Ð²Ð¾Ð³Ð¾ ÑÐ¸ÐºÐ»Ð°.
        this.update();
      }.bind(this));
    },

    /**
     * ÐÑÐµÐ¼ÐµÐ½Ð½Ð°Ñ Ð¾ÑÑÐ°Ð½Ð¾Ð²ÐºÐ° Ð¸Ð³ÑÑ.
     * @param {Verdict=} verdict
     */
    pauseLevel: function (verdict) {
      if (verdict) {
        this.state.currentStatus = verdict;
      }

      this.state.keysPressed.ESC = false;
      this.state.lastUpdated = null;

      this._removeGameListeners();
      window.addEventListener('keydown', this._pauseListener);

      this._drawPauseScreen();
    },

    /**
     * ÐÐ±ÑÐ°Ð±Ð¾ÑÑÐ¸Ðº ÑÐ¾Ð±ÑÑÐ¸Ð¹ ÐºÐ»Ð°Ð²Ð¸Ð°ÑÑÑÑ Ð²Ð¾ Ð²ÑÐµÐ¼Ñ Ð¿Ð°ÑÐ·Ñ.
     * @param {KeyboardsEvent} evt
     * @private
     * @private
     */
    _pauseListener: function (evt) {
      if (evt.keyCode === 32 && !this._deactivated) {
        evt.preventDefault();
        var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
          this.state.currentStatus === Verdict.FAIL;
        this.initializeLevelAndStart(needToRestartTheGame);

        window.removeEventListener('keydown', this._pauseListener);
      }
    },

    /**
     * ÐÑÑÐ¸ÑÐ¾Ð²ÐºÐ° ÑÐºÑÐ°Ð½Ð° Ð¿Ð°ÑÐ·Ñ.
     */
    _drawPauseScreen: function () {
      var message;
      switch (this.state.currentStatus) {
        case Verdict.WIN:
          if (window.renderStatistics) {
            var statistics = this._generateStatistics(new Date() - this.state.startTime);
            var keys = this._shuffleArray(Object.keys(statistics));
            window.renderStatistics(this.ctx, keys, keys.map(function (it) {
              return statistics[it];
            }));
            return;
          }
          message = 'ÐÑ Ð¿Ð¾Ð±ÐµÐ´Ð¸Ð»Ð¸ ÐÐ°Ð·ÐµÐ±Ð¾!\nÐ£ÑÐ°!';
          break;
        case Verdict.FAIL:
          message = 'ÐÑ Ð¿ÑÐ¾Ð¸Ð³ÑÐ°Ð»Ð¸!';
          break;
        case Verdict.PAUSE:
          message = 'ÐÐ³ÑÐ° Ð½Ð° Ð¿Ð°ÑÐ·Ðµ!\nÐÐ°Ð¶Ð¼Ð¸ÑÐµ ÐÑÐ¾Ð±ÐµÐ», ÑÑÐ¾Ð±Ñ Ð¿ÑÐ¾Ð´Ð¾Ð»Ð¶Ð¸ÑÑ';
          break;
        case Verdict.INTRO:
          message = 'ÐÐ¾Ð±ÑÐ¾ Ð¿Ð¾Ð¶Ð°Ð»Ð¾Ð²Ð°ÑÑ!\nÐÐ°Ð¶Ð¼Ð¸ÑÐµ ÐÑÐ¾Ð±ÐµÐ» Ð´Ð»Ñ Ð½Ð°ÑÐ°Ð»Ð° Ð¸Ð³ÑÑ';
          break;
      }

      this._drawMessage(message);
    },

    _generateStatistics: function (time) {
      var generationIntervalSec = 3000;
      var minTimeInSec = 1000;

      var statistic = {
        'ÐÑ': time
      };

      for (var i = 0; i < NAMES.length; i++) {
        var diffTime = Math.random() * generationIntervalSec;
        var userTime = time + (diffTime - generationIntervalSec / 2);
        if (userTime < minTimeInSec) {
          userTime = minTimeInSec;
        }
        statistic[NAMES[i]] = userTime;
      }

      return statistic;
    },

    _shuffleArray: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    _drawMessage: function (message) {
      var ctx = this.ctx;

      var drawCloud = function (x, y, width, heigth) {
        var offset = 10;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + offset, y + heigth / 2);
        ctx.lineTo(x, y + heigth);
        ctx.lineTo(x + width / 2, y + heigth - offset);
        ctx.lineTo(x + width, y + heigth);
        ctx.lineTo(x + width - offset, y + heigth / 2);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width / 2, y + offset);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
        ctx.fill();
      };

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      drawCloud(190, 40, 320, 100);

      ctx.fillStyle = 'rgba(256, 256, 256, 1.0)';
      drawCloud(180, 30, 320, 100);

      ctx.fillStyle = '#000';
      ctx.font = '16px PT Mono';
      message.split('\n').forEach(function (line, i) {
        ctx.fillText(line, 200, 80 + 20 * i);
      });
    },

    /**
     * ÐÑÐµÐ´Ð·Ð°Ð³ÑÑÐ·ÐºÐ° Ð½ÐµÐ¾Ð±ÑÐ¾Ð´Ð¸Ð¼ÑÑ Ð¸Ð·Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð¸Ð¹ Ð´Ð»Ñ ÑÑÐ¾Ð²Ð½Ñ.
     * @param {function} callback
     * @private
     */
    _preloadImagesForLevel: function (callback) {
      if (typeof this._imagesArePreloaded === 'undefined') {
        this._imagesArePreloaded = [];
      }

      if (this._imagesArePreloaded[this.level]) {
        callback();
        return;
      }

      var keys = Object.keys(SpriteMap);
      var imagesToGo = keys.length;

      var self = this;

      var loadSprite = function (sprite) {
        var image = new Image(sprite.width, sprite.height);
        image.onload = function () {
          sprite.image = image;
          if (--imagesToGo === 0) {
            self._imagesArePreloaded[self.level] = true;
            callback();
          }
        };
        image.src = sprite.url;
      };

      for (var i = 0; i < keys.length; i++) {
        loadSprite(SpriteMap[keys[i]]);
      }
    },

    /**
     * ÐÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÑÑÐ°ÑÑÑÐ° Ð¾Ð±ÑÐµÐºÑÐ¾Ð² Ð½Ð° ÑÐºÑÐ°Ð½Ðµ. ÐÐ¾Ð±Ð°Ð²Ð»ÑÐµÑ Ð¾Ð±ÑÐµÐºÑÑ, ÐºÐ¾ÑÐ¾ÑÑÐµ Ð´Ð¾Ð»Ð¶Ð½Ñ
     * Ð¿Ð¾ÑÐ²Ð¸ÑÑÑÑ, Ð²ÑÐ¿Ð¾Ð»Ð½ÑÐµÑ Ð¿ÑÐ¾Ð²ÐµÑÐºÑ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ Ð²ÑÐµÑ Ð¾Ð±ÑÐµÐºÑÐ¾Ð² Ð¸ ÑÐ´Ð°Ð»ÑÐµÑ ÑÐµ, ÐºÐ¾ÑÐ¾ÑÑÐµ
     * Ð´Ð¾Ð»Ð¶Ð½Ñ Ð¸ÑÑÐµÐ·Ð½ÑÑÑ.
     * @param {number} delta ÐÑÐµÐ¼Ñ, Ð¿ÑÐ¾ÑÐµÐ´Ð½ÐµÐµ Ñ Ð¾ÑÑÐ¸ÑÐ¾Ð²ÐºÐ¸ Ð¿ÑÐ¾ÑÐ»Ð¾Ð³Ð¾ ÐºÐ°Ð´ÑÐ°.
     */
    updateObjects: function (delta) {
      // ÐÐµÑÑÐ¾Ð½Ð°Ð¶.
      var me = this.state.objects.filter(function (object) {
        return object.type === ObjectType.ME;
      })[0];

      // ÐÐ¾Ð±Ð°Ð²Ð»ÑÐµÑ Ð½Ð° ÐºÐ°ÑÑÑ ÑÐ°Ð¹ÑÐ±Ð¾Ð» Ð¿Ð¾ Ð½Ð°Ð¶Ð°ÑÐ¸Ñ Ð½Ð° Shift.
      if (this.state.keysPressed.SHIFT) {
        this.state.objects.push({
          direction: me.direction,
          height: window.GameConstants.Fireball.size,
          speed: window.GameConstants.Fireball.speed(!!(me.direction & Direction.LEFT)),
          sprite: SpriteMap[ObjectType.FIREBALL],
          type: ObjectType.FIREBALL,
          width: window.GameConstants.Fireball.size,
          x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - window.GameConstants.Fireball.size,
          y: me.y + me.height / 2
        });

        this.state.keysPressed.SHIFT = false;
      }

      this.state.garbage = [];

      // Ð£Ð±Ð¸ÑÐ°ÐµÑ Ð² garbage Ð½Ðµ Ð¸ÑÐ¿Ð¾Ð»ÑÐ·ÑÐµÐ¼ÑÐµ Ð½Ð° ÐºÐ°ÑÑÐµ Ð¾Ð±ÑÐµÐºÑÑ.
      var remainingObjects = this.state.objects.filter(function (object) {
        ObjectsBehaviour[object.type](object, this.state, delta);

        if (object.state === ObjectState.DISPOSED) {
          this.state.garbage.push(object);
          return false;
        }

        return true;
      }, this);

      this.state.objects = remainingObjects;
    },

    /**
     * ÐÑÐ¾Ð²ÐµÑÐºÐ° ÑÑÐ°ÑÑÑÐ° ÑÐµÐºÑÑÐµÐ³Ð¾ ÑÑÐ¾Ð²Ð½Ñ.
     */
    checkStatus: function () {
      // ÐÐµÑ Ð½ÑÐ¶Ð½Ñ Ð·Ð°Ð¿ÑÑÐºÐ°ÑÑ Ð¿ÑÐ¾Ð²ÐµÑÐºÑ, Ð½ÑÐ¶Ð½Ð¾ Ð»Ð¸ Ð¾ÑÑÐ°Ð½Ð°Ð²Ð»Ð¸Ð²Ð°ÑÑ ÑÑÐ¾Ð²ÐµÐ½Ñ, ÐµÑÐ»Ð¸
      // Ð·Ð°ÑÐ°Ð½ÐµÐµ Ð¸Ð·Ð²ÐµÑÑÐ½Ð¾, ÑÑÐ¾ Ð´Ð°.
      if (this.state.currentStatus !== Verdict.CONTINUE) {
        return;
      }

      if (!this.commonRules) {
        // ÐÑÐ¾Ð²ÐµÑÐºÐ¸, Ð½Ðµ Ð·Ð°Ð²Ð¸ÑÑÑÐ¸Ðµ Ð¾Ñ ÑÑÐ¾Ð²Ð½Ñ, Ð½Ð¾ Ð²Ð»Ð¸ÑÑÑÐ¸Ðµ Ð½Ð° ÐµÐ³Ð¾ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ðµ.
        this.commonRules = [

          /**
           * ÐÑÐ»Ð¸ Ð¿ÐµÑÑÐ¾Ð½Ð°Ð¶ Ð¼ÐµÑÑÐ², Ð¸Ð³ÑÐ° Ð¿ÑÐµÐºÑÐ°ÑÐ°ÐµÑÑÑ.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            var me = state.objects.filter(function (object) {
              return object.type === ObjectType.ME;
            })[0];

            return me.state === ObjectState.DISPOSED ?
              Verdict.FAIL :
              Verdict.CONTINUE;
          },

          /**
           * ÐÑÐ»Ð¸ Ð½Ð°Ð¶Ð°ÑÐ° ÐºÐ»Ð°Ð²Ð¸ÑÐ° Esc Ð¸Ð³ÑÐ° ÑÑÐ°Ð²Ð¸ÑÑÑ Ð½Ð° Ð¿Ð°ÑÐ·Ñ.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
          },

          /**
           * ÐÐ³ÑÐ° Ð¿ÑÐµÐºÑÐ°ÑÐ°ÐµÑÑÑ ÐµÑÐ»Ð¸ Ð¸Ð³ÑÐ¾Ðº Ð¿ÑÐ¾Ð´Ð¾Ð»Ð¶Ð°ÐµÑ Ð¸Ð³ÑÐ°ÑÑ Ð² Ð½ÐµÐµ Ð´Ð²Ð° ÑÐ°ÑÐ° Ð¿Ð¾Ð´ÑÑÐ´.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            return Date.now() - state.startTime > 3 * 60 * 1000 ?
              Verdict.FAIL :
              Verdict.CONTINUE;
          }
        ];
      }

      // ÐÑÐ¾Ð²ÐµÑÐºÐ° Ð²ÑÐµÑ Ð¿ÑÐ°Ð²Ð¸Ð» Ð²Ð»Ð¸ÑÑÑÐ¸Ñ Ð½Ð° ÑÑÐ¾Ð²ÐµÐ½Ñ. ÐÐ°Ð¿ÑÑÐºÐ°ÐµÐ¼ ÑÐ¸ÐºÐ» Ð¿ÑÐ¾Ð²ÐµÑÐ¾Ðº
      // Ð¿Ð¾ Ð²ÑÐµÐ¼ ÑÐ½Ð¸Ð²ÐµÑÑÐ°Ð»ÑÐ½ÑÐ¼ Ð¿ÑÐ¾Ð²ÐµÑÐºÐ°Ð¼ Ð¸ Ð¿ÑÐ¾Ð²ÐµÑÐºÐ°Ð¼ ÐºÐ¾Ð½ÐºÑÐµÑÐ½Ð¾Ð³Ð¾ ÑÑÐ¾Ð²Ð½Ñ.
      // Ð¦Ð¸ÐºÐ» Ð¿ÑÐ¾Ð´Ð¾Ð»Ð¶Ð°ÐµÑÑÑ Ð´Ð¾ ÑÐµÑ Ð¿Ð¾Ñ, Ð¿Ð¾ÐºÐ° ÐºÐ°ÐºÐ°Ñ-Ð»Ð¸Ð±Ð¾ Ð¸Ð· Ð¿ÑÐ¾Ð²ÐµÑÐ¾Ðº Ð½Ðµ Ð²ÐµÑÐ½ÐµÑ
      // Ð»ÑÐ±Ð¾Ðµ Ð´ÑÑÐ³Ð¾Ðµ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ðµ ÐºÑÐ¾Ð¼Ðµ CONTINUE Ð¸Ð»Ð¸ Ð¿Ð¾ÐºÐ° Ð½Ðµ Ð¿ÑÐ¾Ð¹Ð´ÑÑ Ð²ÑÐµ
      // Ð¿ÑÐ¾Ð²ÐµÑÐºÐ¸. ÐÐ¾ÑÐ»Ðµ ÑÑÐ¾Ð³Ð¾ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ðµ ÑÐ¾ÑÑÐ°Ð½ÑÐµÑÑÑ.
      var allChecks = this.commonRules.concat(LevelsRules[this.level]);
      var currentCheck = Verdict.CONTINUE;
      var currentRule;

      while (currentCheck === Verdict.CONTINUE && allChecks.length) {
        currentRule = allChecks.shift();
        currentCheck = currentRule(this.state);
      }

      this.state.currentStatus = currentCheck;
    },

    /**
     * ÐÑÐ¸Ð½ÑÐ´Ð¸ÑÐµÐ»ÑÐ½Ð°Ñ ÑÑÑÐ°Ð½Ð¾Ð²ÐºÐ° ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ñ Ð¸Ð³ÑÑ. ÐÑÐ¿Ð¾Ð»ÑÐ·ÑÐµÑÑÑ Ð´Ð»Ñ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ñ
     * ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ñ Ð¸Ð³ÑÑ Ð¾Ñ Ð²Ð½ÐµÑÐ½Ð¸Ñ ÑÑÐ»Ð¾Ð²Ð¸Ð¹, Ð½Ð°Ð¿ÑÐ¸Ð¼ÐµÑ, ÐºÐ¾Ð³Ð´Ð° Ð½ÐµÐ¾Ð±ÑÐ¾Ð´Ð¸Ð¼Ð¾ Ð¾ÑÑÐ°Ð½Ð¾Ð²Ð¸ÑÑ
     * Ð¸Ð³ÑÑ, ÐµÑÐ»Ð¸ Ð¾Ð½Ð° Ð½Ð°ÑÐ¾Ð´Ð¸ÑÑÑ Ð²Ð½Ðµ Ð¾Ð±Ð»Ð°ÑÑÐ¸ Ð²Ð¸Ð´Ð¸Ð¼Ð¾ÑÑÐ¸ Ð¸ ÑÑÑÐ°Ð½Ð¾Ð²Ð¸ÑÑ Ð²Ð²Ð¾Ð´Ð½ÑÐ¹
     * ÑÐºÑÐ°Ð½.
     * @param {Verdict} status
     */
    setGameStatus: function (status) {
      if (this.state.currentStatus !== status) {
        this.state.currentStatus = status;
      }
    },

    /**
     * ÐÑÑÐ¸ÑÐ¾Ð²ÐºÐ° Ð²ÑÐµÑ Ð¾Ð±ÑÐµÐºÑÐ¾Ð² Ð½Ð° ÑÐºÑÐ°Ð½Ðµ.
     */
    render: function () {
      // Ð£Ð´Ð°Ð»ÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ Ð¾ÑÑÐ¸ÑÐ¾Ð²Ð°Ð½Ð½ÑÑ Ð½Ð° ÑÑÑÐ°Ð½Ð¸ÑÐµ ÑÐ»ÐµÐ¼ÐµÐ½ÑÐ¾Ð².
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // ÐÑÑÑÐ°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð²ÑÐµÑ ÑÐ»ÐµÐ¼ÐµÐ½ÑÐ¾Ð², Ð¾ÑÑÐ°Ð²ÑÐ¸ÑÑÑ Ð² this.state.objects ÑÐ¾Ð³Ð»Ð°ÑÐ½Ð¾
      // Ð¸Ñ ÐºÐ¾Ð¾ÑÐ´Ð¸Ð½Ð°ÑÐ°Ð¼ Ð¸ Ð½Ð°Ð¿ÑÐ°Ð²Ð»ÐµÐ½Ð¸Ñ.
      this.state.objects.forEach(function (object) {
        if (object.sprite) {
          var reversed = object.direction & Direction.LEFT;
          var sprite = SpriteMap[object.type + (reversed ? REVERSED : '')] || SpriteMap[object.type];
          this.ctx.drawImage(sprite.image, object.x, object.y, object.width, object.height);
        }
      }, this);
    },

    /**
     * ÐÑÐ½Ð¾Ð²Ð½Ð¾Ð¹ Ð¸Ð³ÑÐ¾Ð²Ð¾Ð¹ ÑÐ¸ÐºÐ». Ð¡Ð½Ð°ÑÐ°Ð»Ð° Ð¿ÑÐ¾Ð²ÐµÑÑÐµÑ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ðµ Ð²ÑÐµÑ Ð¾Ð±ÑÐµÐºÑÐ¾Ð² Ð¸Ð³ÑÑ
     * Ð¸ Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐµÑ Ð¸Ñ ÑÐ¾Ð³Ð»Ð°ÑÐ½Ð¾ Ð¿ÑÐ°Ð²Ð¸Ð»Ð°Ð¼ Ð¸Ñ Ð¿Ð¾Ð²ÐµÐ´ÐµÐ½Ð¸Ñ, Ð° Ð·Ð°ÑÐµÐ¼ Ð·Ð°Ð¿ÑÑÐºÐ°ÐµÑ
     * Ð¿ÑÐ¾Ð²ÐµÑÐºÑ ÑÐµÐºÑÑÐµÐ³Ð¾ ÑÐ°ÑÐ½Ð´Ð°. Ð ÐµÐºÑÑÑÐ¸Ð²Ð½Ð¾ Ð¿ÑÐ¾Ð´Ð¾Ð»Ð¶Ð°ÐµÑÑÑ Ð´Ð¾ ÑÐµÑ Ð¿Ð¾Ñ, Ð¿Ð¾ÐºÐ°
     * Ð¿ÑÐ¾Ð²ÐµÑÐºÐ° Ð½Ðµ Ð²ÐµÑÐ½ÐµÑ ÑÐ¾ÑÑÐ¾ÑÐ½Ð¸Ðµ FAIL, WIN Ð¸Ð»Ð¸ PAUSE.
     */
    update: function () {
      if (!this.state.lastUpdated) {
        this.state.lastUpdated = Date.now();
      }

      var delta = (Date.now() - this.state.lastUpdated) / 10;
      this.updateObjects(delta);
      this.checkStatus();

      switch (this.state.currentStatus) {
        case Verdict.CONTINUE:
          this.state.lastUpdated = Date.now();
          this.render();
          requestAnimationFrame(function () {
            this.update();
          }.bind(this));
          break;

        case Verdict.WIN:
        case Verdict.FAIL:
        case Verdict.PAUSE:
        case Verdict.INTRO:
          this.pauseLevel();
          break;
      }
    },

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    _onKeyDown: function (evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = true;
          break;
        case 39:
          this.state.keysPressed.RIGHT = true;
          break;
        case 38:
          this.state.keysPressed.UP = true;
          break;
        case 27:
          this.state.keysPressed.ESC = true;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = true;
      }
    },

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    _onKeyUp: function (evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = false;
          break;
        case 39:
          this.state.keysPressed.RIGHT = false;
          break;
        case 38:
          this.state.keysPressed.UP = false;
          break;
        case 27:
          this.state.keysPressed.ESC = false;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = false;
      }
    },

    /** @private */
    _initializeGameListeners: function () {
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    },

    /** @private */
    _removeGameListeners: function () {
      window.removeEventListener('keydown', this._onKeyDown);
      window.removeEventListener('keyup', this._onKeyUp);
    }
  };

  Game.Verdict = Verdict;

  var game = new Game(document.querySelector('.demo'));

  window.restartGame = function (wizardRightImage, wizardLeftImage) {
    SpriteMap[ObjectType.ME].url = wizardRightImage;
    SpriteMap[ObjectType.ME + REVERSED].url = wizardLeftImage;

    game.initializeLevelAndStart();
    game.setGameStatus(Verdict.INTRO);
  };

  window.restartGame('img/wizard.gif', 'img/wizard-reversed.gif');

  return game;
})();
