type events = "loginRequired" |"loading" | "warning" | "error" | "info" | "success";

class EventEmitter {
  private events: { [event: string]: Set<Function> } = {};

  emit(event: events, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => {
        listener(...args);
      });
    }
  }

  on(event: events, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = new Set<Function>();
    }
    this.events[event].add(listener);
  }

  off(event: events, listener: Function) {
    if (this.events[event]) {
      this.events[event].delete(listener);
    }
  }
}

const Emitter = new EventEmitter();

export default Emitter;
