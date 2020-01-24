import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const isProduction = process.env.NODE_ENV === 'production'
const devServerURL = process.env.WEBPACK_DEV_SERVER_URL

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
])

let mainWindow: BrowserWindow | null
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 768,
    height: 504,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (devServerURL && !process.env.IS_TEST) {
    mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
  }

  mainWindow.loadURL(devServerURL ? devServerURL : `app://./index.html`)
  mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin')
    app.quit()
})
app.on('activate', () => {
  if (mainWindow === null)
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (!isProduction) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit')
        app.quit()
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
