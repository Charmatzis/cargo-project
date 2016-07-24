'use strict';

var shp = require('shpjs');

L.Shapefile = L.GeoJSON.extend({
  initialize: function initialize(file, options) {
    L.Util.setOptions(this, options);
    L.GeoJSON.prototype.initialize.call(this, {
      features: []
    }, options);
    this.addFileData(file);
  },

  addFileData: function addFileData(file) {
    var self = this;
    this.fire('data:loading');
    shp(file).then(function (data) {
      self.addData(data);
      self.fire('data:loaded');
    });
    return this;
  }
});

L.shapefile = function (a, b, c) {
  return new L.Shapefile(a, b, c);
};