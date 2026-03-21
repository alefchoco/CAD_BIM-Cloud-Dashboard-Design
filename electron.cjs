const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    icon: path.join(__dirname, 'public/logo.svg'),
    title: 'CAD/BIM Cloud Platform',
    backgroundColor: '#1E293B',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
    show: false, // Don't show until ready
    frame: true,
    autoHideMenuBar: false,
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Custom menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            // Open file dialog logic
          },
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('save-project');
          },
        },
        { type: 'separator' },
        {
          label: 'Export',
          submenu: [
            { label: 'Export as DWG' },
            { label: 'Export as RVT' },
            { label: 'Export as PDF' },
            { label: 'Export as TIF' },
          ],
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle 2D/3D',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            mainWindow.webContents.send('toggle-view');
          },
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Tools',
      submenu: [
        { label: 'Line Tool', accelerator: 'L' },
        { label: 'Modify Tool', accelerator: 'M' },
        { label: 'Layers', accelerator: 'CmdOrCtrl+L' },
        { type: 'separator' },
        { label: 'Terrain Data' },
        { label: 'Document Folders' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'close' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            await shell.openExternal('https://github.com');
          },
        },
        {
          label: 'About CAD/BIM Cloud Platform',
          click: () => {
            // Show about dialog
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle IPC messages
const { ipcMain } = require('electron');

ipcMain.on('save-project', (event, data) => {
  // Handle save logic
  console.log('Saving project:', data);
});

ipcMain.on('export-file', (event, { format, data }) => {
  // Handle export logic
  console.log('Exporting as:', format);
});
