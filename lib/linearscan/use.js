'use strict';

function Use(pos, value) {
  this.pos = pos;
  this.value = value;
}
module.exports = Use;

Use.sort = function sort(a, b) {
  return a.pos - b.pos;
};

Use.needleSort = function needleSort(a, b) {
  return a.pos - b;
};

Use.prototype.merge = function merge(other) {
  var res = this.value.merge(other.value);
  if (res === false)
    return false;
  this.value = res;
  return true;
};

Use.prototype.inspect = function inspect() {
  return '{' + this.pos + '=' + this.value.inspect() + '}';
};
