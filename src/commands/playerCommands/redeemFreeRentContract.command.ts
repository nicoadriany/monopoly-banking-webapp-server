import logger from "node-color-log";
import { isValidNumber } from "../../helpers/helper";
import ContractState from "../../models/contractState";
import User from "../../models/user";
import freeRentContractService from "../../services/freeRentContractService";

export default function redeemFreeRentContract(user: User, data: any) {
	let id:number = data.id;

	if (!isValidNumber(id)) {
		logger.info("Invalid data given");
		return;
	}

	let contract = freeRentContractService.getContractById(id);

	if (contract == null) {
		logger.info("Unable to redeem a contract. Given contract id '" + id + "' was not found");
		return;
	}

	let player = user.getPlayer();

	if (contract.receipient != player) {
		logger.info("Player '"+ player.name + "' doesnt have the permission to redeem contract id '" + contract.id + "'")
		return;
	}

	if (contract.state != ContractState.Accepted) {
		logger.info("Unable to redeem contract '"+ contract.id + "'. Contract is not in accepted state, current state is '" + contract.state + "'");
		return;
	}

	if (contract.amountAvailable <= contract.amountRedeemed) {
		logger.info("Unable to redeem contract '"+ contract.id + "'. All available slots have already been consumed.");
		return;
	}

	contract.amountRedeemed++;


	logger.info("Contract id '" + contract.id + "' has been redeemed by player '" + player.name + "' ("+ contract.amountRedeemed + " / " + contract.amountAvailable + " slots redeemed)");
}