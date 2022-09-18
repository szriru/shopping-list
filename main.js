const electron = require("electron");
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for app to be ready

app.on('ready', function () {
    //create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    //Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true,
    }));
    // Quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    })

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //Insert menu
    Menu.setApplicationMenu(mainMenu)
})

// Handle crete add window
const createAddWindow = () => {
    //create new window
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 400,
        height: 300,
        title: 'Add Shopping List Item'
    });
    //Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file',
        slashes: true,
    }));
    // Garbage collection handle
    addWindow.on('close', () => {
        addWindow = null;
    })
}

//Catch item:add
ipcMain.on('item:add', function (e, item) {
    mainWindow.webContents.send('item:add', item);
    if(addWindow) addWindow.close();
})

const openHelp = () => {
    //create new window
    helpWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 400,
        height: 300,
        title: 'Add Shopping List Item'
    });
    //Load html into window
    helpWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'help.html'),
        protocol: 'file',
        slashes: true,
    }));
    // Garbage collection handle
    helpWindow.on('close', () => {
        helpWindow = null;
    })
}
// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },

    {
        label: 'Help',
        submenu:[
            {
                label: 'How to use',
                click() {
                    openHelp();
                }
            }
        ]
    }
];

// If mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({})
}

// Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}