/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const templateAction = new Action('com.robertocpaes.pterodactyl.action');

/**
 * The first event fired when Stream Deck starts
 */
StreamDeck.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Connected to Stream Deck!');
});

templateAction.onKeyUp(() => {
	console.log('Key Up');
});
