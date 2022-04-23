import logger from "node-color-log";
import User from "../../models/user";
import serverResponse from "../../serverResponse";
import playerService from "../../services/playerService";
import transactionService from "../../services/transactionService";
import userService from "../../services/userService";

export default function deletePlayer(user: User, data: any) {
	let name: string = data.name;

	if (name == null || name.length <= 0) {
		logger.info("Invalid data given");
		return;
	}

	let player = playerService.getByName(name);
	
	if (player == null) {
		logger.info("Unable to delete player. Given name '" + name + "' was not found");
		return;
	}

	let connectedUser = userService.getByConnectedPlayer(player);

	if (connectedUser != null) {
		connectedUser.connection.close();
	}

	transactionService.setInactiveState(player.name);
	serverResponse.broadcastDeletePlayer(player);
	playerService.remove(player);
}