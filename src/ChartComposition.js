import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  HorizontalBarSeriesCanvas
} from 'react-vis';

export default class ChartComposition extends React.Component {
  render() {
    const BarSeries = HorizontalBarSeriesCanvas;
    return (
      <div>
        <XYPlot width={300} height={300} stackBy="x">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <BarSeries data={[{y: 0, x: 3}]} color="#00FF00" />
          <BarSeries data={[{y: 0, x: 5}]} color="#FF6666" />
          <BarSeries data={[{y: 0, x: 12}]} color="#FF0000" />
        </XYPlot>
      </div>
    );
  }
}