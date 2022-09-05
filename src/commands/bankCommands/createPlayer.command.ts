import logger from "node-color-log";
import Player from "../../models/player";
import User from "../../models/user";
import serverResponse from "../serverResponse";
import playerService from "../../services/playerService";

export default function createPlayer(user: User, data: any) {
	let name: string = data.name;

  name = name.replace(" ", "_");

	if (name == null || name.length <= 0) {
		logger.info("Invalid data given");
		return;
	}

	if (playerService.getByName(name) != null) {
		logger.info("Unable to create new player. Given name '" + name + "' is already in use");
		return;
	}

	let newPlayer = new Player(name);

	playerService.add(newPlayer);
	logger.info("New player '" + name + " created'");
  serverResponse.sendNotification(user, `Der Spieler ${name} wurde erstellt`);

	serverResponse.broadcastAddPlayer(newPlayer);
  serverResponse.sendOnlineStatusToBank(newPlayer, false);
}