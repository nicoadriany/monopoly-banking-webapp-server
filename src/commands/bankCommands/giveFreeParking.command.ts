import logger from "node-color-log";
import Player from "../../models/player";
import Transaction from "../../models/transaction";
import User from "../../models/user";
import serverResponse from "../../serverResponse";
import playerService from "../../services/playerService";
import transactionService from "../../services/transactionService";
import { formatNumber } from "../../helpers/helper";

export default function giveFreeParking(user: User, data: any) {
	let name: string = data.name;

	if (name == null || name.length <= 0) {
		logger.info("Invalid data given");
		return;
	}

	let player = playerService.getByName(name);
	
	if (player == null) {
		logger.info("Unable to give free parking money. Given player name '" + name + "' was not found");
		return;
	}

	let freeParkingAccount: Player = playerService.getByName(playerService.NAME_MITTE);

	if (freeParkingAccount == null) {
		logger.error("Unable to give free parking money. Free parking account could not be found");
		return;
	}

	let amount = freeParkingAccount.money;

	player.money += amount;
	freeParkingAccount.money = 0;

	let transaction = new Transaction(new Date(), freeParkingAccount.name, player.name, amount, "Frei Parken");

	transactionService.add(transaction);

	serverResponse.sendTransaction(player, transaction);
	serverResponse.broadcastPlayerNotification(player.name + " hat " + formatNumber(amount) + " aus der Mitte erhalten");
}