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
        <button onClick={() => setCustomize(true)}>
          Customize
        </button>

        <span className={styles['source-link']}>
          <a
            href="https://github.com/AntonPerson/J_pool-fe"
            target="_new"
          >
            View Code ↗
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
          Please select a neighborhood, building or connection to show more information
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


