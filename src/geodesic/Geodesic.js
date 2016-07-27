import React, { PropTypes} from 'react'
import geodesic from './Leaflet.Geodesic'
import {Path} from 'react-leaflet';

class GeodesicPolyline extends Path {
    componentWillMount() {
        super.componentWillMount();
        const {map: _map, layerContainer: _lc, latlngs, ...props } = this.props;
        const fixed_latlngs = [[latlngs[0].lat, latlngs[0].lng], [latlngs[0].lat, latlngs[0].lng]];
        this.leafletElement = L.geodesic([latlngs], props);
    }

    componentDidUpdate(prevProps) {
        this.leafletElement.setLatLngs([this.props.latlngs]);
    }

    distance() {
        let result = this.leafletElement._vincenty_inverse(this.props.latlngs[0], this.props.latlngs[1]);
        return result.distance;
    }

   getVertexes()
    {
        return this.leafletElement.getLatLngs();
    }
}

GeodesicPolyline.propTypes = {
    latlngs: PropTypes.array
};

export default GeodesicPolyline;