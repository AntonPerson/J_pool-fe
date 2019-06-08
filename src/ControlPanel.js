import React, {PureComponent} from 'react';
import {fromJS} from 'immutable';
import MAP_STYLE from './data/map-style-basic-v8.json';

import ChartDifference from './ChartDifference';
import ChartTime from './ChartTime';
import ChartHeatmap from './ChartHeatmap';

const defaultMapStyle = fromJS(MAP_STYLE);

const categories = ['labels', 'roads', 'buildings', 'parks', 'water', 'background'];

// Layer id patterns by category
const layerSelector = {
  background: /background/,
  water: /water/,
  parks: /park/,
  buildings: /building/,
  roads: /bridge|road|tunnel/,
  labels: /label|place|poi/
};

// Layer color class by type
const colorClass = {
  line: 'line-color',
  fill: 'fill-color',
  background: 'background-color',
  symbol: 'text-color'
};

export function Tooltip(props) {
  const { object } = props || {};
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
        <h3>{ object && object.type === 'Feature' ? object.properties && object.properties.name : '#J_pool' }</h3>
        {object.properties && object.properties.elevation ? (<ChartDifference />) : (<div><ChartHeatmap data={object && object.properties && object.properties.data}/></div>)}
      </div>
    )
  ) : (
    <div>
      <div>Please select a neighborhood, building or connection to show more information</div>
    </div>

  );
}

const defaultContainer = ({children}) => <div className="control-panel">{children}</div>;

export default class StyleControls extends PureComponent {
  state = {
    customize: false,
    visibility: {
      water: true,
      parks: true,
      buildings: true,
      roads: true,
      labels: true,
      background: true
    },
    color: {
      water: '#DBE2E6',
      parks: '#E6EAE9',
      buildings: '#c0c0c8',
      roads: '#ffffff',
      labels: '#78888a',
      background: '#EBF0F0'
    }
  };
  _defaultLayers = defaultMapStyle.get('layers');


  _onColorChange(name, event) {
    const color = {...this.state.color, [name]: event.target.value};
    this.setState({color});
    this._updateMapStyle({...this.state, color});
  }

  _onVisibilityChange(name, event) {
    const visibility = {
      ...this.state.visibility,
      [name]: event.target.checked
    };
    this.setState({visibility});
    this._updateMapStyle({...this.state, visibility});
  }

  _updateMapStyle({visibility, color}) {
    const layers = this._defaultLayers
      .filter(layer => {
        const id = layer.get('id');
        return categories.every(name => visibility[name] || !layerSelector[name].test(id));
      })
      .map(layer => {
        const id = layer.get('id');
        const type = layer.get('type');
        const category = categories.find(name => layerSelector[name].test(id));
        if (category && colorClass[type]) {
          return layer.setIn(['paint', colorClass[type]], color[category]);
        }
        return layer;
      });
    this.props.onChange(defaultMapStyle.set('layers', layers));
  }

  _renderLayerControl(name) {
    const {visibility, color} = this.state;

    return (
      <div key={name} className="input">
        <label>{name}</label>
        <input
          type="checkbox"
          checked={visibility[name]}
          onChange={this._onVisibilityChange.bind(this, name)}
        />
        <input
          type="color"
          value={color[name]}
          disabled={!visibility[name]}
          onChange={this._onColorChange.bind(this, name)}
        />
      </div>
    );
  }

  render() {
    const Container = this.props.containerComponent || defaultContainer;
    const tooltip = this.props.tooltip || {};

    return (
      <Container>
        <Tooltip {...tooltip} />
        <div className="source-link">
          <a
            href="https://github.com/AntonPerson/J_pool-fe"
            target="_new"
          >
            View Code ↗
          </a>
        </div>
        <footer className="control-panel-footer">
          { this.state.customize ? (<div class="control-panel-footer-list">{categories.map(name => this._renderLayerControl(name))}</div>) : null }
          <button onClick={() => this.setState({ customize: !this.state.customize })}>
            { !this.state.customize ? 'Customize' : 'Save' }
          </button>
          { tooltip && tooltip.object && <button onClick={() => this.props.onClose && this.props.onClose(null) }>Close</button> }
          { this.state.customize ? (<button onClick={() => {
              this.setState({ customize: !this.state.customize });
              this.props.onChange('mapbox://styles/jpool/cjwl9f7270ovf1cqh1kyn8som');
            }
          }>Revert</button>) : null }
        </footer>
      </Container>
    );
  }
}
