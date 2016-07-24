'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _leaflet = require('leaflet');

var _LeafletCoordinates = require('./Leaflet.Coordinates-0.1.5.src');

var _reactLeaflet = require('react-leaflet');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CoordinatesComponent = function (_MapControl) {
  _inherits(CoordinatesComponent, _MapControl);

  function CoordinatesComponent() {
    _classCallCheck(this, CoordinatesComponent);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CoordinatesComponent).apply(this, arguments));
  }

  _createClass(CoordinatesComponent, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _props = this.props;
      var _map = _props.map;

      var props = _objectWithoutProperties(_props, ['map']);

      this.leafletElement = _leaflet.control.coordinates(this.props);
    }
  }]);

  return CoordinatesComponent;
}(_reactLeaflet.MapControl);

CoordinatesComponent.propTypes = {
  decimals: _react.PropTypes.number,
  decimalSeperator: _react.PropTypes.string,
  labelTemplateLat: _react.PropTypes.string,
  labelTemplateLng: _react.PropTypes.string,
  useDMS: _react.PropTypes.bool,
  useLatLngOrder: _react.PropTypes.bool
};
exports.default = CoordinatesComponent;