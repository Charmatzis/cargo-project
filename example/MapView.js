import React from 'react';
import { Map, Circle, TileLayer, LayersControl, FeatureGroup, ImageOverlay, Marker, Popup } from 'react-leaflet'
import { CoordinatesComponent, Control, MovingMarker} from './maputilimports'
import {BingLayer} from 'react-leaflet-bing'
import {GoogleLayer} from 'react-leaflet-google'

const { BaseLayer, Overlay } = LayersControl;
const position = [59, -104];
const zoom = 3;


export default class MapView extends React.Component {
  constructor() {
    super();


    this.state = {
     
    };
  }

  render() {
    return (
      
        <Map id='map' center={[42.09618442380296, -71.5045166015625]} zoom={2} zoomControl={true}>
          <LayersControl position='topright'   >
            <BaseLayer checked name='OpenStreetMap'>
              <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'/>
            </BaseLayer>                 
          </LayersControl>
          <CoordinatesComponent position='bottomleft' decimals={6} decimalSeperator=',' useDMS={false}/>        
        </Map>
      
    );
  }
}

