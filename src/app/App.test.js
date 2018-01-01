/* Alya Smart Mirror
 * Global process
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App/>, div);
});
