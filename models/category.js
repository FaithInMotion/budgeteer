/**
 * Needed pieces
 */
const electron = require('electron');

/**
 * Database setup
 * TODO: Look at changing this to a database like Dexie or NeDB
 */
const Store = require('electron-store');
const store = new Store();

const storeName = 'categories';

/**
 * Create our class
 */
class Category
{
    /**
     * Constructor method
     */
    constructor()
    {
        // All current categories should come automatically
        this.data = setInitialCategories(false);
    }

    /**
     * Resets all categories to app default list
     * @returns {*}
     */
    resetToDefault()
    {
        return setInitialCategories(true);
    }

    /**
     * Returns all categories
     * @returns {*}
     */
    getAll()
    {
        return this.data;
    }

    getNameById(id)
    {
        return this.data[id];
    }
}

/**
 * Our basic category list
 * @returns {{1: string, 2: string, 3: string, 4: string, 5: string, 6: string, 7: string, 8: string, 9: string}}
 */
function getInitialCategories()
{
    return {
        "1": "Income",
        "2": "Giving",
        "3": "Savings",
        "4": "Housing",
        "5": "Lifestyle",
        "6": "Insurance and Tax",
        "7": "Debt",
        "8": "Allowance"
    };
}

/**
 * Checks for categories and fills with defaults if they don't exist
 * @returns {*}
 */
function setInitialCategories(resetCategories)
{
    // Are we resetting (per request) or instantiating (first app load)?
    if (resetCategories === true)
    {
        categories = getInitialCategories();
    }
    // Okay, we are instantiating...
    else
    {
        // First, check that categories exists - it won't on first app run
        categories = store.get(storeName);

        // Did we find anything?
        if (categories === undefined
            || (Object.keys(categories).length === 0 && categories.constructor === Object)
        )
        {
            // Fill the object and save it to our database
            categories = getInitialCategories();

            // Save this to our database
            store.set(storeName, categories);
        }
        // We did, so let's use what we found instead
        // TODO: CRUD for this file
        else
        {

        }
    }

    // Return whatever we have
    return categories;
}

/**
 * Expose the class
 * @type {Category}
 */
module.exports = Category;