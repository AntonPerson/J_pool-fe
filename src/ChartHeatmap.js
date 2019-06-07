import React, {Component} from 'react';
import {scaleLinear} from 'd3-scale';

import {XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries, Hint} from 'react-vis';

const times = ['0:00', '3:00', '6:00', '9:00', '12:00', '15:00', '18:00', '21:00'];
const users = ['A', 'B', 'C'];
// const data = times.reduce((acc, time, i) => {
//   return acc.concat(
//     users.map((user, j) => ({
//       x: `${time}`,
//       y: user || `User ${j}`,
//       color: (i + j) % Math.floor(j / i) || i
//     }))
//   );
// }, []);
const data = [
  {"x":"0:00","y":"A","color":0},
  {"x":"0:00","y":"B","color":0},
  {"x":"0:00","y":"C","color":0},
  {"x":"3:00","y":"A","color":0},
  {"x":"3:00","y":"B","color":0},
  {"x":"3:00","y":"C","color":1},
  {"x":"6:00","y":"A","color":2},
  {"x":"6:00","y":"B","color":2},
  {"x":"6:00","y":"C","color":2},
  {"x":"9:00","y":"A","color":5},
  {"x":"9:00","y":"B","color":3},
  {"x":"9:00","y":"C","color":3},
  {"x":"12:00","y":"A","color":7},
  {"x":"12:00","y":"B","color":4},
  {"x":"12:00","y":"C","color":4},
  {"x":"15:00","y":"A","color":7},
  {"x":"15:00","y":"B","color":5},
  {"x":"15:00","y":"C","color":5},
  {"x":"18:00","y":"A","color":4},
  {"x":"18:00","y":"B","color":3},
  {"x":"18:00","y":"C","color":3},
  {"x":"21:00","y":"A","color":2},
  {"x":"21:00","y":"B","color":1},
  {"x":"21:00","y":"C","color":1},
];
console.log({data});
const {min, max} = data.reduce(
  (acc, row) => ({
    min: Math.min(acc.min, row.color),
    max: Math.max(acc.max, row.color)
  }),
  {min: Infinity, max: -Infinity}
);

export default class LabeledHeatmap extends Component {
  state = {
    value: false
  };

  render () {
    const {value} = this.state;
    const exampleColorScale = scaleLinear()
    .domain([min, (min + max) / 2, max])
    .range(['red', 'white', 'green']);

    return (
      <XYPlot
        xType="ordinal"
        xDomain={times}
        yType="ordinal"
        yDomain={users.reverse()}
        margin={50}
        width={320}
        height={300}
      >
      <XAxis orientation="top" />
      <YAxis />
      <HeatmapSeries
        colorType="literal"
        getColor={d => exampleColorScale(d.color)}
        style={{
          stroke: 'white',
          strokeWidth: '2px',
          rectStyle: {
            rx: 10,
            ry: 10
          }
        }}
        className="heatmap-series-example"
        data={data}
        // onValueMouseOver={v => this.setState({value: v})}
        // onSeriesMouseOut={v => this.setState({value: false})}
        />
      <LabelSeries
        style={{pointerEvents: 'none'}}
        data={data}
        labelAnchorX="middle"
        labelAnchorY="baseline"
        // getLabel={d => `${d.color}`}
        />
      {/* {value !== false && <Hint value={value} />} */}
      </XYPlot>
    );
  }
}