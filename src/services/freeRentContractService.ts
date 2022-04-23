import FreeRentContract from "../models/freeRentContract";

class FreeRentContractService {
	private contracts: FreeRentContract[];
	private contractCounter: number;

	constructor() {
		this.contracts = [];
		this.contractCounter = 0;
	}

	add(contract: FreeRentContract) {
		this.contractCounter++;

		contract.id = this.contractCounter;
		
		this.contracts.push(contract);
	}

	remove(contract: FreeRentContract) {
		let contractIndex = this.contracts.indexOf(contract);

		if (contractIndex > -1) {
			this.contracts.splice(contractIndex, 1);
		}
	}

	getContractById(id: number) {
		return this.contracts.find(c => c.id === id);
	}

	getAllTransactions() {
		return this.contracts;
	}
}

export default new FreeRentContractService();