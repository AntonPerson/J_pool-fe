import React, {useState} from 'react';
import styles from './ControlPanel.module.css';

import Chart from './Chart';
import CustomizeStyle from './CustomizeStyle';

export default function ControlPanel(props) {
  const {
    selectedObject,
    onChange,
    onClose,
  } = props || {};
  const [customize, setCustomize] = useState(false);
  return (
    <aside className={styles.ControlPanel}>
      <div className={styles.toolbar}>
        <a href="#" onClick={() => setCustomize(true)}>
          <img alt="Customize" src="./images/settings.svg" width="25" height="25" />
        </a>

        <span className={styles['source-link']}>
          <a
            href="https://github.com/AntonPerson/J_pool-fe"
            target="_new"
          >
            <img alt="View Code at Github" src="./images/github-logo.svg" width="25" height="25" />
          </a>
        </span>
      </div>

      {selectedObject ? (
        <>
          <div className={`${styles.box} ${styles.filled} ${styles.details}`}>
            <Chart selectedObject={selectedObject} />
            <button onClick={onClose}>
              Close
            </button>
          </div>
        </>
      ) : (
        <div className={`${styles.box} ${styles.filled} ${styles.help}`}>
          <p>
            Please select a neighborhood, building or connection to show more information
          </p>
          <p>
            <img src="images/mouse-left-button.svg" title="left mouse button" width={25} height={25} /> to pan,
            <img src="images/mouse-right-button.svg" title="right mouse button" width={25} height={25} /> to rotate
          </p>
        </div>
      )}

      {customize ? (
        <div className={`${styles.box} ${styles.filled} ${styles.details}`}>
            <CustomizeStyle onChange={onChange} onClose={() => setCustomize(false)} />
        </div>
      ) : null}
    </aside>
  );
}


