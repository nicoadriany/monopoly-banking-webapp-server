import logger from "node-color-log";
import { isValidNumber } from "../../helpers/helper";
import FreeRentContract from "../../models/freeRentContract";
import User from "../../models/user";
import freeRentContractService from "../../services/freeRentContractService";
import playerService from "../../services/playerService";

export default function createFreeRentContract(user: User, data: any) {
	let name: string = data.name;
	let amount: number = data.amount;

	if (name == null || name.length < 1 || !isValidNumber(amount) || amount < 1) {
		logger.info("Invalid data given");
		return;
	}

	let sender = user.getPlayer();
	let receiver = playerService.getByName(name);
	
	if (receiver == null) {
		logger.info("Unable to create a contract. Given receiver name '" + name + "' was not found");
		return;
	}

	freeRentContractService.add(new FreeRentContract(sender, receiver, amount));
	logger.info("New free rent contract created");
}