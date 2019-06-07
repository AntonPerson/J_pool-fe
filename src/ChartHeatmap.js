import React, {useState} from 'react';
import {scaleLinear} from 'd3-scale';

import {XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries, Hint} from 'react-vis';

export default function LabeledHeatmap ({ data = {} }) {
  const [min, max] = data.limits || [-10,10];
  const exampleColorScale = scaleLinear()
    .domain([min, (min + max) / 2, max])
    .range(['red', 'white', 'green']);

  const [hint, setHint] = useState(false);

  const xDomain = Object.keys(data.x || {});
  const yDomain = Object.keys(data.y || {}).sort().reverse();

  return (
    <XYPlot
      xType="ordinal"
      xDomain={xDomain}
      yType="ordinal"
      yDomain={yDomain}
      margin={50}
      width={320}
      height={300}
    >
    <XAxis orientation="top" />
    <YAxis />
    <HeatmapSeries
      colorType="literal"
      getColor={d => exampleColorScale(d.value)}
      style={{
        stroke: 'white',
        strokeWidth: '2px',
        rectStyle: {
          rx: 10,
          ry: 10
        }
      }}
      className="heatmap-series-example"
      data={data.values || []}
      onValueMouseOver={v => setHint(v)}
      onValueClick={v => setHint(v)}
      onSeriesMouseOut={v => setHint(false)}
      />
    <LabelSeries
      style={{pointerEvents: 'none'}}
      data={data.values || []}
      labelAnchorX="middle"
      labelAnchorY="baseline"
      // getLabel={d => `${d.value}`}
      />
    {hint !== false && <Hint value={{ [data.xLabel]: data.x[hint.x], [data.yLabel]: data.y[hint.y] }} />}
    </XYPlot>
  );
}
