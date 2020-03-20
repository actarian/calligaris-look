/**
 * @license calligaris-look v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['total-look'] = factory());
}(this, (function () { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var Emitter = /*#__PURE__*/function () {
    function Emitter(options) {
      if (options === void 0) {
        options = {};
      }

      Object.assign(this, options);
      this.events = {};
    }

    var _proto = Emitter.prototype;

    _proto.on = function on(type, callback) {
      var _this = this;

      var event = this.events[type] = this.events[type] || [];
      event.push(callback);
      return function () {
        _this.events[type] = event.filter(function (x) {
          return x !== callback;
        });
      };
    };

    _proto.off = function off(type, callback) {
      var event = this.events[type];

      if (event) {
        this.events[type] = event.filter(function (x) {
          return x !== callback;
        });
      }
    };

    _proto.emit = function emit(type, data) {
      var event = this.events[type];

      if (event) {
        event.forEach(function (callback) {
          // callback.call(this, data);
          callback(data);
        });
      }

      var broadcast = this.events.broadcast;

      if (broadcast) {
        broadcast.forEach(function (callback) {
          callback(type, data);
        });
      }
    };

    return Emitter;
  }();

  var Component = /*#__PURE__*/function (_Emitter) {
    _inheritsLoose(Component, _Emitter);

    function Component() {
      return _Emitter.apply(this, arguments) || this;
    }

    var _proto = Component.prototype;

    _proto.getNode = function getNode() {
      if (typeof this.render === 'function') {
        var template = this.render();

        if (!template) {
          return;
        }

        var div = document.createElement("div");
        div.innerHTML = template;
        var node = div.firstElementChild;
        return node;
      }
    };

    _proto.setNode = function setNode(node) {
      var template = this.getNode();

      if (template) {
        node.parentNode.replaceChild(template, node);
        node = template;
      }

      this.node = node;

      if (typeof this.onInit === 'function') {
        this.onInit(this.node);
      }

      return this;
    };

    _proto.setParentNode = function setParentNode(node) {
      var template = this.getNode();

      if (template) {
        node.appendChild(template);
      }

      this.node = template;

      if (typeof this.onInit === 'function') {
        this.onInit(this.node);
      }

      return this;
    };

    _proto.destroy = function destroy() {
      if (typeof this.onDestroy === 'function') {
        this.onDestroy(this.node);
      }
    }
    /*
    render() {
    	return `<div class="card--component">
    		I'm an ES6 component!
    	</div>`;
    }
    */
    ;

    return Component;
  }(Emitter);

  var DragListener = /*#__PURE__*/function () {
    _createClass(DragListener, [{
      key: "passive",
      get: function get() {
        var _this = this;

        if (this.passive_ !== undefined) {
          return this.passive_;
        } else {
          this.passive_ = false;

          try {
            var options = Object.defineProperty({}, 'passive', {
              get: function get() {
                _this.passive_ = !0;
              }
            });
            window.addEventListener('test', null, options);
          } catch (err) {}

          return this.passive_;
        }
      }
    }, {
      key: "options",
      get: function get() {
        if (this.passive) {
          return {
            passive: false,
            capture: true
          };
        } else {
          return false;
        }
      }
    }]);

    function DragListener(currentTarget, downCallback, moveCallback, upCallback) {
      this.currentTarget = currentTarget || document;

      this.downCallback = downCallback || function (e) {
        console.log('DragListener.downCallback not setted', e);
      };

      this.moveCallback = moveCallback || function (e) {
        console.log('DragListener.moveCallback not setted', e);
      };

      this.upCallback = upCallback || function (e) {
        console.log('DragListener.upCallback not setted', e);
      };

      this.dragging = false;
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.onTouchStart = this.onTouchStart.bind(this);
      this.onTouchMove = this.onTouchMove.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);
      this.addListeners();
    }

    var _proto = DragListener.prototype;

    _proto.addListeners = function addListeners() {
      this.currentTarget.addEventListener('touchstart', this.onTouchStart, this.options);
      this.currentTarget.addEventListener('mousedown', this.onMouseDown, this.options);
    };

    _proto.destroy = function destroy() {
      this.currentTarget.removeEventListener('touchstart', this.onTouchStart);
      this.currentTarget.removeEventListener('mousedown', this.onMouseDown);
      this.removeMouseListeners();
      this.removeTouchListeners();
    };

    _proto.onDown = function onDown(down) {
      this.down = down;
      this.strength = {
        x: 0,
        y: 0
      };
      this.distance = this.distance || {
        x: 0,
        y: 0
      };
      this.speed = {
        x: 0,
        y: 0
      };
      this.downCallback(this);
    };

    _proto.onDrag = function onDrag(position) {
      this.dragging = position && this.down !== undefined;

      if (this.dragging) {
        var currentTarget = this.currentTarget;
        var distance = {
          x: position.x - this.down.x,
          y: position.y - this.down.y
        };
        var strength = {
          x: distance.x / window.innerWidth * 2,
          y: distance.y / window.innerHeight * 2
        };
        var speed = {
          x: this.speed.x + (strength.x - this.strength.x) * 0.1,
          y: this.speed.y + (strength.y - this.strength.y) * 0.1
        };
        this.position = position;
        this.distance = distance;
        this.strength = strength;
        this.speed = speed;
        this.moveCallback({
          position: position,
          distance: distance,
          strength: strength,
          speed: speed,
          currentTarget: currentTarget
        });
      }
    };

    _proto.onUp = function onUp() {
      this.down = undefined;
      this.dragging = false;
      this.upCallback(this);
    };

    _proto.onMouseDown = function onMouseDown(e) {
      this.originalEvent = e;
      this.target = e.target;
      this.currentTarget.removeEventListener('touchstart', this.onTouchStart);
      this.onDown({
        x: e.clientX,
        y: e.clientY
      });
      this.addMouseListeners();
    };

    _proto.onMouseMove = function onMouseMove(e) {
      this.originalEvent = e;
      this.target = e.target;
      this.onDrag({
        x: e.clientX,
        y: e.clientY
      });
    };

    _proto.onMouseUp = function onMouseUp(e) {
      this.originalEvent = e;
      this.target = e.target;
      this.removeMouseListeners();
      /*
      this.onDrag({
      	x: e.clientX,
      	y: e.clientY
      });
      */

      this.onUp();
    };

    _proto.onTouchStart = function onTouchStart(e) {
      this.originalEvent = e;
      this.target = e.target;
      this.currentTarget.removeEventListener('mousedown', this.onMouseDown);

      if (e.touches.length > 0) {
        // e.preventDefault();
        this.onDown({
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        });
        this.addTouchListeners();
      }
    };

    _proto.onTouchMove = function onTouchMove(e) {
      this.originalEvent = e;
      this.target = e.target;

      if (e.touches.length > 0) {
        // e.preventDefault();
        this.onDrag({
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        });
      }
    };

    _proto.onTouchEnd = function onTouchEnd(e) {
      this.originalEvent = e;
      this.target = e.target;
      this.removeTouchListeners();
      this.onDrag(this.position);
      this.onUp();
    };

    _proto.addMouseListeners = function addMouseListeners() {
      document.addEventListener('mousemove', this.onMouseMove, this.options);
      document.addEventListener('mouseup', this.onMouseUp, this.options);
    };

    _proto.addTouchListeners = function addTouchListeners() {
      document.addEventListener('touchend', this.onTouchEnd, this.options);
      document.addEventListener('touchmove', this.onTouchMove, this.options);
    };

    _proto.removeMouseListeners = function removeMouseListeners() {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    };

    _proto.removeTouchListeners = function removeTouchListeners() {
      document.removeEventListener('touchend', this.onTouchEnd);
      document.removeEventListener('touchmove', this.onTouchMove);
    };

    return DragListener;
  }();

  var TotalLookCardComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(TotalLookCardComponent, _Component);

    function TotalLookCardComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = TotalLookCardComponent.prototype;

    _proto.onInit = function onInit(node) {
      this.item = node.hasAttribute('data-item') ? new Function("return " + node.getAttribute('data-item'))() : {};
      this.item.info = node.querySelector('.group--info').innerHTML;
      this.buy = node.querySelector('.btn--buy');
      this.addListeners();
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners();
    };

    _proto.onResize = function onResize() {// console.log('TotalLookCardComponent.onResize');
    };

    _proto.onClick = function onClick(event) {
      if (window.innerWidth >= 1024) {
        event.preventDefault(); // console.log('TotalLookCardComponent.onClick');

        this.emit('click');
      }
    };

    _proto.onBuyClick = function onBuyClick() {
      // console.log('TotalLookCardComponent.onBuyClick');
      window.location.href = this.node.getAttribute('href');
    };

    _proto.addListeners = function addListeners() {
      // this.onResize = this.onResize.bind(this);
      this.onClick = this.onClick.bind(this);
      this.onBuyClick = this.onBuyClick.bind(this); // window.addEventListener('resize', this.onResize);

      this.node.addEventListener('click', this.onClick);
      this.buy.addEventListener('click', this.onBuyClick);
    };

    _proto.removeListeners = function removeListeners() {
      // window.removeEventListener('resize', this.onResize);
      this.node.removeEventListener('click', this.onClick);
      this.buy.removeEventListener('click', this.onBuyClick);
    };

    _proto.update = function update() {
      if (this.item.active) {
        this.node.classList.add('active');
      } else {
        this.node.classList.remove('active');
      }
    };

    return TotalLookCardComponent;
  }(Component);

  var TotalLookPinComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(TotalLookPinComponent, _Component);

    function TotalLookPinComponent(item) {
      var _this;

      _this = _Component.call(this) || this;
      _this.item = item;
      return _this;
    }

    var _proto = TotalLookPinComponent.prototype;

    _proto.onInit = function onInit(node) {
      this.info = this.node.querySelector('.info');
      this.content = this.node.querySelector('.content');
      this.arrow = this.node.querySelector('.arrow');
      this.addListeners();
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners();
    };

    _proto.onResize = function onResize() {
      // console.log('TotalLookPinComponent.onResize');
      this.emit('click');
    };

    _proto.onClick = function onClick() {
      // console.log('TotalLookPinComponent.onClick');
      this.emit('click');
    };

    _proto.addListeners = function addListeners() {
      // this.onResize = this.onResize.bind(this);
      this.onClick = this.onClick.bind(this); // window.addEventListener('resize', this.onResize);

      this.node.addEventListener('click', this.onClick);
    };

    _proto.removeListeners = function removeListeners() {
      // window.removeEventListener('resize', this.onResize);
      this.node.removeEventListener('click', this.onClick);
    };

    _proto.render = function render() {
      return (
        /* html */
        "<div class=\"pin\">\n\t\t\t<div class=\"info\">\n\t\t\t\t<div class=\"content\">" + this.item.info + "</div>\n\t\t\t\t<div class=\"arrow\"></div>\n\t\t\t</div>\n\t\t</div>"
      );
    };

    _proto.update = function update() {
      if (this.item.active) {
        this.node.classList.add('active', 'active-info');
      } else {
        this.node.classList.remove('active', 'active-info');
      }
    };

    return TotalLookPinComponent;
  }(Component);

  var to;

  var TotalLookComponent = /*#__PURE__*/function (_Component) {
    _inheritsLoose(TotalLookComponent, _Component);

    function TotalLookComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = TotalLookComponent.prototype;

    _proto.onInit = function onInit(node) {
      var _this = this;

      // console.log('TotalLookComponent', node);
      this.groupLook = node.querySelector('.group--look');
      this.picture = node.querySelector('.group--look .picture');
      this.listing = node.querySelector('.listing--products');
      this.listingInner = node.querySelector('.listing--products__inner');
      this.cards = Array.prototype.slice.call(node.querySelectorAll('.card--product')).map(function (x) {
        return new TotalLookCardComponent().setNode(x);
      });
      this.pins = this.cards.map(function (x) {
        return new TotalLookPinComponent(x.item).setParentNode(_this.picture);
      });
      this.more = node.querySelector('.btn--more');
      this.close = node.querySelector('.btn--close');
      this.addListeners();
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners();
    };

    _proto.onImage = function onImage(img) {
      this.img = img;
      this.node.classList.add('init');
      this.addDragListener();

      if (this.cards.length && window.innerWidth >= 1024) {
        this.setActive(this.cards[0].item, true);
      } else {
        this.onResize(true);
      }
    };

    _proto.loadImage = function loadImage() {
      var _this2 = this;

      var img = this.node.querySelector('.group--look img');
      var loader = new Image();

      loader.onload = function () {
        _this2.onImage(img);
      };

      loader.src = img.src;
    };

    _proto.setActive = function setActive(item, immediate) {
      if (immediate === void 0) {
        immediate = false;
      }

      this.cards.forEach(function (x) {
        x.item !== item ? x.item.active = false : x.item.active = true;
        x.update();
      });
      this.pins.forEach(function (x) {
        return x.update();
      });
      this.onResize(immediate);
    };

    _proto.onResize = function onResize(event) {
      var _this3 = this;

      this.windowWidth = window.innerWidth;
      var img = this.img;
      var groupLook = this.groupLook;
      var picture = this.picture;
      var containerWidth = groupLook.offsetWidth;
      var containerHeight = groupLook.offsetHeight;
      var containerRatio = containerWidth / containerHeight;
      var imgRatio = img.naturalWidth / img.naturalHeight;
      var imageWidth, imageHeight;

      if (containerRatio > imgRatio) {
        imageWidth = groupLook.offsetWidth;
        imageHeight = groupLook.offsetWidth / imgRatio;
        this.direction = 'vertical';
      } else {
        imageWidth = groupLook.offsetHeight * imgRatio;
        imageHeight = groupLook.offsetHeight;
        this.direction = 'horizontal';
      }

      picture.style.width = imageWidth + "px";
      picture.style.height = imageHeight + "px";
      this.containerWidth = containerWidth;
      this.containerHeight = containerHeight;
      this.imageWidth = imageWidth;
      this.imageHeight = imageHeight;
      this.cards.forEach(function (card, i) {
        var listingInnerWidth = Math.ceil(card.node.getBoundingClientRect().width) * Math.ceil(_this3.cards.length / 2);

        if (i === 0) {
          _this3.listingInner.style.minWidth = listingInnerWidth + "px";
        }

        if (card.item.active) {
          var _dx = containerWidth - listingInnerWidth;

          var translation = _this3.getTranslate(_this3.listingInner);

          var _x = _this3.listing.getBoundingClientRect().left - card.node.getBoundingClientRect().left + translation.x;

          _x = Math.min(0, Math.max(_dx, _x));
          (event ? gsap.set : gsap.to)(_this3.listingInner, {
            x: _x,
            duration: 0.3,
            delay: 0.1,
            overwrite: true
          });
        }

        _this3.listingInnerWidth = listingInnerWidth;
      });
      var pinPosition = {
        x: 0,
        y: 0
      };
      this.pins.forEach(function (pin) {
        var pinX = imageWidth / img.naturalWidth * pin.item.position.x;
        var pinY = imageWidth / img.naturalWidth * pin.item.position.y;
        pin.item.pinX = pinX;
        pin.item.pinY = pinY;
        gsap.set(pin.node, {
          x: pinX,
          y: pinY
        }); // fix baloon position x

        if (pinX < 110) {
          gsap.set(pin.content, {
            x: Math.max(0, 110 - pinX)
          });
        } else if (pinX > imageWidth - 110) {
          gsap.set(pin.content, {
            x: Math.min(0, imageWidth - 110 + pinX)
          });
        }

        if (pin.item.active) {
          pinPosition.x = pinX;
          pinPosition.y = pinY;
        }
      });
      var dx = containerWidth - imageWidth;
      var dy = containerHeight - imageHeight;
      var x = containerWidth / 2 - pinPosition.x;
      var y = containerHeight / 2 - pinPosition.y;

      if (event) {
        gsap.set(this.picture, {
          x: Math.min(0, Math.max(dx, x)),
          y: Math.min(0, Math.max(dy, y))
        });
        this.onPictureUpdate();
      } else {
        gsap.to(this.picture, {
          x: Math.min(0, Math.max(dx, x)),
          y: Math.min(0, Math.max(dy, y)),
          duration: 0.3,
          overwrite: true,
          onUpdate: this.onPictureUpdate,
          callbackScope: this
        });
      }
    };

    _proto.onPictureUpdate = function onPictureUpdate() {
      if (this.windowWidth < 1024) {
        var pin = this.pins.find(function (x) {
          return x.item.active;
        });

        if (pin) {
          console.log(pin, pin.item.pinX);
        }
      }
    };

    _proto.onWheel = function onWheel(event) {
      // console.log(event.deltaY);
      event.preventDefault();
      var dx = this.containerWidth - this.listingInnerWidth;
      var translation = this.getTranslate(this.listingInner);
      var x = translation.x - event.deltaY;
      x = Math.min(0, Math.max(dx, x));
      gsap.to(this.listingInner, {
        x: x,
        duration: 0.3,
        overwrite: true
      });
    };

    _proto.onDelayedResize = function onDelayedResize() {
      gsap.set(this.listingInner, {
        x: 0
      });
      to ? clearTimeout(to) : null;
      to = setTimeout(this.onResize, 5);
    };

    _proto.onOpenPanel = function onOpenPanel() {
      this.listing.classList.add('opened');
    };

    _proto.onClosePanel = function onClosePanel() {
      this.listing.classList.remove('opened');
    };

    _proto.addListeners = function addListeners() {
      var _this4 = this;

      this.loadImage();
      this.onResize = this.onResize.bind(this);
      this.onDelayedResize = this.onDelayedResize.bind(this);
      this.onWheel = this.onWheel.bind(this);
      this.onOpenPanel = this.onOpenPanel.bind(this);
      this.onClosePanel = this.onClosePanel.bind(this);
      window.addEventListener('resize', this.onDelayedResize);
      this.listing.addEventListener('mousewheel', this.onWheel);
      this.more.addEventListener('click', this.onOpenPanel);
      this.close.addEventListener('click', this.onClosePanel);
      this.cards.forEach(function (x) {
        x.on('click', function () {
          // console.log('TotalLookComponent.card.click', x.item);
          _this4.setActive(x.item);

          _this4.node.classList.remove('open');

          _this4.node.classList.remove('show-hint');
        });
      });
      this.pins.forEach(function (x) {
        x.on('click', function () {
          // console.log('TotalLookComponent.pin.click', x.item);
          _this4.setActive(x.item);

          _this4.node.classList.add('open');

          _this4.node.classList.remove('show-hint');
        });
      });
    };

    _proto.removeListeners = function removeListeners() {
      this.removeDragListener();
      window.removeEventListener('resize', this.onResize);
      this.listing.removeEventListener('mousewheel', this.onWheel);
      this.more.removeEventListener('click', this.onOpenPanel);
      this.close.removeEventListener('click', this.onClosePanel);
    };

    _proto.addDragListener = function addDragListener() {
      var _this5 = this;

      var picture = this.picture;
      var translation = {
        x: 0,
        y: 0
      };
      this.draglistener = new DragListener(this.groupLook, function (e) {
        translation = _this5.getTranslate(picture);

        _this5.node.classList.remove('open');

        _this5.node.classList.remove('show-hint');

        _this5.node.classList.add('grabbing');

        _this5.pins.forEach(function (x) {
          return x.node.classList.remove('active-info');
        });
      }, function (e) {
        var dx = _this5.containerWidth - _this5.imageWidth;
        var dy = _this5.containerHeight - _this5.imageHeight;
        var x = translation.x + e.distance.x;
        var y = translation.y + e.distance.y;
        gsap.to(picture, {
          x: Math.min(0, Math.max(dx, x)),
          y: Math.min(0, Math.max(dy, y)),
          duration: 0.3,
          overwrite: true,
          onUpdate: _this5.onPictureUpdate,
          callbackScope: _this5
        });
      }, function (e) {
        //
        _this5.node.classList.remove('grabbing');
      });
    };

    _proto.removeDragListener = function removeDragListener() {
      if (this.draglistener) {
        this.draglistener.destroy();
      }
    };

    _proto.getTranslate = function getTranslate(node) {
      var x = 0,
          y = 0;
      var transform = node.style.transform;

      if (transform) {
        var coords = transform.split('(')[1].split([')'])[0].split(',');
        x = parseFloat(coords[0]);
        y = parseFloat(coords[1]);
      }

      return {
        x: x,
        y: y
      };
    };

    _createClass(TotalLookComponent, [{
      key: "direction",
      set: function set(direction) {
        if (this.direction_ !== direction) {
          this.direction_ = direction;

          if (direction === 'vertical') {
            this.node.classList.add('vertical');
            this.node.classList.remove('horizontal');
          } else {
            this.node.classList.add('horizontal');
            this.node.classList.remove('vertical');
          }

          this.node.classList.add('show-hint');
        }
      }
    }]);

    return TotalLookComponent;
  }(Component);

  var Main = /*#__PURE__*/function () {
    function Main() {
      var components = this.addComponents();
    }

    var _proto = Main.prototype;

    _proto.addComponents = function addComponents() {
      var SELECTORS = {
        '[total-look]': TotalLookComponent
      };
      var instances = [];

      var _loop = function _loop(key) {
        instances = instances.concat(Array.from(document.querySelectorAll(key)).map(function (node) {
          var instance = new SELECTORS[key]().setNode(node);
          instance.on('click', function () {
            alert('clicked');
          });
          return instance;
        }));
      };

      for (var key in SELECTORS) {
        _loop(key);
      }

      instances.forEach(function (x) {
        return console.log(x);
      });
      return instances;
    };

    return Main;
  }();
  var main = new Main();

  return Main;

})));
