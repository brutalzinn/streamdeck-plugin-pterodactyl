///Auto restart for stream deck
///13/12/2022 - Trying to do a multi plataform helper to developer with Sream Elgato SDK and auto restart Stream Deck APP.
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const localDist = "C:/Users/rober/OneDrive/Área de Trabalho/streamdeck-plugin-template/src/com.robertocpaes.pterodactyl.sdPlugin"
const pluginsDir = "C://Users//rober//AppData//Roaming//Elgato//StreamDeck//Plugins//com.robertocpaes.pterodactyl.sdPlugin"
const streamDeckExeLocation = 'C:\\Program Files\\Elgato\\StreamDeck\\StreamDeck.exe'
const streamDeckExeLocationSplitter = streamDeckExeLocation.split('\\')
const streamDeckExeName = streamDeckExeLocationSplitter[streamDeckExeLocationSplitter.length - 1]
const platform = process.platform;
let systemCommands = {
 win32:{
  process_exec: `"${streamDeckExeLocation}"`,
  process_list: `tasklist`,
  process_kill:`taskkill /IM ${streamDeckExeName} /F`,
  copy:`xcopy "${localDist}" "${pluginsDir}" /s /e /y /i`,
 }
}

const isRunning = (query, cb) => {
    let cmd = '';
    let platformCMD = systemCommands[platform];
    cmd = platformCMD.process_list
    exec(cmd, (err, stdout, stderr) => {
        var pid = stdout.toLowerCase().indexOf(query.toLowerCase())
        cb(pid > -1, pid);
    });
}

isRunning(streamDeckExeName,async (status, pid) => {
    console.log(status, pid); // true|false
    let platformCMD = systemCommands[platform];

    if(status){
    console.log("Restating streamdeck..")
      await exec(platformCMD.process_kill)
    }
    await exec(platformCMD.copy);
     setTimeout(function(){
        console.log('Stopping process with SGKILL..');
        process.exit(0)
}, 2000);
    await exec(platformCMD.process_exec);
})


