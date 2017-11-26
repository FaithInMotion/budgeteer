/**
 * Needed pieces
 */
const electron = require('electron');

/**
 * Database setup
 */
const Store = require('electron-store');
const store = new Store();

const storeName = 'periods';

/**
 * Create our class
 */
class Period
{
    /**
     * Constructor method
     */
    constructor()
    {
        // All current categories should come automatically
        this.data = getInitialPeriods();
    }

    /**
     * Returns all categories
     * @returns {*}
     */
    getAll()
    {
        return this.data;
    }

    getPeriodById(id)
    {
        return this.data[id];
    }
}

/**
 * Our basic period list
 * @returns {{1: string, 2: string, 3: string, 4: string}}
 */
function getInitialPeriods()
{
    // Try to retrieve from the database
    let periods = store.get(storeName);

    // if we couldn't, then this is the first time the app has been opened
    if (periods === undefined
        || (Object.keys(periods).length === 0 && periods.constructor === Object)
    )
    {
        // Fill the object and save it to our database
        periods = {
            "1": "Weekly",
            "2": "Monthly",
            "3": "Yearly",
            "4": "One Time"
        };

        // Save this to our database
        store.set(storeName, periods);
    }

    // Now just return the list
    return periods;
}

/**
 * Expose the class
 * @type {Period}
 */
module.exports = Period;