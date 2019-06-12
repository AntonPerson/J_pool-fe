import React, {useState} from 'react';
import './App.css';

import ReactMapGL, {StaticMap, NavigationControl} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {ArcLayer, PolygonLayer} from '@deck.gl/layers';
// import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import {registerLoaders} from '@loaders.gl/core';
import {GLTFScenegraphLoader} from '@luma.gl/addons';

import 'mapbox-gl/src/css/mapbox-gl.css';
import '../node_modules/react-vis/dist/style.css';


import ControlPanel from './ControlPanel';

import connections from './data/connections.json';
import neighborhoods from './data/neighborhoods.json';
import buildings from './data/buildings.json';


const MAPBOX_ACCESS_TOKEN = process.env.MapboxAccessToken
  || 'pk.eyJ1IjoianBvb2wiLCJhIjoiY2p3a3RtMXM1MDA4ZTQzcWpwcTMzODQ5cSJ9.fUQlACZ8DGi-nHoTLMpSaA';

  // Register the proper loader for scenegraph.gltf
registerLoaders([GLTFScenegraphLoader]);

function App() {
  const [viewport, setViewport] = useState({
    // latitude: 54.678688,
    // longitude: 25.226252,

    // altitude: 1.5,
    // bearing: -14.858797972483709,
    // height: 969,
    // latitude: 54.68058826948631,
    // longitude: 25.227326074616954,
    // maxPitch: 60,
    // maxZoom: 24,
    // minPitch: 0,
    // minZoom: 0,
    // pitch: 41.51658767772512,
    // zoom: 14,

    "latitude":54.67978741314096,
    "longitude":25.226679833963274,
    "zoom":14.949430043040728,
    "bearing":83.4931902174222,
    "pitch":53.29921432545182,
    "altitude":1.5,
    "maxZoom":24,
    "minZoom":0,
    "maxPitch":60,
    "minPitch":0,
  });
  const [selectedObject, setSelectedObject] = useState(null);
  const onClick = t => setSelectedObject(t && t.object);

  const [mapStyle, setMapStyle] = useState('mapbox://styles/jpool/cjwl9f7270ovf1cqh1kyn8som');

  const layers = [
    new ArcLayer({
      id: 'connections',
      data: connections,
      pickable: true,
      getWidth: d => d.width || 16,
      getSourcePosition: d => [d.from.coordinates[1], d.from.coordinates[0]],
      getTargetPosition: d => [d.to.coordinates[1], d.to.coordinates[0]],
      getSourceColor: d => d.outbound || [0, 255, 0, 150], // green
      getTargetColor: d => d.inbound || [255, 0, 0, 150], // red
      onClick,
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
      onClick,
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
      onClick,
    }),

    // new ScenegraphLayer({
    //   id: 'scenegraph-layer',
    //   data: [
    //     {
    //       position: [25.231676, 54.680370],
    //       // color: [255, 0, 0],
    //       scale: [25, 25, 25],
    //     }, {
    //       position: [25.230921, 54.681030],
    //       scale: [50, 50, 50],
    //     }, {
    //       position: [25.231962, 54.679672],
    //       scale: [25, 25, 25],
    //     }
    //   ],
    //   getScale: d => d.scale || [100, 100, 100],
    //   getOrientation: [0, 90, 90],
    //   scenegraph: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
    // }),
  ];

  return (
    <>
      <ReactMapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle={mapStyle}
        onViewportChange={v => { setViewport(v); }}
        preventStyleDiffing={false}
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        >
        <DeckGL
          initialViewState={viewport}
          viewState={viewport}
          controller={true}
          layers={layers}
          >
          <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} mapStyle={mapStyle} />
        </DeckGL>
        <ControlPanel
          selectedObject={selectedObject}
          onChange={setMapStyle}
          onClose={() => setSelectedObject(null)}
          />
        <div style={{ position: 'absolute', right: 0, bottom: 30 }}>
          <NavigationControl onViewStateChange={v => { console.log(v && v.viewState, viewport); setViewport(v && v.viewState); }} />
        </div>
        <div style={{ fontSize: '9px', padding: '10px', position: 'absolute', bottom: 0}}>
          Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a>
          and <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a>
          from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a>
          licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>
        </div>
      </ReactMapGL>
    </>
  );
}


export default App;
