
const m = require('./modules');

const modules = m.createModules();

// объявление модуля A
modules.define("A", [], (provide) => {
  provide(1);
  provide(10);
});
// объявление модуля B
modules.define("B", [], (provide) => {
  setTimeout(() => {
    provide(2);
  }, 2000);
});
// Полезная логика
modules.require(["A", "B"], (A, B) => {
  console.log(A + B); // 1 + 2 = 3
});
// вывод для проверки асинхронности require
console.log(4); // 4
