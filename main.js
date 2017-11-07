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
 * Electron setup
 */
const {app, BrowserWindow, Menu, ipcMain} = electron;

//=== Set Environment ===
// process.env.NODE_ENV = 'production';
process.env.NODE_ENV = 'development';

//=== Windows we will use ===
let mainWindow;
let addWindow;

/**
 * Prepare for when the app is ready
 */
app.on('ready', function ()
{
    // First, grab all budget items that have already been created
    let listItems = store.store;

    // Create a new Main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });

    // Load the HTML for that window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: "file:",
        slashes: true
    }));

    // Send our data along to the view
    mainWindow.initialList = listItems;

    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build the menu from the template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert the menu
    Menu.setApplicationMenu(mainMenu);
});

/**
 * Build out the new Add Item window
 */
function createAddWindow()
{
    // Create new window
    addWindow = new BrowserWindow({
        width: 400,
        height: 600,
        title: 'Add Line Item'
    });

    // Load html file into the window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: "file:",
        slashes: true
    }));

    // Handle garbage collection
    addWindow.on('close', function(){
        addWindow = null;
    })
}

/**
 * Listen for when an item is added to our list
 */
ipcMain.on('item:add', function(event, item)
{
    var newId = uuidv4();
    item.id = newId;
    console.log(item);

    // Store it before you send it on
    store.set(newId, item);

    // okay now you can send it
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

/**
 * Listen for when an item is removed from our list
 */
ipcMain.on('item:remove', function(event, item)
{
    // Remove from storage
    store.delete(item);
});

ipcMain.on('item:clear', function()
{
    // Remove from storage
    store.clear();
});

function clearAllItems()
{
    store.clear();
}

ipcMain.on("window:addNewItem", function(){
    createAddWindow();
})

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
                // TODO: I think this can be removed when we allow the App name back
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
 * Hide the Electron name on the window
 */
if (process.platform == 'darwin'){
    // TODO: Try to find a way to replace the apps name intead of it saying electron
    mainMenuTemplate.unshift({}); // pushes empty object to front of menu
}

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
            },
            {
                // Already defined role
                role: 'reload'
            }
        ]
    });
}

/**
 * Test fill the database
 * TODO: Remove when app is complete
 */
function setTemporaryDatabase()
{
    var newID = uuidv4();
    var newObject= {
        "id": newID,
        "category": "Giving",
        "lineItem": {
            "name": "Tithe",
            "amount": 10,
            "date": "04/11/2017",
            "recurring": "weekly"
        }
    };

    var newID2 = uuidv4();
    var newObject2 = {
        "id": newID2,
        "category": "Giving",
        "lineItem": {
            "name": "Offerings",
            "amount": 10,
            "date": "04/15/2017",
            "recurring": "weekly"
        }
    };

    var newID3 = uuidv4();
    var newObject3 = {
        "id": newID3,
        "category": "Debt",
        "lineItem": {
            "name": "Car Payment",
            "amount": 350,
            "date": "04/19/2017",
            "recurring": "monthly"
        }
    };

    var newID4 = uuidv4();
    var newObject4 = {
        "id": newID4,
        "category": "Income",
        "lineItem": {
            "name": "Paycheck",
            "amount": 300,
            "date": "04/19/2017",
            "recurring": "weekly"
        }
    };

    store.set(newID, newObject);
    store.set(newID2, newObject2);
    store.set(newID3, newObject3);
    store.set(newID4, newObject4);
}