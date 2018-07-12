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
import io from 'socket.io-client';
import ReactDOM from 'react-dom';
import ASMyoutube from '@alya-mirror/asm-youtube-addon'
import ASManalogClock from '@alya-mirror/asm-analog-clock-addon'
import ASMDateTime from '@alya-mirror/asm-date-time'
import ASMGoogleImages from '@alya-mirror/asm-google-images-addon'

let socket = io('http://localhost:3100');
socket.on('connect', function () {
  console.log('connected');
});
socket.on('disconnect', function () {
  console.log('disconnected');
});

socket.on('addAddon', function (data) {

  const message = JSON.parse(data).data;
  const TagName = message.userAddon.name;
  switch (TagName) {
    case 'asmDateTime':
      console.log(TagName + 'arrived');
      let element1 = document.createElement('div');
      element1.setAttribute("id", TagName);
      render(<ASMDateTime/>, document.getElementById('root').appendChild(element1));
      break;

    case 'ASManalogClock':
      console.log(TagName + 'arrived');
      let element2 = document.createElement('div');
      element2.setAttribute("id", TagName);
      render(<ASManalogClock/>, document.getElementById('root').appendChild(element2));

      break;
    case 'ASMyoutube':
      console.log(TagName + 'arrived');
      let element3 = document.createElement('div');
      element3.setAttribute("id", TagName);
      render(<ASMyoutube/>, document.getElementById('root').appendChild(element3));

      break;
    default:
      console.log('unfound name' + TagName);
      break;
  }
});

socket.on('deleteAddon', function (data) {
//TODO delete using react way
  const message = JSON.parse(data).data;
  const TagName = message.userAddon.name;
  switch (TagName) {
    case 'asmDateTime':
      console.log(TagName + 'to be deleted');
      document.getElementById(TagName).remove();

      break;
    case 'ASManalogClock':
      console.log(TagName + 'to be deleted');
      document.getElementById(TagName).remove();

      break;
    case 'ASMyoutube':
      console.log(TagName + 'to be deleted');
      document.getElementById(TagName).remove();
      break;

    default:
      console.log('unfound name' + TagName);
      break;
  }
});
