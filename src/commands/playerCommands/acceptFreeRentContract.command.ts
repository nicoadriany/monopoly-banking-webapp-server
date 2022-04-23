import logger from "node-color-log";
import { isValidNumber } from "../../helpers/helper";
import ContractState from "../../models/contractState";
import User from "../../models/user";
import freeRentContractService from "../../services/freeRentContractService";

export default function acceptFreeRentContract(user: User, data: any) {
	let id:number = data.id;

	if (!isValidNumber(id)) {
		logger.info("Invalid data given");
		return;
	}

	let contract = freeRentContractService.getContractById(id);

	if (contract == null) {
		logger.info("Unable to accept a contract. Given contract id '" + id + "' was not found");
		return;
	}

	let player = user.getPlayer();

	if (contract.receipient != player) {
		logger.info("Player '"+ player.name + "' doesnt have the permission to accept contract id '" + contract.id + "'")
		return;
	}

	if (contract.state != ContractState.Proposed) {
		logger.info("Unable to accept contract '"+ contract.id + "'. Contract is not in proposed state, current state is '" + contract.state + "'");
		return;
	}

	contract.state = ContractState.Accepted;
	logger.info("Contract id '" + contract.id + "' has been accepted by player '" + player.name + "'");
}