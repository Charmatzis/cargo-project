import React from 'react';
import { Map, Circle, TileLayer, LayersControl, FeatureGroup, ImageOverlay, Marker, Popup, Polyline } from 'react-leaflet'
import { CoordinatesComponent, Control, MovingMarker, GeodesicPolyline} from './maputilimports'
import {BingLayer} from 'react-leaflet-bing'
import {GoogleLayer} from 'react-leaflet-google'

const { BaseLayer, Overlay } = LayersControl;
const position = [59, -104];
const zoom = 3;
const bing_key = "LfO3DMI9S6GnXD7d0WGs~bq2DRVkmIAzSOFdodzZLvw~Arx8dclDxmZA0Y38tHIJlJfnMbGq5GXeYmrGOUIbS2VLFzRKCK0Yv_bAl6oe-DOc"
const google_key = 'AIzaSyCIIiqvrHOLDlKQXKuVN48vRDnE7jwjyjU';


export default class MapView extends React.Component {
  constructor() {
    super();
    this.state = {
      pointA: { lat: 52.5, lng: 13.35 },
      pointB: { lat: 33.82, lng: -118.38 },
      draggable: true,
      distance: 0,
      droneMarkerReady: false,
      durations: [],
      coordinates: []
    };


    this.toggleDraggable = () => {
      this.setState({ draggable: !this.state.draggable })
    }

    this.updatePositionA = () => {
      const { lat, lng } = this.refs.markerA.getLeafletElement().getLatLng();
      this.state.coordinates = this.refs.geodesic.getVertexes();
      this.state.durations = [];
      this.state.coordinates.forEach(function (element) {
        this.state.durations.push(3000);
      }, this);
      this.state.distance = this.refs.geodesic.distance();
      this.setState({
        pointA: { lat, lng }, distance: this.state.distance,
        coordinates: this.state.coordinates, durations: this.state.durations, 
      })
    }

    this.updatePositionB = () => {
      const { lat, lng } = this.refs.markerB.getLeafletElement().getLatLng();
      this.state.coordinates = this.refs.geodesic.getVertexes();
      this.state.durations = [];
      this.state.coordinates.forEach(function (element) {
        this.state.durations.push(3000);
      }, this);
      this.state.distance = this.refs.geodesic.distance();
      this.setState({
        pointB: { lat, lng }, distance: this.state.distance,
        coordinates: this.state.coordinates, durations: this.state.durations,
      })
    }
  }

 
 
  calculateDistance() {

    this.state.coordinates = this.refs.geodesic.getVertexes();
      this.state.durations = [];
      this.state.coordinates.forEach(function (element) {
        this.state.durations.push(3000);
      }, this);

     this.state.distance = this.refs.geodesic.distance();
     this.setState({ distance: this.state.distance,  coordinates: this.state.coordinates,
                     durations: this.state.durations });
     
   }


   


  render() {
    let markerA = (
      <Marker  draggable={this.state.draggable} onDragend={this.updatePositionA.bind(this) }
        position={this.state.pointA} ref='markerA'>
      </Marker>
    )

    let markerB = (
      <Marker draggable={this.state.draggable} onDragend={this.updatePositionB.bind(this) }
        position={this.state.pointB} ref='markerB'>
      </Marker>
    )

    let polyline = [this.state.pointA, this.state.pointB];

    let result = (
      this.state.distance ? (this.state.distance > 10000) ? (this.state.distance / 1000).toFixed(0) + ' km'
        : (this.state.distance).toFixed(0) + ' m'
        : '0'
    ) 

    let distanceDiv = (
      <Control position='topleft'>
        <div className="distance">
          <h2>Distance</h2>
          <h4>{result}</h4>
        </div>
      </Control>
    )


    let shipoptions = {
      autostart: true, loop: true,
      icon: L.icon({
        iconUrl: 'images/drone2.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20], // the same for the shadow
        popupAnchor: [-3, -40] // point from which the popup should open relative to the iconAnchor
      })
    }

    let ship = this.state.droneMarkerReady ? (
      <MovingMarker latlngs={polyline}
        duration={[3000]}
        options={shipoptions}  ref='drone'/>
    ) : null


    return (
      <div id="main">
      <h1>Cargo Project</h1>
      <Map id='map' center={[42.09618442380296, -71.5045166015625]} zoom={2} zoomControl={true}  noWrap={false}>
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
            <GoogleLayer googlekey={google_key}  type='SATELLITE'/>
          </BaseLayer>
          <BaseLayer  name='Google Maps Hybrid'>
            <GoogleLayer googlekey={google_key} type='HYBRID'/>
          </BaseLayer>
          <BaseLayer name='Landscape'>
            <TileLayer url='http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'/>
          </BaseLayer>
        </LayersControl>
        <Polyline color='black' dashArray='15, 20, 5, 20' positions={polyline} />
        <GeodesicPolyline latlngs={polyline} weight={7} opacity= {0.5} color='red' ref='geodesic'	steps= {200} />
        {markerA}
        {markerB}
        {distanceDiv}
        {ship}
        <CoordinatesComponent position='bottomleft' decimals={6} decimalSeperator=',' useDMS={false} enableUserInput={false}/>
      </Map>
      </div>
    );
  }
}

