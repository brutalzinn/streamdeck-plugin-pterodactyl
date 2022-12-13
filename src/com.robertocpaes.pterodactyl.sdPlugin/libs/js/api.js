/// <reference path="event-emitter.js" />

class Api {
	static port;
	static uuid;
	static messageType;
	static actionInfo;
	static websocket;
	static language;
	static localization;
	static appInfo;
	static on = EventEmitter.on;
	static emit = EventEmitter.emit;

	constructor() {
		throw 'Cannot instantiate abstract class';
	}

	/**
	 * Connect to Stream Deck
	 * @param {string} port
	 * @param {string} uuid
	 * @param {string} messageType
	 * @param {string} appInfoString
	 * @param {string} actionString
	 */
	static connect(port, uuid, messageType, appInfoString, actionString) {
		this.port = port;
		this.uuid = uuid;
		this.messageType = messageType;
		this.actionInfo = actionString ? JSON.parse(actionString) : null;
		this.appInfo = JSON.parse(appInfoString);
		this.language = this.appInfo?.application?.language ?? null;

		if (this.websocket) {
			this.websocket.close();
			this.websocket = null;
		}

		this.websocket = new WebSocket('ws://127.0.0.1:' + this.port);

		this.websocket.onopen = () => {
			const json = {
				event: this.messageType,
				uuid: this.uuid,
			};

			this.websocket.send(JSON.stringify(json));

			this.emit(Events.connected, {
				connection: this.websocket,
				port: this.port,
				uuid: this.uuid,
				actionInfo: this.actionInfo,
				appInfo: this.appInfo,
				messageType: this.messageType,
			});
		};

		this.websocket.onerror = (evt) => {
			const error = `WEBOCKET ERROR: ${evt}, ${evt.data}, ${SocketErrors[evt?.code]}`;
			console.warn(error);
			this.logMessage(error);
		};

		this.websocket.onclose = (evt) => {
			console.warn('WEBOCKET CLOSED:', SocketErrors[evt?.code]);
		};

		this.websocket.onmessage = (evt) => {
			const data = evt?.data ? JSON.parse(evt.data) : null;
			const { action, event } = data;
			const message = action ? `${action}.${event}` : event;
			if (message && message !== '') this.emit(message, data);
		};
	}

	/**
	 * Write to log file
	 * @param {string} message
	 */
	static logMessage(message) {
		if (!message) {
			console.error('A message is required for logMessage.');
		}

		try {
			if (this.websocket) {
				const json = {
					event: Events.logMessage,
					payload: {
						message: message,
					},
				};
				this.websocket.send(JSON.stringify(json));
			} else {
				console.error('Websocket not defined');
			}
		} catch (e) {
			console.error('Websocket not defined');
		}
	}

	/**
	 * Fetches the specified language json file
	 * @param {string} pathPrefix
	 * @returns {Promise<void>}
	 */
	static async loadLocalization(pathPrefix) {
		if (!pathPrefix) {
			console.error('A path to localization json is required for loadLocalization.');
		}
		const manifest = await this.readJson(`${pathPrefix}${this.language}.json`);
		this.localization = manifest['Localization'] ?? null;
		window.$localizedStrings = this.localization;

		this.emit('localizationLoaded', this.localization);

		return this.localization;
	}

	/**
	 *
	 * @param {string} path
	 * @returns {Promise<any>} json
	 */
	static async readJson(path) {
		if (!path) {
			console.error('A path is required to readJson.');
		}

		return new Promise((resolve, reject) => {
			const req = new XMLHttpRequest();
			req.onerror = reject;
			req.overrideMimeType('application/json');
			req.open('GET', path, true);
			req.onreadystatechange = (response) => {
				if (req.readyState === 4) {
					const jsonString = response?.target?.response;
					if (jsonString) {
						resolve(JSON.parse(response?.target?.response));
					} else {
						reject();
					}
				}
			};

			req.send();
		});
	}

	/**
	 * Send JSON payload to StreamDeck
	 * @param {string} context
	 * @param {string} event
	 * @param {object} [payload]
	 */
	static send(context, event, payload = {}) {
		const pl = Object.assign({}, { context: context, event: event }, payload);
		this.websocket && this.websocket.send(JSON.stringify(pl));
	}

	/**
	 * Request the actions's persistent data. StreamDeck does not return the data, but trigger the actions's didReceiveSettings event
	 * @param {string} [context]
	 */
	static getSettings(context) {
		this.send(context ?? this.uuid, Events.getSettings);
	}

	/**
	 * Request the plugin's persistent data. StreamDeck does not return the data, but trigger the plugin/property inspectors didReceiveGlobalSettings event
	 */
	static getGlobalSettings() {
		this.send(this.uuid, Events.getGlobalSettings);
	}

	/**
	 * Save the plugin's persistent data
	 * @param {object} payload
	 */
	static setGlobalSettings(payload) {
		this.send(this.uuid, Events.setGlobalSettings, {
			payload: payload,
		});
	}

	/**
	 * Opens a URL in the default web browser
	 * @param {string} url
	 */
	static openUrl(url) {
		if (!url) {
			console.error('A url is required for openUrl.');
		}

		this.send(this.uuid, Events.openUrl, {
			payload: {
				url,
			},
		});
	}

	/**
	 * Send payload from the property inspector to the plugin
	 * @param {object} payload
	 */
	static sendToPlugin(payload) {
		this.send(this.uuid, Events.sendToPlugin, {
			action: this?.actionInfo?.action,
			payload: payload || null,
		});
	}

	/**
	 * Switches to a readonly profile or returns to previous profile
	 * @param {string} device
	 * @param {string} [profile]
	 */
	static switchToProfile(device, profile) {
		if (!device) {
			console.error('A device id is required for switchToProfile.');
		}

		if (!profile) {
			console.error('A profile name is required for switchToProfile');
		}

		this.send(this.uuid, Events.switchToProfile, { device: device, payload: { profile } });
	}

	/**
	 * Registers a callback function for when Stream Deck is connected
	 * @param {function} fn
	 * @returns StreamDeck
	 */
	static onConnected(fn) {
		if (!fn) {
			console.error(
				'A callback function for the connected event is required for onConnected.'
			);
		}

		this.on(Events.connected, (jsn) => fn(jsn));
		return this;
	}

	/**
	 * Registers a callback function for the didReceiveGlobalSettings event, which fires when calling getGlobalSettings
	 * @param {function} fn
	 */
	static onDidReceiveGlobalSettings(fn) {
		if (!fn) {
			console.error(
				'A callback function for the didReceiveGlobalSettings event is required for onDidReceiveGlobalSettings.'
			);
		}

		this.on(Events.didReceiveGlobalSettings, (jsn) => fn(jsn));
		return this;
	}

	/**
	 * Registers a callback function for the didReceiveSettings event, which fires when calling getSettings
	 * @param {string} action
	 * @param {function} fn
	 */
	static onDidReceiveSettings(action, fn) {
		if (!fn) {
			console.error(
				'A callback function for the didReceiveSettings event is required for onDidReceiveSettings.'
			);
		}

		this.on(`${action}.${Events.didReceiveSettings}`, (jsn) => fn(jsn));
		return this;
	}
}
