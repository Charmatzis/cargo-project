import { PropTypes } from 'react';
import {control } from 'leaflet';
import {coordinates}  from './Leaflet.Coordinates-0.1.5.src';
import {MapControl } from 'react-leaflet';

export default class CoordinatesComponent extends MapControl {
  static propTypes = {
      decimals: PropTypes.number,
      decimalSeperator: PropTypes.string, 
      labelTemplateLat: PropTypes.string,
      labelTemplateLng: PropTypes.string,
      useDMS: PropTypes.bool,
      useLatLngOrder: PropTypes.bool
  };

  componentWillMount() {
    const {map: _map,   ...props} = this.props;
    this.leafletElement = control.coordinates(this.props);
  }
}