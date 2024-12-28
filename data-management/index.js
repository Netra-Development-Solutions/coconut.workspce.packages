class DataManagementClass {
    constructor() {
        if (DataManagementClass.instance) {
            return DataManagementClass.instance;
        }

        this.dataModels = new Map();
        this.dataListeners = new Map();
        DataManagementClass.instance = this;
    }

    // Register a data model
    registerModel(key, model) {
        this.dataModels.set(key, model);
    }

    // Get a data model
    getModelData(key) {
        return this.dataModels.get(key);
    }

    // Recursively get data from a model
    getModelDataPath(key, dataPath) {
        const pathArray = dataPath.split('.');
        let model = this.dataModels.get(key);

        if (!model) {
            return null;
        }
        while (pathArray.length) {
            model = model[pathArray.shift()];
        }

        return model;
    }

    // Update a data model
    updateModelData(key, dataPath, value) {
        const pathArray = dataPath.split('.');
        let model = this.dataModels.get(key);

        if (!model) {
            return null;
        }
        while (pathArray.length > 1) {
            model = model[pathArray.shift()];
        }
        model[pathArray.shift()] = value;

        if (this.dataListeners.has(key)) {
            this.dataListeners.get(key).forEach((callback) => {
                callback();
            });
        }
    }

    // Update a data model
    updateModel(key, data) {
        this.dataModels.set(key, data);

        if (this.dataListeners.has(key)) {
            this.dataListeners.get(key).forEach((callback) => {
                callback();
            });
        }
    }

    // Deregister a data model
    deregisterModel(key) {
        this.dataModels.delete(key);
    }

    // Update a data model
    subscribe(key, widgetId, callback) {
        if (!this.dataListeners.has(key)) {
            this.dataListeners.set(key, new Map());
        }
        this.dataListeners.get(key).set(widgetId, callback);
    }

    // Update a data model
    unsubscribe(key, widgetId) {
        if (this.dataListeners.has(key)) {
            this.dataListeners.get(key).delete(widgetId);
        }
    }
}

export default DataManagementClass;
