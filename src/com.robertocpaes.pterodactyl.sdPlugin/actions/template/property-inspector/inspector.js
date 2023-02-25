/// <reference path="../../../libs/js/property-inspector.js" />
/// <reference path="../../../libs/js/utils.js" />
/// <reference path="../../../mocks/mock.js" />
/// <reference path="../../../pterodactyl.js" />

PropertyInspector.onConnected((jsn) => {
	const form = document.querySelector('#property-inspector');
	const { actionInfo, appInfo, connection, messageType, port, uuid } = jsn;
	const { payload, context } = actionInfo;
	const { settings } = payload;
	const apiKey = payload.settings.pterodactyl_api_key
	const apiUrl =  payload.settings.pterodactyl_api_url
	console.log(jsn);
	Utils.setFormValue(settings, form);
	generateServerList(apiUrl, apiKey)

	form.addEventListener(
		'input',
		Utils.debounce(150, () => {
			const value = Utils.getFormValue(form);
			PropertyInspector.sendToPlugin(value);
			PropertyInspector.setSettings(value);
		})
	);
	document.querySelector('#refresh_servers').addEventListener('click',  (event) => {
  	event.preventDefault();
	generateServerList(apiUrl, apiKey)
});
});

function generateServerList(apiUrl, apiKey){
	var list = document.getElementById('pterodactyl_api_server');
	list.innerHTML = ''
	list.appendChild(createOption("Select a server", "none"))
	PterodactylApi.getServerList(apiUrl, apiKey).then(servers=>{
	servers.data.forEach(element=>{
		let serverId=  element.attributes.identifier;
		let serverName = element.attributes.name;
		list.appendChild(createOption(serverName, serverId))
	})
})
}

function createOption(text, value){
	let element = document.createElement("option");
	element.text = text
	element.value = value
	return element
}