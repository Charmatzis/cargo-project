import React, { PropTypes} from 'react';
import {bearingTo} from './LatLng_Bearings'
import MovingMarker from './moving.marker.leaflet'
import {Path} from 'react-leaflet';

class DroneMarker extends Path {
     componentWillMount() {
        super.componentWillMount();
        const {map: _map, layerContainer: _lc, latlngs, options, play, action,  duration, ...props } = this.props;
        this.leafletElement = new L.Marker.movingMarker(latlngs, duration, options);
    }

    componentDidUpdate(prevProps) {
         
        if(this.props.action === 'pause')
        {
            this.leafletElement.pause();
        }
        if(this.props.action === 'play')
        {
            this.leafletElement.start();
        }
       
        if(this.props.action === 'edit')
        {
            this.leafletElement.editLatLng(this.props.droneIndex, this.props.droneVertex, 3000)
        }
         if(this.props.action === 'add')
        {
            this.leafletElement.addLatLng(this.props.droneIndex, this.props.droneVertex);
        }
         if(this.props.action === 'insert')
        {
            this.leafletElement.insertLatLng(this.props.droneIndex, this.props.droneVertex, 3000);
        }
         if(this.props.action === 'delete')
        {
         this.leafletElement.deleteLatLng(this.props.droneIndex);   
        }
    }
   
}

//{autostart: true}

DroneMarker.propTypes = {
    latlngs: PropTypes.array,
    duration: PropTypes.array,
    action: PropTypes.string
};

export default DroneMarker;