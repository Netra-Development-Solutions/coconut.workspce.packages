class DataManagementClass {
    constructor(initialState = {}) {
        if (DataManagementClass.instance) {
            return DataManagementClass.instance;
        }

        this.state = initialState;
        this.listeners = new Map();
        DataManagementClass.instance = this;
    }

    // Get the current state (or part of it)
    getState(key) {
        return key ? this.state[key] : { ...this.state };
    }

    // Set state and notify listeners
    setState(updates) {
        const keysToNotify = [];
        for (const key in updates) {
            if (this.state[key] !== updates[key]) {
                this.state[key] = updates[key];
                keysToNotify.push(key);
            }
        }
        this.notify(keysToNotify);
    }

    // Subscribe to changes for a specific key or the entire state
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        const keyListeners = this.listeners.get(key);
        keyListeners.add(callback);

        // Return an unsubscribe function
        return () => keyListeners.delete(callback);
    }

    // Notify listeners of changes
    notify(keys) {
        keys.forEach((key) => {
            const keyListeners = this.listeners.get(key);
            if (keyListeners) {
                keyListeners.forEach((callback) => callback(this.state[key]));
            }
        });

        // Notify listeners for the entire state if they exist
        const globalListeners = this.listeners.get(null);
        if (globalListeners) {
            globalListeners.forEach((callback) => callback(this.getState()));
        }
    }
}

export default DataManagementClass;
