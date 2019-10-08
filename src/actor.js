/**
 * Actor 类
 * @class
 * @param {Game} game 游戏实例
 * @return {Actor} Instance
 */
class Actor {
  /** Create a actor instance */
  constructor(ctx, item, pre, opt) {
    this.ctx = ctx;
    /* 角色 x 坐标值 */
    this.x = 0;

    /* 角色 y 坐标值 */
    this.y = 0;

    /* 角色 宽度 */
    const measureText = ctx.measureText(item.valueDisplay);
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
  render() {
    const { ctx, item, pre, opt, x, y, w, h } = this;
    // 圆角半径
    const radius = h / 2 + opt.padding;

    // 左X坐标
    const leftX = x - w / 2 - radius - 5;
    // 上Y坐标
    const topY = y - radius;

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

  roundRect(x, y, w, h, r) {
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
}

module.exports = Actor;
