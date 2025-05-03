process.title = "Monopoly Server v2";

// Benötigte Bibliotheken
import http from "http";
import https from "https";
import fs from "fs";
import { server as webSocketServer } from "websocket";
import logger from "node-color-log";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

// .env laden
dotenv.config();

import User from "./models/user";
import userService from "./services/userService";
import CommandManager from "./commands/commandManager";
import serverResponse from "./commands/serverResponse";

const cmdManager = new CommandManager();
const serverPort = 1338;

// Konfig aus .env
const useSsl = process.env.USE_SSL === "true";
const sslCertFile = process.env.SSL_CERT_FILE;
const sslKeyFile = process.env.SSL_KEY_FILE;

let server;

if (useSsl) {
	if (!sslCertFile || !sslKeyFile) {
		logger.error("SSL is enabled, but SSL_CERT_FILE or SSL_KEY_FILE is not defined in .env!");
		process.exit(1);
	}

	const options = {
		cert: fs.readFileSync(sslCertFile),
		key: fs.readFileSync(sslKeyFile),
	};

	server = https.createServer(options, (req, res) => {
		res.writeHead(200);
		res.end("Secure Monopoly Server running.\n");
	});
	logger.info("Starting HTTPS server...");
} else {
	server = http.createServer((req, res) => {
		res.writeHead(200);
		res.end("Monopoly Server running.\n");
	});
	logger.info("Starting HTTP server...");
}

server.listen(serverPort, () => {
	logger.info("The server is running on port " + serverPort + (useSsl ? " (HTTPS)" : " (HTTP)"));
});

// WebSocket Server
const wsServer = new webSocketServer({
	httpServer: server
});

wsServer.on("request", function (request) {
	let connection = request.accept(null, request.origin);
	let userData = new User(uuid(), connection);

	userService.add(userData);
	logger.info(`New connection established (host: '${connection.remoteAddress}', origin: '${request.origin}', generated uid: '${userData.uid}')`);

	serverResponse.sendNotification(userData, "Verbindung erfolgreich hergestellt");

	connection.on("message", function (message) {
		if (message.type === "utf8") {
			logger.debug("Received message: " + message.utf8Data);
			try {
				const msg = JSON.parse(message.utf8Data);
				if (msg.type === undefined) {
					logger.warn("Unable to parse property 'type' of the message.");
					return;
				}
				cmdManager.handleCommand(userData, msg.type, msg.data);
			} catch (e) {
				logger.warn("An error occurred while handling the following message: ");
				logger.warn(message.utf8Data);
				logger.warn(e);
			}
		}
	});

	connection.on("close", function () {
		logger.info(`A connection was closed (host: '${userData.connection.remoteAddress}', uid: '${userData.uid}')`);
		userService.remove(userData);
	});
});
