class MessageManagement {
    constructor() {
      this.subscribers = {};
      this.globalState = {}; // Placeholder for data management integration
    }
  
    // Subscribe to events with a callback
    subscribe(event, callback) {
      if (!this.subscribers[event]) {
        this.subscribers[event] = [];
      }
      this.subscribers[event].push(callback);
      return () => this.unsubscribe(event, callback); // Return an unsubscribe function
    }
  
    // Unsubscribe a specific callback
    unsubscribe(event, callback) {
      if (this.subscribers[event]) {
        this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
        if (this.subscribers[event].length === 0) {
          delete this.subscribers[event];
        }
      }
    }
  
    // Publish an event to all subscribers
    publish(event, data) {
      if (this.subscribers[event]) {
        this.subscribers[event].forEach(callback => callback(data));
      }
    }
  
    // Set global state (integrated with the data management system)
    setGlobalState(key, value) {
      this.globalState[key] = value;
      this.publish('stateChange', { key, value });
    }
  
    // Get global state
    getGlobalState(key) {
      return this.globalState[key];
    }
  
    // Send a message to a specific micro-frontend
    sendMessage(target, message) {
      // Custom implementation for targeted communication
      console.log(`Sending message to ${target}:`, message);
    }
  
    // Receive a message from another micro-frontend
    onMessageReceived(message) {
      console.log('Message received:', message);
      this.publish('messageReceived', message); // Notify listeners
    }
  }
  
  export default CommunicationLibrary;
  
  // Example Usage
  const commLib = new CommunicationLibrary();
  
  // Subscriber example
  const unsubscribe = commLib.subscribe('stateChange', (data) => {
    console.log('State changed:', data);
  });
  
  // Setting state
  commLib.setGlobalState('user', { name: 'John', role: 'admin' });
  
  // Publishing a message
  commLib.publish('customEvent', { message: 'Hello, micro-frontends!' });
  
  // Sending a message
  commLib.sendMessage('microFrontendA', { type: 'greeting', payload: 'Hi there!' });
  
  // Unsubscribing
  unsubscribe();
  