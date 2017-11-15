//=== All required things ===
const electron = require('electron');
const url = require ('url');
const path = require ('path');
const uuidv4 = require('uuid/v4');

/**
 * Database setup
 * TODO: Look at changing this to a database like Dexie or NeDB
 */
const Store = require('electron-store');
const store = new Store();

/**
 * Model setup
 */
const Category = require('./models/category');
const category = new Category();

/**
 * Electron setup
 */
const {app, BrowserWindow, Menu, ipcMain} = electron;

//=== Set Environment ===
// process.env.NODE_ENV = 'production';
process.env.NODE_ENV = 'development';

//=== Windows we will use ===
let mainWindow;

//=== Main variables shared between pages ===
let categories;
let lineItems;

/**
 * Create the Menu template
 * @type {[null]}
 */
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                accelerator: process.platform == 'darwin'  ? 'Command+N' : 'Ctr+N',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Reset Categories',
                click(){
                    category.resetToDefault();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin'  ? 'Command+Q' : 'Ctr+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

/**
 * Prepare for when the app is ready
 */
app.on('ready', function ()
{
    // Create a new Main window
    mainWindow = new BrowserWindow({
        frame: false,
        width: 800,
        height: 600,
    });

    createMainWindow();

    // Build the menu from the template
    let mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert the menu
    Menu.setApplicationMenu(mainMenu);
});

/**
 * Load the main window
 * @returns {BrowserWindow|Electron.BrowserWindow}
 */
function createMainWindow()
{
    // Load the HTML for that window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: "file:",
        slashes: true
    }));

    // Start off checking for our categories
    categories = category.getAll();

    // First, grab all budget items that have already been created
    lineItems = store.get('lineItems');

    // Send our data along to the view
    mainWindow.initialList = lineItems;
    mainWindow.categories = categories;

    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });
}

/**
 * Build out the new Add Item window
 */
function createAddWindow()
{
    // Load html file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: "file:",
        slashes: true
    }));

    mainWindow.categories = categories;
}

/**
 * Listen for when an item is added to our list
 */
ipcMain.on('item:add', function(event, item)
{
    var newId = uuidv4();
    item.id = newId;

    // Store it before you send it on
    store.set("lineItems."+newId, item);

    // okay now you can send it
    mainWindow.webContents.send('item:add', item);
    createMainWindow();
});

/**
 * Listen for when an item is removed from our list
 */
ipcMain.on('item:remove', function(event, item)
{
    // Remove from storage
    store.delete("lineItems."+item);
});

ipcMain.on("window:addNewItem", function(){
    createAddWindow();
})

/**
 * Allow dev tools on any view but production
 */
if (process.env.NODE_ENV !== 'production'){
    // Add new menu option
    mainMenuTemplate.push({
        label: 'Developer Tools',
        // Add options for that menu
        submenu: [
            {
                label: 'Toggle DevTools',
                // Shortcuts
                accelerator: process.platform == 'darwin'  ? 'Command+I' : 'Ctr+I',
                // Make sure we are working only on the window we are looking at
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}


