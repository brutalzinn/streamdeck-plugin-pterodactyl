/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />
/// <reference path="libs/js/pterodactyl.js" />


const templateAction = new Action('com.robertocpaes.pterodactyl.action');
/**
 * The first event fired when Stream Deck starts
 */
 
StreamDeck.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Connected to Stream Deck!');
	//let data = PterodactylApi.getServerList(appInfo.payload.settings)
});

async function execAction(payload)
{	
	let settings = payload.settings
	let apiKey = settings.pterodactyl_api_key
	let apiUrl = settings.pterodactyl_api_url
	let apiServer = settings.pterodactyl_api_server
	let apiCommand = settings.pterodactyl_api_command
	console.log(`Send command '${apiCommand}' to id '${apiServer}' with api url '${apiUrl}' and apiKey '${apiKey}'`)
	await  PterodactylApi.sendServerCommand(apiUrl, apiKey, apiServer, apiCommand)
}

templateAction.onKeyUp(async (action) => {
	console.log('Key Up')
});

templateAction.onKeyDown(async (action) => {
	await execAction(action.payload)
	console.log('Key Down'+ JSON.stringify(action));
});