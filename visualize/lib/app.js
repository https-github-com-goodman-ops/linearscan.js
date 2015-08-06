'use strict';

var linearscan = require('../../');
var pipeline = require('json-pipeline');

var Input = require('./input');
var Intervals = require('./intervals');

function App(options) {
  var self = this;

  this.config = linearscan.config.create(options.config);

  this.input = new Input(options.input);
  this.reindexed = new Input(options.reindexed);
  this.input.on('change', function(text) {
    try {
      self.onChange(text);
    } catch (e) {
      console.error(e);
    }
  });

  this.intervals = new Intervals(options.intervals);
}
module.exports = App;

App.prototype.onChange = function onChange(text) {
  var p = pipeline.create('dominance');
  var reindexed;
  try {
    text = 'pipeline {\n' + text + '\n}';
    p.parse(text, { cfg: true, dominance: true }, 'printable');
    p.reindex();

    reindexed = p.render({ cfg: true, dominance: true }, 'printable');
  } catch (e) {
    return;
  }

  this.reindexed.update(reindexed.replace(/^[^\n]+\n|\n[^\n]+$/g, ''));

  p = pipeline.create('dominance');
  p.parse(reindexed, { cfg: true, dominance: true }, 'printable');
  p.reindex();

  var builder = linearscan.builder.create(p, this.config);

  builder.buildIntervals();

  this.render();
};

App.prototype.render = function render() {
  this.intervals.update(this.config);
};