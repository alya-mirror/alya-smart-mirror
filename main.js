/* Alya Smart Mirror
 * Global process
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Prevent the monitor from going to sleep.
const powerSaveBlocker = electron.powerSaveBlocker;
powerSaveBlocker.start('prevent-display-sleep');

// Launching the mirror in dev mode
const DevelopmentMode = process.argv.includes('dev');

// Load default config
const path = require('path');

const helper = require(path.resolve('utils/helper.js'));
const defaultConfig = helper.getDefaultConfigs();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

  // Get the displays and render the mirror on a secondary screen if it exists
  const atomScreen = electron.screen;
  const displays = atomScreen.getAllDisplays();
  let externalDisplay = null;
  displays.forEach((display) => {
    if (display.bounds.x > 0 || display.bounds.y > 0) {
      externalDisplay = display;
    }
  });

  const browserWindowOptions = {
    width: 800,
    height: 600,
    icon: 'favicon.ico',
    kiosk: !DevelopmentMode,
    autoHideMenuBar: true,
    darkTheme: true
  };
  if (externalDisplay) {
    browserWindowOptions.x = externalDisplay.bounds.x + 50;
    browserWindowOptions.y = externalDisplay.bounds.y + 50;
  }

  // Create the browser window.
  mainWindow = new BrowserWindow(browserWindowOptions);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools if run with "npm start dev"
  if (DevelopmentMode) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

// No matter how the app is quit, we should clean up after ourselvs
app.on('will-quit', () => {
  // clean up
});
