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
    return {
        "1": "Weekly",
        "2": "Monthly",
        "3": "Yearly",
        "4": "One Time"
    };
}

/**
 * Expose the class
 * @type {Period}
 */
module.exports = Period;