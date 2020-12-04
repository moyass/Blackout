const { app, Menu, Tray, BrowserWindow, screen, globalShortcut} = require('electron');
const aboutWindow = require('about-window').default;
const path = require('path');

function createWindow () {
  // Check if there are any windows already open.
  // If so close them
  let openWindows = BrowserWindow.getAllWindows()
  if (openWindows.length > 1){
    openWindows.forEach(function(window){
      if(window.title == "blackout") window.close();
    })
    return
  }

  // Cover everything that isn't the primary display
  let mainDisplay = screen.getPrimaryDisplay();
  let allDisplays = screen.getAllDisplays();
  
  let wins = []

  allDisplays.forEach(function(display) {
    if (mainDisplay.id != display.id){
      wins += new BrowserWindow ({
        title: "blackout",
        width: 10,
        height:  10,
        x: display.bounds.x,
        y: display.bounds.y,
        alwaysOnTop: true,
        backgroundColor: "#000",
        autoHideMenuBar: true,
        contextIsolation: true,
        kiosk: true
      });
    }
  })
}

function showAboutWindow(){
  aboutWindow ({
    description: "This tool is designed to blackout other non-primary screens. It does not turn them off nor put them to sleep.",
    icon_path: path.join(__dirname, 'assets', 'icon.png'),
    copyright: 'Copyright (c) 2020 @Moyass',

  });
}

app.whenReady().then(()  =>  {
  const ret = globalShortcut.register('CommandOrControl+4', () => {
    createWindow();
  })

  if (!ret) {
    console.log('registration failed')
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+4'))
})

app.on('ready', () => {
  // Main Window
  mainWindow = new BrowserWindow ({
    width: 10,
    height:  10,
    show: false
    
  })

  let appIcon = null
  appIcon = new Tray(path.join(__dirname, 'assets', 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'About', click() {showAboutWindow()} },
    { type: 'separator' },
    { label: 'Toggle Blackout', click() {createWindow()}},
    { type: 'separator' },
    { role: 'quit', click() {app.quit()} }
  ])

  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+4')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

