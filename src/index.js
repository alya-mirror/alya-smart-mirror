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
import ASMDateTime from 'ASM-date-time'

render(<App/>, document.getElementById('root'));
render(<ASMDateTime/>, document.getElementById('root').appendChild(document.createElement("div")));

registerServiceWorker();
