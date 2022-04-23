import ContractState from "./contractState";
import Player from "./player";

export default class FreeRentContract {
	public id: number;
	public timestamp: Date;
	public creator: Player;
	public receipient: Player;
	public amountAvailable: number;
	public amountRedeemed: number;
	public state: ContractState;

	constructor(creator: Player, receipient: Player, amountAvailable: number) {
		this.timestamp = new Date();
		this.creator = creator;
		this.receipient = receipient;
		this.amountAvailable = amountAvailable;
		this.amountRedeemed = 0;
		this.state = ContractState.Proposed
	}
}