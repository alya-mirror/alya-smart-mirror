/* Alya Smart Mirror
 * Global process
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */

import React from 'react';
import {render} from 'react-dom'
import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import ASMAnalogClock from '@alya-mirror/asm-analog-clock-addon'

render(<App/>, document.getElementById('root'));
render(<ASMAnalogClock/>, document.getElementById('root').appendChild(document.createElement("div")));

registerServiceWorker();
