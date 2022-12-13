/// <reference path="constants.js" />
/// <reference path="api.js" />

class PropertyInspector extends Api {
	constructor() {
		super();
		throw 'Cannot instantiate abstract class';
	}

	/**
	 * Save the actions's persistent data.
	 * @param {object} payload
	 */
	static setSettings(payload) {
		this.send(this.uuid, Events.setSettings, {
			action: this?.actionInfo?.action,
			payload: payload || null,
		});
	}

	/**
	 * Registers a callback function for when Stream Deck sends data to the property inspector
	 * @param {string} actionUUID
	 * @param {function} fn
	 * @returns StreamDeck
	 */
	static onSendToPropertyInspector(actionUUID, fn) {
		if (typeof actionUUID != 'string') {
			console.error('An action UUID string is required for onSendToPropertyInspector.');
		}

		if (!fn) {
			console.error(
				'A callback function for the sendToPropertyInspector event is required for onSendToPropertyInspector.'
			);
		}

		this.on(`${actionUUID}.${Events.sendToPropertyInspector}`, (jsn) => fn(jsn));
		return this;
	}
}

/**
 * connectElgatoStreamDeckSocket
 * This is the first function StreamDeck Software calls, when
 * establishing the connection to the plugin or the Property Inspector
 * @param {string} port - The socket's port to communicate with StreamDeck software.
 * @param {string} uuid - A unique identifier, which StreamDeck uses to communicate with the plugin
 * @param {string} messageType - Identifies, if the event is meant for the property inspector or the plugin.
 * @param {string} appInfoString - Information about the host (StreamDeck) application
 * @param {string} actionInfo - Context is an internal identifier used to communicate to the host application.
 */
function connectElgatoStreamDeckSocket(port, uuid, messageType, appInfoString, actionInfo) {
	PropertyInspector.connect(port, uuid, messageType, appInfoString, actionInfo);
}
