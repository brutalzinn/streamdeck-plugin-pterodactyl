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

async function execAction(payload)
{	
	let settings = payload.settings
	let apiKey = settings.pterodactyl_api_key
	let apiUrl = settings.pterodactyl_api_url
	let apiServer = settings.pterodactyl_api_server
	let apiCommand = settings.pterodactyl_api_command
	console.log(`Send command '${apiCommand}' to id '${apiServer}' with api url '${apiUrl}' and apiKey '${apiKey}'`)
	let data = await getServerList(apiUrl, apiKey);
	await sendServerCommand(apiUrl, apiKey, apiServer, apiCommand)

	console.log('result' + JSON.stringify(data))
}

async function getServerList(apiUrl, apiKey){
 const response = await fetch(apiUrl + '/client', {
	method: 'GET',
   headers: {
      'Content-Type': 'application/json',
	  'Authorization': 'Bearer ' + apiKey
    },
})
return response.json();
}

async function sendServerCommand(apiUrl, apiKey, serverId, command){
 const response = await fetch(apiUrl + `/client/servers/${serverId}/command`, {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json',
	  'Authorization': 'Bearer ' + apiKey
    },
	body: JSON.stringify({ "command": command })
})
}



templateAction.onKeyUp(async (action) => {
	await execAction(action.payload)
	console.log('Key Up')
});

templateAction.onKeyDown((action) => {
	console.log('Key Down'+ JSON.stringify(action));
});