import React from 'react';
import { Map, Circle, TileLayer, LayersControl, FeatureGroup, ImageOverlay, Marker, Popup } from 'react-leaflet'
import { CoordinatesComponent, Control, MovingMarker} from './maputilimports'
import {BingLayer} from 'react-leaflet-bing'
import {GoogleLayer} from 'react-leaflet-google'

const { BaseLayer, Overlay } = LayersControl;
const position = [59, -104];
const zoom = 3;
const bing_key = process.env.bing_key;
const google_key= process.env.google_key;


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
              <BaseLayer  name='Bing Maps Satellite'>
              <BingLayer  bingkey={bing_key} />
            </BaseLayer>
            <BaseLayer  name='Bing Maps Satellite with Labels'>
              <BingLayer  bingkey={bing_key} type="AerialWithLabels" />
            </BaseLayer>
            <BaseLayer  name='Google Maps Satellite'>
              <GoogleLayer  type='SATELLITE'/>
            </BaseLayer>
            <BaseLayer  name='Google Maps Hybrid'>
              <GoogleLayer  type='HYBRID'/>
            </BaseLayer>
            <BaseLayer name='Landscape'>
              <TileLayer url='http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'/>
            </BaseLayer>                 
          </LayersControl>
          <CoordinatesComponent position='bottomleft' decimals={6} decimalSeperator=',' useDMS={false}/>        
        </Map>
      
    );
  }
}

