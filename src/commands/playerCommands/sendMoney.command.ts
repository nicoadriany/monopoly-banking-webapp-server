import logger from "node-color-log";
import { isValidNumber } from "../../helpers/helper";
import Player from "../../models/player";
import Transaction from "../../models/transaction";
import User from "../../models/user";
import serverResponse from "../../serverResponse";
import playerService from "../../services/playerService";
import transactionService from "../../services/transactionService";
import userService from "../../services/userService";

export default function sendMoney(user: User, data: any) {
	let receiverName: string = data.receiver;
	let amount: number = data.amount;

	let sender: Player = user.getPlayer();

	if (receiverName == null || !isValidNumber(amount)) {
		logger.debug("Invalid data given");
		return;
	}

	if (amount <= 0) {
		logger.info("Player '" + sender.name + "' was trying to send an invalid amount (" + amount + ") of money");
		return;
	}

	if (sender.money < amount) {
		logger.info("Player '" + sender.name + "' was unable to send money. Player balance: '" + sender.money + "', Amount: '" + amount + "'");
		return;
	}

	let receiver: Player = playerService.getByName(receiverName);

	if (receiver == null) {
		logger.info("Payment receiver (" + receiverName + ") was not found");
		return;
	}

	receiver.money += amount;
	sender.money -= amount;

	let transaction = new Transaction(new Date(), sender.name, receiver.name, amount, "Überweisung");
	transactionService.add(transaction);

	logger.info("[Balance after payment] Sender: '" + sender.money + "', Receiver: '" + receiver.money + "'");

	serverResponse.sendTransaction(sender, transaction);
	serverResponse.sendOwnData(user);
	serverResponse.sendTransaction(receiver, transaction);
	serverResponse.sendOwnData(userService.getByConnectedPlayer(receiver));
}