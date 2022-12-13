class EventEmitter {
	constructor() {
		throw 'Cannot instantiate abstract class';
	}

    static eventList = new Map();

    static on(name, fn) {
        if (!EventEmitter.eventList.has(name)) {
            EventEmitter.eventList.set(name, EventEmitter.pubSub());
        }

        return EventEmitter.eventList.get(name).sub(fn);
    }

    static has(name) {
        return EventEmitter.eventList.has(name);
    }

    static emit(name, data) {
        return EventEmitter.eventList.has(name) && EventEmitter.eventList.get(name).pub(data);
    }

    static pubSub() {
        const subscribers = new Set();

        const sub = (fn) => {
            subscribers.add(fn);
            return () => {
                subscribers.delete(fn);
            };
        };

        const pub = (data) => subscribers.forEach((fn) => fn(data));
        return Object.freeze({pub, sub});
    }
}
