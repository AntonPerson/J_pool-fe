import React, {PureComponent} from 'react';
import styles from './CustomizeStyle.module.css';
import {fromJS} from 'immutable';
import MAP_STYLE from './data/map-style-basic-v8.json';

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

export const defaultContainer = ({children}) => <div className="CustomizeStyleContainer">{children}</div>;

export default class CustomizeStyle extends PureComponent {
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
    const { onChange, onClose } = this.props;
    const Container = this.props.containerComponent || defaultContainer;

    return (
      <Container>
        <div className={styles.list}>
          {categories.map(name => this._renderLayerControl(name))}
        </div>
        <button onClick={() => {
          onClose();
        }}>
          Save
        </button>
        <button onClick={() => {
          onChange('mapbox://styles/jpool/cjwl9f7270ovf1cqh1kyn8som');
          onClose();
        }}>
          Revert
        </button>
      </Container>
    );
  }
}
