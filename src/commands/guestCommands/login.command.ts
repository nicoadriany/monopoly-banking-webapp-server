import logger from "node-color-log";
import Player from "../../models/player";
import User from "../../models/user";
import serverResponse from "../serverResponse";
import playerService from "../../services/playerService";
import userService from "../../services/userService";

export default function loginCommand(user: User, data: any) {
	let name: string = data.name;

	if (name == null) {
		logger.debug("Given name was null");
		return;
	}

	let player: Player = playerService.getByName(name);

	if (player == null) {
		logger.debug("No player with the name '" + name + "' was found");
		serverResponse.sendNotification(user, "Der Spieler wurde nicht gefunden");
		return;
	}

	if (player.isSystemAccount) {
		logger.debug("Unable to login to player '" + name + "'. Account is system account");
		serverResponse.sendNotification(user, "Login mit diesem Account nicht möglich");
		return;
	}

	if (userService.getAllUsers().find(u => u.getPlayer() == player) != null) {
		logger.debug("The user '" + name + "' is already logged in");
		serverResponse.sendNotification(user, "Der Spieler ist bereits eingeloggt");
		return;
	}

	user.setPlayer(player);
	serverResponse.sendNotification(user, "Login erfolgreich"); 
	serverResponse.sendLoginSuccess(user);
	serverResponse.sendOwnData(user);
	serverResponse.sendPlayerList(user);
	serverResponse.sendOwnTransactionList(player);
	serverResponse.sendOnlineStatusToBank(player, true);
	logger.info("Player '" + player.name + "' is now connected to '" + user.uid + "'");
}