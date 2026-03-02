/**
 * LocalStorage Manager
 */

const Storage = {
    /**
     * Save data to local storage
     * @param {string} key
     * @param {any} value
     */
    save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to local storage', e);
        }
    },

    /**
     * Load data from local storage
     * @param {string} key
     * @param {any} defaultValue
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Error loading from local storage', e);
            return defaultValue;
        }
    },

    /**
     * Remove data from local storage
     * @param {string} key
     */
    remove(key) {
        localStorage.removeItem(key);
    }
};

// Make globally available
window.Storage = Storage;
