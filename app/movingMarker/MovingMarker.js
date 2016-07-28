import React, { PropTypes} from 'react';
import {bearingTo} from './LatLng_Bearings'
import movingMarker from './moving.marker.leaflet'
import {Path} from 'react-leaflet';

class MovingMarker extends Path {
     componentWillMount() {
        super.componentWillMount();
        const {map: _map, layerContainer: _lc, latlngs, options,  duration, ...props } = this.props;
        this.leafletElement = new L.Marker.movingMarker(latlngs, duration, options);
    }

    componentDidUpdate(prevProps) {
       
    }
   
}

//{autostart: true}

MovingMarker.propTypes = {
    latlngs: PropTypes.array,
    duration: PropTypes.array,
    action: PropTypes.string
};

export default MovingMarker;