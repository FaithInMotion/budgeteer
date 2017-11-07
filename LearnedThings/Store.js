// Needed pieces
const electron = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Declare and create the class
 */
class Store {

    /**
     * Construct the Store object
     * @param opts
     */
    constructor(opts){
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');

        // Create the path to the new file being created/read/edited
        this.path = path.join(userDataPath, opts.name + '.json');

        // Parse the data in a way we can use
        this.data = parseDataFile(this.path, opts.defaults);
    }

    /**
     * Get the property by key value
     * TODO: We will be using a full object from here on out, so we will need to account for object properties
     * @param key
     * @returns {*}
     */
    get(key) {
        return this.data[key];
    }

    /**
     * Sets the value of a property
     * TODO: This needs to be expanded out to deal with a full object
     * @param val
     */
    set(val){
        if (val.length == 0)
        {
            // return, nothing to do there
            return;
        }

        this.data.budgetItems.push(val);

        try {
            fs.writeFileSync(this.path, JSON.stringify(this.data));
        } catch(error) {

        }
    }


}

/**
 * Parses the data from a file and returns defaults if the data is not there
 * @param filePath
 * @param defaults
 * @returns {*}
 */
function parseDataFile(filePath, defaults)
{
    try
    {
        // Parse whatever was found in our file (if it exists)
        var results =  JSON.parse(fs.readFileSync(filePath));
        console.log(results);
        return results;

        // If the file didn't exist or was empty, return whatever defaults we were handed
        // TODO: NULL should be a return option and needs to be accounted for elsewhere
        // TODO: Remove default usage
        if(Object.keys(results).length === 0 && sellers.constructor === Object)
        {
            return defaults;
        }

        // Return whatever was found in the file
        return results;

    }
    // Something went wrong - act accordingly
    catch(error)
    {
        // if there was some kind of error, return the passed in defaults instead.
        // TODO: See the TODO above about returning NULL instead
        return defaults;
    }
}

/**
 * Expose the class
 * @type {Store}
 */
module.exports = Store;