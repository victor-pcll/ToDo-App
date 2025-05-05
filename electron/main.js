import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

// Pour récupérer __dirname en ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'ToDo',
    icon: path.join(__dirname, './assets/icon.icns'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL('http://localhost:5173')
}

app.whenReady().then(createWindow)