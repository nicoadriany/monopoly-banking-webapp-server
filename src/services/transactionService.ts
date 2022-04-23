import Transaction from "../models/transaction";

class TransactionService {
	private transactions: Transaction[];

	constructor() {
		this.transactions = [];
	}

	add(transaction: Transaction) {
		this.transactions.push(transaction);
	}

	remove(transaction: Transaction) {
		let transactionIndex = this.transactions.indexOf(transaction);

		if (transactionIndex > -1) {
			this.transactions.splice(transactionIndex, 1);
		}
	}

	getAllTransactions() {
		return this.transactions;
	}

	setInactiveState(playerName: string) {
		this.transactions.forEach((t) => {
			if (t.sender === playerName) {
				t.sender = t.sender + " (Inaktiv)";
			}

			if (t.receiver === playerName) {
				t.receiver = t.receiver + " (Inaktiv)";
			}
		})
	}
}

export default new TransactionService();