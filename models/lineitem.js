/**
 * Needed pieces
 */
const electron = require('electron');

/**
 * Database setup
 */
const Store = require('electron-store');
const store = new Store();

const storeName = 'lineItems'

/**
 * Line Item Class
 */
class LineItem
{
	/**
     * Constructor method
     */
    constructor()
    {
        // All current categories should come automatically
        this.data = store.get(storeName);
    }

    /**
     * Get all line items
     */
    getAllLineItems()
    {
        // refresh the data when this is called
    	return store.get(storeName);
    }

    /**
     * Set a line item
     */
    set(id, item)
    {
    	store.set(storeName+"."+id, item);
    }

    /**
     * Delete a line item
     */
    delete(id)
    {
    	store.delete(storeName+"."+id);
    }

    getById(id)
    {
        return store.get(storeName+"."+id);
    }
}

/**
 * Expose the class
 * @type {LineItem}
 */
module.exports = LineItem;