import logger from "node-color-log";
import Player from "../../models/player";
import Transaction from "../../models/transaction";
import User from "../../models/user";
import serverResponse from "../serverResponse";
import playerService from "../../services/playerService";
import transactionService from "../../services/transactionService";
import userService from "../../services/userService";

export default function sendMoney(user: User, data: any) {
	let receiverName: string = data.receiver;
	let rawAmount: string = data.amount;
	
	let amount: number = parseInt(rawAmount);

	let sender: Player = user.getPlayer();

	if (receiverName == null || !Number.isInteger(amount)) {
		logger.debug("Invalid data given");
		return;
	}

	if (sender.name == receiverName) {
		logger.info("Player '" + sender.name + "' was trying to send money to himself");
		serverResponse.sendNotification(user, "Du kannst dir selbst kein Geld schicken");
		return;
	}

	if (amount <= 0) {
		logger.info("Player '" + sender.name + "' was trying to send an invalid amount (" + amount + ") of money");
    serverResponse.sendNotification(user, "Guter Versuch :)");
		return;
	}

	if (sender.money < amount) {
		logger.info("Player '" + sender.name + "' was unable to send money. Player balance: '" + sender.money + "', Amount: '" + amount + "'");
    serverResponse.sendNotification(user, "Du hast nicht genug Geld");
		return;
	}

	let receiver: Player = playerService.getByName(receiverName);

	if (receiver == null) {
		logger.info("Payment receiver (" + receiverName + ") was not found");
    serverResponse.sendNotification(user, "Der Empfänger war ungültig");
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