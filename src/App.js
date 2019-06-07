import React, {useState} from 'react';
import './App.css';

import ReactMapGL from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {ArcLayer, PolygonLayer} from '@deck.gl/layers';
import {StaticMap} from 'react-map-gl';
import 'mapbox-gl/src/css/mapbox-gl.css';

import ControlPanel from './ControlPanel';

import connections from './data/connections.json';
import neighborhoods from './data/neighborhoods.json';
import buildings from './data/buildings.json';


const MAPBOX_ACCESS_TOKEN = process.env.MapboxAccessToken
  || 'pk.eyJ1IjoianBvb2wiLCJhIjoiY2p3a3RtMXM1MDA4ZTQzcWpwcTMzODQ5cSJ9.fUQlACZ8DGi-nHoTLMpSaA';



function App() {
  const [viewport, setViewport] = useState({
    // latitude: 54.678688,
    // longitude: 25.226252,
    altitude: 1.5,
    bearing: -14.858797972483709,
    height: 969,
    latitude: 54.68058826948631,
    longitude: 25.227326074616954,
    maxPitch: 60,
    maxZoom: 24,
    minPitch: 0,
    minZoom: 0,
    pitch: 41.51658767772512,
    zoom: 16,
  });
  const [tooltip, setTooltip] = useState({
    object: null,
  });
  const [mapStyle, setMapStyle] = useState('mapbox://styles/jpool/cjwl9f7270ovf1cqh1kyn8som');

  const layers = [
    new ArcLayer({
      id: 'connections',
      data: connections,
      pickable: true,
      getWidth: d => d.width || 16,
      getSourcePosition: d => [d.from.coordinates[1], d.from.coordinates[0]],
      getTargetPosition: d => [d.to.coordinates[1], d.to.coordinates[0]],
      getSourceColor: d => d.inbound || [0, 255, 0, 150], // green
      getTargetColor: d => d.outbound || [255, 0, 0, 150], // red
      onClick: t => setTooltip(t),
    }),

    new PolygonLayer({
      id: 'neighborhoods',
      data: neighborhoods.features,
      pickable: true,
      stroked: true,
      filled: true,
      wireframe: true,
      extruded: false,
      lineWidthMinPixels: 1,
      getPolygon: d => d && d.geometry && d.geometry.coordinates,
      getElevation: d => (d && d.properties && d.properties.elevation) || 1,
      getFillColor: d => (d && d.properties && d.properties.fill) || [60, 140, 0, 100],
      getLineColor: d => (d && d.properties && d.properties.stroke) || [80, 140, 80, 140],
      getLineWidth: 10,
      getRadius: 100,
      onClick: t => setTooltip(t),
    }),

    new PolygonLayer({
      id: 'buildings',
      data: buildings.features,
      pickable: true,
      stroked: true,
      filled: true,
      wireframe: true,
      extruded: true,
      lineWidthMinPixels: 1,
      getPolygon: d => d && d.geometry && d.geometry.coordinates,
      getElevation: d => (d && d.properties && d.properties.elevation) || 1,
      getFillColor: d => (d && d.properties && d.properties.fill) || [60, 140, 0, 100],
      getLineColor: d => (d && d.properties && d.properties.stroke) || [80, 80, 80],
      getLineWidth: 1,
      onClick: t => setTooltip(t),
    }),
  ];
    // <header className="App-header">
    //   <img src={logo} className="App-logo" alt="logo" />
    // </header>

  return (
    <ReactMapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle={mapStyle}
      onViewportChange={v => {  console.log('Viewport', v); setViewport(v);}}
      preventStyleDiffing={false}
      mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
    >
      <DeckGL
        initialViewState={viewport}
        controller={true}
        layers={layers}
        >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={mapStyle} />
      </DeckGL>
      <ControlPanel
        onChange={setMapStyle}
        tooltip={tooltip}
        />
    </ReactMapGL>
  );
}


export default App;
