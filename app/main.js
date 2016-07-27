import React from 'react';
import { render } from 'react-dom';
import MapView from "./MapView";
import styles from './main.css';
import styless from './Leaflet.Coordinates-0.1.5.css';



const example = (
    <MapView />     
)

render(example, document.getElementById('app'));