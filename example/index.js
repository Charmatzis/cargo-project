import React from 'react';
import { render } from 'react-dom';
import MapView from "./MapView";



const example = (
  <div id="main">
    <h1>Cargo Project</h1>
    <MapView />    
  </div>
)

render(example, document.getElementById('app'));