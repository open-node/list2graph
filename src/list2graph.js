const Actor = require("./actor");

const defineOption = {
  range: [1, Infinity], // 值的区间
  split: 2, // 区间分割点
  width: 1200, // canvas 的宽度，高度是动态计算的
  leftWidth: 120, // 左侧边栏的宽度
  bottomHeight: 60, // 底部高度
  maxLength: 20, // 最大长度
  valueFormat(x) {
    // 值格式化函数
    return x;
  },
  nameFormat(x) {
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
  const opt = Object.assign({}, defineOption, option);
  const ctx = canvas.getContext("2d");

  // 每一行数据的处理函数
  const trans = item => {
    const obj = {};
    obj.name = item.name;
    obj.value = item.value;
    obj.nameDisplay = opt.nameFormat(item.name, item);
    obj.valueDisplay = opt.valueFormat(item.value, item);

    return obj;
  };

  // 数据
  let data = list.slice(0, opt.maxLength).map(trans);
  // 角色
  const actors = [];

  // 状态，stable: 稳定，ready: 准备动态状态， animation: 动画
  let status = "ready";
  let lastRequestAnimationAt = Date.now();
  let dt = 1; // 两次动画之间的时间间隔，单位毫秒
  const distance = (opt.width - opt.leftWidth) >> 1; // 左侧到右侧的距离
  // 加速度, 根据公式 s = 1 / 2 * a * t² 求得
  const aVelocity = (distance * 2) / (opt.animationMS * opt.animationMS);
  let velocity = aVelocity * opt.animationMS; // 运动的初始速度，v = at;
  const beginX = opt.leftWidth + (distance >> 1); // 开始的 X 坐标
  let height = opt.lineHeight * opt.maxLength + opt.bottomHeight; // 计算画本应该的高度
  const nameHeight = parseInt(opt.nameFont, 10); // 计算左侧名称显示的高度
  const rangeHeight = parseInt(opt.rangeFont, 10); // 计算底部区间显示的高度

  const ready = () => {
    height = opt.lineHeight * data.length + opt.bottomHeight; // 计算画本应该的高度
    canvas.width = opt.width;
    canvas.height = height;
    canvas.style.width = opt.width >> 1;
    canvas.style.height = height >> 1;
    // 清空角色
    actors.length = 0;
    for (let i = 0; i < data.length; i += 1) {
      const actor = new Actor(ctx, data[i], actors[i - 1], opt);
      actor.x = beginX;
      actor.y = i * opt.lineHeight + (opt.lineHeight >> 1);
      actor.isRight = opt.split <= data[i].value;
      actors.push(actor);
    }
    status = "animation";
    dx = 0;
    velocity = aVelocity * opt.animationMS;
  };

  let dx = 0;
  const update = () => {
    dx += velocity * dt;
    velocity -= aVelocity * dt;
    if (velocity <= 0) dx = distance;

    const x = beginX + dx;

    for (let i = 0; i < data.length; i += 1) {
      const actor = actors[i];
      if (!actor.isRight) continue;
      actor.x = x;
    }
  };

  const drawExtra = () => {
    ctx.save();
    ctx.strokeStyle = opt.tableColor;
    ctx.lineWidth = opt.tableBorderWidth;
    ctx.beginPath();
    // 绘制表格
    const leftX = opt.leftWidth;
    // 绘制横线
    for (let i = 0; i <= data.length; i += 1) {
      ctx.moveTo(
        leftX - opt.tableSurplus,
        i * opt.lineHeight + opt.tableBorderWidth / 2
      );
      ctx.lineTo(opt.width, i * opt.lineHeight + opt.tableBorderWidth / 2);
    }
    // 绘制纵线
    ctx.moveTo(leftX, 0);
    ctx.lineTo(leftX, opt.lineHeight * data.length + opt.tableSurplus);
    ctx.moveTo(opt.leftWidth + distance, 0);
    ctx.lineTo(
      opt.leftWidth + distance,
      opt.lineHeight * data.length + opt.tableSurplus
    );
    ctx.moveTo(opt.width - (opt.tableBorderWidth >> 1), 0);
    ctx.lineTo(
      opt.width - (opt.tableBorderWidth >> 1),
      opt.lineHeight * data.length + opt.tableSurplus
    );

    // 绘制底部指向区间范围的小短线
    ctx.moveTo(beginX, data.length * opt.lineHeight);
    ctx.lineTo(beginX, data.length * opt.lineHeight + opt.tableSurplus);
    ctx.moveTo(beginX + distance, data.length * opt.lineHeight);
    ctx.lineTo(
      beginX + distance,
      data.length * opt.lineHeight + opt.tableSurplus
    );

    // 绘制左侧文字
    ctx.textAlign = "right";
    ctx.font = opt.nameFont;
    ctx.fillStyle = opt.nameColor;
    for (let i = 0; i < data.length; i += 1) {
      ctx.fillText(
        data[i].nameDisplay,
        opt.leftWidth - opt.tableSurplus - 6,
        (i + 1) * opt.lineHeight + nameHeight / 3 - (opt.lineHeight >> 1)
      );
    }

    // 绘制底部区间文字
    ctx.fillStyle = opt.rangeColor;
    ctx.font = opt.rangeFont;
    ctx.textAlign = "center";
    ctx.fillText(
      `[${opt.range[0]}, ${opt.split})`,
      beginX,
      data.length * opt.lineHeight + opt.tableSurplus + rangeHeight
    ); // 左侧区间
    ctx.fillText(
      `[${opt.split}, ${opt.range[1] === Infinity ? "♾" : opt.range[1]})`,
      beginX + distance,
      data.length * opt.lineHeight + opt.tableSurplus + rangeHeight
    ); // 右侧区间
    ctx.stroke();
    ctx.restore();
  };

  const render = () => {
    requestAnimationFrame(render);
    const now = Date.now();
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
    for (let i = actors.length - 1; 0 <= i; i -= 1) {
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
  const add = item => {
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
  const reset = ls => {
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
  const split = value => {
    if (value == null) return opt.split;
    if (value < opt.range[0] || opt.range[1] < value)
      throw Error(`分割点不合法, 必须在 ${opt.range} 之间`);
    opt.split = value;
    status = "ready";
    return value;
  };

  return { add, split, reset };
}

module.exports = List2graph;
