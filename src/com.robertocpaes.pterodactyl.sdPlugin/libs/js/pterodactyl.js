class PterodactylApi{

static async getServerList(apiUrl, apiKey){
 const response = await fetch(apiUrl + '/client', {
	method: 'GET',
   headers: {
      'Content-Type': 'application/json',
	  'Authorization': 'Bearer ' + apiKey
    },
})
return response.json();
}

static async sendServerCommand(apiUrl, apiKey, serverId, command){
 await fetch(apiUrl + `/client/servers/${serverId}/command`, {
   method: 'POST',
   headers: {
      'Content-Type': 'application/json',
	  'Authorization': 'Bearer ' + apiKey
    },
	body: JSON.stringify({ "command": command })
})
}

}