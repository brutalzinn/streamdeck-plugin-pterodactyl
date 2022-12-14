/// <reference path="../../../libs/js/property-inspector.js" />
/// <reference path="../../../libs/js/utils.js" />
/// <reference path="../../../mocks/mock.js" />


PropertyInspector.onConnected((jsn) => {
	const form = document.querySelector('#property-inspector');
	const { actionInfo, appInfo, connection, messageType, port, uuid } = jsn;
	const { payload, context } = actionInfo;
	const { settings } = payload;

	console.log(jsn);

	Utils.setFormValue(settings, form);

	form.addEventListener(
		'input',
		Utils.debounce(150, () => {
			const value = Utils.getFormValue(form);
			PropertyInspector.sendToPlugin(value);
			PropertyInspector.setSettings(value);
		})
	);
});

/**
 * Provide window level functions to use in the external window
 * (this can be removed if the external window is not used)
 */
// window.sendToInspector = (data) => {
// 	console.log(data);
// };

document.querySelector('#refresh_servers').addEventListener('click', () => {

	console.log("FSDFdsfdsfdsfs")

  	// var server = document.createElement("option");
	// server.text = "teste"
	// server.value = "teste"

	// var list = 	document.getElementById('pterodactyl_api_server');
	// list.appendChild(server)


	//window.open('../../../external.html');
});
