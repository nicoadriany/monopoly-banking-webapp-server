import logger from "node-color-log";
import User from "../../models/user";
import playerService from "../../services/playerService";
import userService from "../../services/userService";
import serverResponse from "../serverResponse";

export default function closeConnection(user: User, data: any) {
	let name: string = data.name;

	if (name == null || name.length <= 0) {
		logger.info("Invalid data given");
		return;
	}

	let player = playerService.getByName(name);
	
	if (player == null) {
		logger.info("Unable to close connection for player. Given player name '" + name + "' was not found");
		return;
	}

	let connectedUser = userService.getByConnectedPlayer(player);

	if (connectedUser == null) {
		logger.info("No user is currently connected to player '" + player.name + "'");
    serverResponse.sendNotification(user, `Der Spieler ${name} hat keine aktive Verbindung`);
		return;
	}

	connectedUser.connection.close();
	logger.info("Forcing connection termination for user connected to player '" + player.name + "'");
  serverResponse.sendNotification(user, `Die Verbindung von ${name} wurde getrennt`);
}