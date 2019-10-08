const List2graph = require("./list2graph");

const params = (() => {
  const hash = {};
  const pairs = window.location.search.slice(1).split("&");
  for (const x of pairs) {
    const [k, v] = x.split("=");
    hash[k] = decodeURIComponent(v);
  }

  return hash;
})();

const num = Math.max(1, params.num | 0);
const randomItem = () => ({
  name: Math.random()
    .toString()
    .slice(2, 8),
  value: ((Math.random() * 400) | 0) / 100
});

const main = () => {
  const canvas = document.getElementById("myCanvas");
  const addBtn = document.getElementById("add-item");
  const resetBtn = document.getElementById("reset-btn");
  const splitBtn = document.getElementById("split-enter");
  const splitInput = document.getElementById("split-value");
  const list = [];
  for (let i = 0; i < num; i += 1) list.push(randomItem());
  const list2graph = new List2graph(canvas, list, {
    valueFormat(x) {
      return `${Math.floor(x * 100) / 100}`;
    }
  });

  addBtn.onclick = () => {
    list2graph.add(randomItem());
  };

  splitBtn.onclick = () => {
    list2graph.split(splitInput.value | 0);
  };

  resetBtn.onclick = () => {
    const ls = [];
    for (let i = 0; i < num; i += 1) ls.push(randomItem());
    list2graph.reset(ls);
  };
};

main();
