process.title = "Monopoly Server v2";

//Benötigte Bibliotheken
import http from "http";
import { server as webSocketServer } from "websocket";
import logger from "node-color-log";
import { v4 as uuid } from "uuid";

// import * as helper from "./helpers/helper";
import User from "./models/user";

import userService from "./services/userService";
import CommandManager from "./commands/commandManager";
import serverResponse from "./serverResponse";

const cmdManager = new CommandManager();

//Variablen
const serverPort = 1338;

//HTTP Server
const server = http.createServer(function(request, response) {
		
});

server.listen(serverPort, function() {
	logger.info("The server is running on port " + serverPort);
});

//WebSocket Server
const wsServer = new webSocketServer({
	httpServer: server
});

wsServer.on('request', function(request) {
    
    let connection = request.accept(null, request.origin);
	let userData = new User(uuid(), connection);
	
	userService.add(userData);
	logger.info("New connection established (host: '" + connection.remoteAddress + "', origin: '" + request.origin + "', generated uid: '" + userData.uid + "')");

	serverResponse.sendNotification(userData, "Verbindung erfolgreich hergestellt");
	

    
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
			logger.debug("Received message: " + message.utf8Data);
			try {
				var msg = JSON.parse(message.utf8Data); 

				if (msg.type === undefined) {
					logger.warn("Unable to parse property 'type' of the message.");
					return;
				}

				cmdManager.handleCommand(userData, msg.type, msg.data);
			} catch(e) {
				logger.warn("An error occured while handling the following message: ");
				logger.warn(message.utf8Data);
				logger.warn(e);
			}
        }
    });

    
    connection.on('close', function(connection) {
		logger.info("A connection was closed (host: '" + userData.connection.remoteAddress + "', uid: '" + userData.uid + "')");
		userService.remove(userData);
    });

});
