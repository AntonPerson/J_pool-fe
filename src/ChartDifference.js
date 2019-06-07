import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  // VerticalBarSeriesCanvas
} from 'react-vis';

// When making a difference chart you are specifying in coordinates
// where you want your bars to start and stop
const myDATA = [...new Array(15)]
  .map((x, idx) => ({
    x: idx,
    // if the bars are above zero then we start them at zero
    y0: (idx - 4 < 0) ? idx - 4 : 0,
    // if the bars are below zero then we stop them at zero
    y: (idx < 5) ? 0 : Math.abs((idx - 4))
  }));

const yDomain = myDATA.reduce((res, row) => ({
  max: Math.max(res.max, row.y, row.y0),
  min: Math.min(res.min, row.y, row.y0)
}), {max: -Infinity, min: Infinity});

export default class DifferenceChart extends React.Component {

  render() {
    const BarSeries = VerticalBarSeries; // VerticalBarSeriesCanvas
    return (
      <div>
        <XYPlot
          width={300}
          height={300}
          yDomain={[yDomain.min, yDomain.max]}
        >
          <BarSeries
            className="difference-example"
            data={myDATA}
            colorType="literal"
            getColor={d => {
              return d.y0 < 0 ? 'red' : 'green';
            }}/>
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>
    );
  }
}