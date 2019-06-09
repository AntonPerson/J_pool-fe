import React from 'react';

import ChartDifference from './ChartDifference';
import ChartTime from './ChartTime';
import ChartHeatmap from './ChartHeatmap';

export default function Chart(props) {
  const { selectedObject: object } = props || {};
  return object ? (
    object.from && object.to ? (
      <div style={{ position: 'relative' }}>
        <h3>Relative production/consumption</h3>
        from <span style={{color: '#12939A'}}><b>{ object.from.name }</b></span> ({ object.from.address})<br/>
        to <span style={{color: '#FFA54F'}}><b>{ object.to.name }</b></span> ({object.to.address })
        <ChartTime />
      </div>
    ) : (
      <div>
        { object && object.type === 'Feature' ? (
          <h3>{object.properties && object.properties.name}</h3>
        ) : null }
        {object.properties && object.properties.elevation ? (
          <ChartDifference />
        ) : (
          <ChartHeatmap data={object && object.properties && object.properties.data}/>
        )}
      </div>
    )
  ) : null;
}
