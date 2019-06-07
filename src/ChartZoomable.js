import React from 'react';

import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  XYPlot,
  LineSeries,
  Highlight
} from 'react-vis';
import {generateSeededRandom} from './utils';

const seededRandom = generateSeededRandom(9);
const totalValues = 100;

/**
 * Get the array of x and y pairs.
 * The function tries to avoid too large changes of the chart.
 * @param {number} total Total number of values.
 * @returns {Array} Array of data.
 * @private
 */
function getRandomSeriesData(total) {
  const result = [];
  let lastY = seededRandom() * 40 - 20;
  let y;
  const firstY = lastY;
  for (let i = 0; i < total; i++) {
    y = seededRandom() * firstY - firstY / 2 + lastY;
    result.push({
      x: i,
      y
    });
    lastY = y;
  }
  return result;
}

export default class ChartZoomable extends React.Component {
  state = {
    lastDrawLocation: null,
    series: [
      {
        data: getRandomSeriesData(totalValues),
        disabled: false,
        title: 'Apples'
      },
      {
        data: getRandomSeriesData(totalValues),
        disabled: false,
        title: 'Bananas'
      }
    ]
  };

  render() {
    const {series, lastDrawLocation} = this.state;
    return (
      <div>
        <div>
          <XYPlot
            animation
            xDomain={
              lastDrawLocation && [
                lastDrawLocation.left,
                lastDrawLocation.right
              ]
            }
            yDomain={
              lastDrawLocation && [
                lastDrawLocation.bottom,
                lastDrawLocation.top
              ]
            }
            width={500}
            height={300}
          >
            <HorizontalGridLines />

            <YAxis />
            <XAxis />

            {series.map(entry => (
              <LineSeries key={entry.title} data={entry.data} />
            ))}

            <Highlight
              onBrushEnd={area => this.setState({lastDrawLocation: area})}
              onDrag={area => {
                this.setState({
                  lastDrawLocation: {
                    bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                    left: lastDrawLocation.left - (area.right - area.left),
                    right: lastDrawLocation.right - (area.right - area.left),
                    top: lastDrawLocation.top + (area.top - area.bottom)
                  }
                });
              }}
            />
          </XYPlot>
        </div>

        <button
          className="showcase-button"
          onClick={() => this.setState({lastDrawLocation: null})}
        >
          Reset Zoom
        </button>

        <div>
          <h4>
            <b>Last Draw Area</b>
          </h4>
          {lastDrawLocation ? (
            <ul style={{listStyle: 'none'}}>
              <li>
                <b>Top:</b> {lastDrawLocation.top}
              </li>
              <li>
                <b>Right:</b> {lastDrawLocation.right}
              </li>
              <li>
                <b>Bottom:</b> {lastDrawLocation.bottom}
              </li>
              <li>
                <b>Left:</b> {lastDrawLocation.left}
              </li>
            </ul>
          ) : (
            <span>N/A</span>
          )}
        </div>
      </div>
    );
  }
}