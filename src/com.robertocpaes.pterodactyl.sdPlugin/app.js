/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const templateAction = new Action('com.robertocpaes.pterodactyl.action');
let appInfoContext = {}
/**
 * The first event fired when Stream Deck starts
 */
 
StreamDeck.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Connected to Stream Deck!');
	appInfoContext = appInfo
});

function execAction()
{

}

templateAction.onKeyUp((action) => {
	console.log('Key Up' + JSON.stringify(action))
});

templateAction.onKeyDown(() => {
	console.log('Key Down');
});