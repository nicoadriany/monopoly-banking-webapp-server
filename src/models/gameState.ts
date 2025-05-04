import Player from "./player";
import Transaction from "./transaction";

export default class GameState {
	public players: Player[];
	public transactions: Transaction[];

	constructor() {
		this.players = [];
		this.transactions = [];
	}
}