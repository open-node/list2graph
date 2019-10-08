(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Actor 类
 * @class
 * @param {Game} game 游戏实例
 * @return {Actor} Instance
 */
var Actor = function () {
  /** Create a actor instance */
  function Actor(ctx, item, pre, opt) {
    _classCallCheck(this, Actor);

    this.ctx = ctx;
    /* 角色 x 坐标值 */
    this.x = 0;

    /* 角色 y 坐标值 */
    this.y = 0;

    /* 角色 宽度 */
    var measureText = ctx.measureText(item.valueDisplay);
    this.w = measureText.width;

    /* 角色 高度 */
    this.h = parseInt(opt.font, 10);

    this.item = item;
    this.pre = pre;
    this.opt = opt;
  }

  /**
   * 渲染自己
   *
   * @return {void}
   */


  _createClass(Actor, [{
    key: "render",
    value: function render() {
      var ctx = this.ctx,
          item = this.item,
          pre = this.pre,
          opt = this.opt,
          x = this.x,
          y = this.y,
          w = this.w,
          h = this.h;
      // 圆角半径

      var radius = h / 2 + opt.padding;

      // 左X坐标
      var leftX = x - w / 2 - radius - 5;
      // 上Y坐标
      var topY = y - radius;

      // 绘制连接线
      if (pre) {
        ctx.beginPath();
        ctx.moveTo(pre.x, pre.y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = opt.color;
        ctx.lineWidth = opt.lineWidth;
        ctx.stroke();
      }

      // 绘制圆角背景
      this.roundRect(leftX, topY, w + radius * 2 + 10, radius * 2, radius);
      // 设置填充色
      ctx.fillStyle = opt.color;
      ctx.fill();

      // 绘制文字
      ctx.textAlign = "center";
      ctx.fillStyle = opt.valueColor;
      ctx.fillText(item.valueDisplay, x, y + h / 3);
    }
  }, {
    key: "roundRect",
    value: function roundRect(x, y, w, h, r) {
      if (w < 2 * r) {
        r = w / 2;
      }
      if (h < 2 * r) {
        r = h / 2;
      }
      this.ctx.beginPath();
      this.ctx.moveTo(x + r, y);
      this.ctx.arcTo(x + w, y, x + w, y + h, r);
      this.ctx.arcTo(x + w, y + h, x, y + h, r);
      this.ctx.arcTo(x, y + h, x, y, r);
      this.ctx.arcTo(x, y, x + w, y, r);
      this.ctx.closePath();
    }
  }]);

  return Actor;
}();

module.exports = Actor;
},{}],2:[function(require,module,exports){
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var List2graph = require("./list2graph");

var params = function () {
  var hash = {};
  var pairs = window.location.search.slice(1).split("&");
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = pairs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var x = _step.value;

      var _x$split = x.split("="),
          _x$split2 = _slicedToArray(_x$split, 2),
          k = _x$split2[0],
          v = _x$split2[1];

      hash[k] = decodeURIComponent(v);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return hash;
}();

var num = Math.max(1, params.num | 0);
var randomItem = function randomItem() {
  return {
    name: Math.random().toString().slice(2, 8),
    value: (Math.random() * 400 | 0) / 100
  };
};

var main = function main() {
  var canvas = document.getElementById("myCanvas");
  var addBtn = document.getElementById("add-item");
  var resetBtn = document.getElementById("reset-btn");
  var splitBtn = document.getElementById("split-enter");
  var splitInput = document.getElementById("split-value");
  var list = [];
  for (var i = 0; i < num; i += 1) {
    list.push(randomItem());
  }var list2graph = new List2graph(canvas, list, {
    valueFormat: function valueFormat(x) {
      return "" + Math.floor(x * 100) / 100;
    }
  });

  addBtn.onclick = function () {
    list2graph.add(randomItem());
  };

  splitBtn.onclick = function () {
    list2graph.split(splitInput.value | 0);
  };

  resetBtn.onclick = function () {
    var ls = [];
    for (var _i = 0; _i < num; _i += 1) {
      ls.push(randomItem());
    }list2graph.reset(ls);
  };
};

main();
},{"./list2graph":3}],3:[function(require,module,exports){
"use strict";

var Actor = require("./actor");

var defineOption = {
  range: [1, Infinity], // 值的区间
  split: 2, // 区间分割点
  width: 1200, // canvas 的宽度，高度是动态计算的
  leftWidth: 120, // 左侧边栏的宽度
  bottomHeight: 60, // 底部高度
  maxLength: 20, // 最大长度
  valueFormat: function valueFormat(x) {
    // 值格式化函数
    return x;
  },
  nameFormat: function nameFormat(x) {
    // 名称格式化函数
    return x;
  },

  tableSurplus: 10, // 表格左侧和底部露头的长度
  tableBorderWidth: 1, // 表格边框接线宽度
  animationMS: 1000, // 动态效果时长，单位毫秒
  color: "#43e28b", // item以及连线的颜色
  tableColor: "#363e63", // 表格颜色, 巧妙的利用表格颜色，可以做出表格不存在的效果
  nameFont: "24px serif", // 左侧名称字体设定
  rangeFont: "24px serif", // 底部区间显示的颜色
  nameColor: "#7685bc", // 左侧name显示的颜色
  rangeColor: "#7685bc", // 底部区间显示的颜色
  valueColor: "#ffffff", // 值的显示颜色
  padding: 10, // 文字内容和容器的内间距
  font: "24px serif", // 图标文字大小以及字体设定
  lineHeight: 60, // 每一个对象占用的行高
  lineWidth: 4 // 连接线的宽度
};

/**
 * @param {element} canvas 绘图的canvas元素对象
 * @param {Array.Object} list 初始的绘图数据 {name: 'xxx', value: 121}
 * @param {Object} [option] 可选参数，用来控制某些绘图细节
 *
 * @class
 * @return {List2graph} Instance
 */
function List2graph(canvas, list, option) {
  var opt = Object.assign({}, defineOption, option);
  var ctx = canvas.getContext("2d");

  // 每一行数据的处理函数
  var trans = function trans(item) {
    var obj = {};
    obj.name = item.name;
    obj.value = item.value;
    obj.nameDisplay = opt.nameFormat(item.name, item);
    obj.valueDisplay = opt.valueFormat(item.value, item);

    return obj;
  };

  // 数据
  var data = list.slice(0, opt.maxLength).map(trans);
  // 角色
  var actors = [];

  // 状态，stable: 稳定，ready: 准备动态状态， animation: 动画
  var status = "ready";
  var lastRequestAnimationAt = Date.now();
  var dt = 1; // 两次动画之间的时间间隔，单位毫秒
  var distance = opt.width - opt.leftWidth >> 1; // 左侧到右侧的距离
  // 加速度, 根据公式 s = 1 / 2 * a * t² 求得
  var aVelocity = distance * 2 / (opt.animationMS * opt.animationMS);
  var velocity = aVelocity * opt.animationMS; // 运动的初始速度，v = at;
  var beginX = opt.leftWidth + (distance >> 1); // 开始的 X 坐标
  var height = opt.lineHeight * opt.maxLength + opt.bottomHeight; // 计算画本应该的高度
  var nameHeight = parseInt(opt.nameFont, 10); // 计算左侧名称显示的高度
  var rangeHeight = parseInt(opt.rangeFont, 10); // 计算底部区间显示的高度

  var ready = function ready() {
    height = opt.lineHeight * data.length + opt.bottomHeight; // 计算画本应该的高度
    canvas.width = opt.width;
    canvas.height = height;
    canvas.style.width = opt.width >> 1;
    canvas.style.height = height >> 1;
    // 清空角色
    actors.length = 0;
    for (var i = 0; i < data.length; i += 1) {
      var actor = new Actor(ctx, data[i], actors[i - 1], opt);
      actor.x = beginX;
      actor.y = i * opt.lineHeight + (opt.lineHeight >> 1);
      actor.isRight = opt.split <= data[i].value;
      actors.push(actor);
    }
    status = "animation";
    dx = 0;
    velocity = aVelocity * opt.animationMS;
  };

  var dx = 0;
  var update = function update() {
    dx += velocity * dt;
    velocity -= aVelocity * dt;
    if (velocity <= 0) dx = distance;

    var x = beginX + dx;

    for (var i = 0; i < data.length; i += 1) {
      var actor = actors[i];
      if (!actor.isRight) continue;
      actor.x = x;
    }
  };

  var drawExtra = function drawExtra() {
    ctx.save();
    ctx.strokeStyle = opt.tableColor;
    ctx.lineWidth = opt.tableBorderWidth;
    ctx.beginPath();
    // 绘制表格
    var leftX = opt.leftWidth;
    // 绘制横线
    for (var i = 0; i <= data.length; i += 1) {
      ctx.moveTo(leftX - opt.tableSurplus, i * opt.lineHeight + opt.tableBorderWidth / 2);
      ctx.lineTo(opt.width, i * opt.lineHeight + opt.tableBorderWidth / 2);
    }
    // 绘制纵线
    ctx.moveTo(leftX, 0);
    ctx.lineTo(leftX, opt.lineHeight * data.length + opt.tableSurplus);
    ctx.moveTo(opt.leftWidth + distance, 0);
    ctx.lineTo(opt.leftWidth + distance, opt.lineHeight * data.length + opt.tableSurplus);
    ctx.moveTo(opt.width - (opt.tableBorderWidth >> 1), 0);
    ctx.lineTo(opt.width - (opt.tableBorderWidth >> 1), opt.lineHeight * data.length + opt.tableSurplus);

    // 绘制底部指向区间范围的小短线
    ctx.moveTo(beginX, data.length * opt.lineHeight);
    ctx.lineTo(beginX, data.length * opt.lineHeight + opt.tableSurplus);
    ctx.moveTo(beginX + distance, data.length * opt.lineHeight);
    ctx.lineTo(beginX + distance, data.length * opt.lineHeight + opt.tableSurplus);

    // 绘制左侧文字
    ctx.textAlign = "right";
    ctx.font = opt.nameFont;
    ctx.fillStyle = opt.nameColor;
    for (var _i = 0; _i < data.length; _i += 1) {
      ctx.fillText(data[_i].nameDisplay, opt.leftWidth - opt.tableSurplus - 6, (_i + 1) * opt.lineHeight + nameHeight / 3 - (opt.lineHeight >> 1));
    }

    // 绘制底部区间文字
    ctx.fillStyle = opt.rangeColor;
    ctx.font = opt.rangeFont;
    ctx.textAlign = "center";
    ctx.fillText("[" + opt.range[0] + ", " + opt.split + ")", beginX, data.length * opt.lineHeight + opt.tableSurplus + rangeHeight); // 左侧区间
    ctx.fillText("[" + opt.split + ", " + (opt.range[1] === Infinity ? "♾" : opt.range[1]) + ")", beginX + distance, data.length * opt.lineHeight + opt.tableSurplus + rangeHeight); // 右侧区间
    ctx.stroke();
    ctx.restore();
  };

  var render = function render() {
    requestAnimationFrame(render);
    var now = Date.now();
    dt = now - lastRequestAnimationAt;
    lastRequestAnimationAt = now;
    if (status === "stable") return;
    if (status === "ready") {
      ready();
      return;
    }
    update();
    // 清空画布
    ctx.clearRect(0, 0, opt.width, height);
    // 绘制表格以及其他辅助信息
    drawExtra();

    ctx.save();
    ctx.font = opt.font;
    for (var i = actors.length - 1; 0 <= i; i -= 1) {
      actors[i].render();
    }
    ctx.restore();

    if (velocity <= 0) {
      // 再次进入稳定态
      velocity = aVelocity * opt.animationMS;
      dx = 0;
      status = "stable";
    }
  };

  requestAnimationFrame(render);

  /**
   * 重置数据
   * @memberof List2graph
   * @instance
   *
   * @param {Object} item 新增的数据 {name: 'xxx', value: 121}
   * @return {void}
   */
  var add = function add(item) {
    data.unshift(trans(item));
    if (opt.maxLength < data.length) data.length = opt.maxLength;
    status = "ready";
  };

  /**
   * 重置数据
   * @memberof List2graph
   * @instance
   *
   * @param {Array.Object} list 初始的绘图数据 {name: 'xxx', value: 121}
   * @return {void}
   */
  var reset = function reset(ls) {
    data = ls.slice(0, opt.maxLength).map(trans);
    status = "ready";
  };

  /**
   * 读取/重置split
   * @memberof List2graph
   * @instance
   *
   * @param {number} [value] 分隔区间的值, 不指定值则为读取
   * @return {number}
   */
  var split = function split(value) {
    if (value == null) return opt.split;
    if (value < opt.range[0] || opt.range[1] < value) throw Error("\u5206\u5272\u70B9\u4E0D\u5408\u6CD5, \u5FC5\u987B\u5728 " + opt.range + " \u4E4B\u95F4");
    opt.split = value;
    status = "ready";
    return value;
  };

  return { add: add, split: split, reset: reset };
}

module.exports = List2graph;
},{"./actor":1}]},{},[2]);
