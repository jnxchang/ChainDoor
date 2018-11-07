const usbScanner = require('./usbScanner').usbScanner;
const getDevices = require('./usbScanner').getDevices;
const ActionExecutor = require("./executor");
const actionExecutor = new ActionExecutor();

var scanners = [ ];
var connectedHidDevicesPath = [ ];

function queryConnectedDevices() {
	//get array of attached HID devices
	var connectedHidDevices = getDevices();

	for (let device of connectedHidDevices) {
		let foundPath = connectedHidDevicesPath.find(x => x == device.path);

		if (!foundPath) {
			console.log(device);

			var scanner = new usbScanner({
				devicePath: device.path
			});

			scanner.on("data", codeReceived);
			scanner.on("error", removeScanner);	
			scanners.push(scanner);
			connectedHidDevicesPath.push(device.path);
		}
	}
}

setInterval(queryConnectedDevices, 2000);

queryConnectedDevices();

async function codeReceived(code) {
	console.log("Processing recieved code: " + code);
	await actionExecutor.pushPay(code);
}

function removeScanner(e) {
	console.log(e);
	connectedHidDevicesPath = connectedHidDevicesPath.filter(x => x!= e.device.path);
}
