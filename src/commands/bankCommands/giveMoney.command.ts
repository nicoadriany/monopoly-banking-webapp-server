import logger from "node-color-log";
import { isValidNumber } from "../../helpers/helper";
import Transaction from "../../models/transaction";
import User from "../../models/user";
import serverResponse from "../serverResponse";
import playerService from "../../services/playerService";
import transactionService from "../../services/transactionService";
import userService from "../../services/userService";

export default function giveMoney(user: User, data: any) {
	let name: string = data.name;
	let amount: number = data.amount;
	let reason: string = data.reason;

	if (name == null || name.length < 1 || !isValidNumber(amount) || amount == 0) {
		logger.info("Invalid data given");
		return;
	}

	let player = playerService.getByName(name);
	
	if (player == null) {
		logger.info("Unable to give money to player. Given player name '" + name + "' was not found");
		return;
	}

	player.money += amount;

	let transaction = new Transaction(new Date(), playerService.NAME_BANK, player.name, amount, reason == null ? "Gutschrift" : reason);

	transactionService.add(transaction);

	serverResponse.sendTransaction(player, transaction);
	serverResponse.sendTransaction(playerService.getByName(playerService.NAME_BANK), transaction);
	serverResponse.sendOwnData(userService.getByConnectedPlayer(player));
}