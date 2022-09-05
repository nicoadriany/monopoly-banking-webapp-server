import Player from "../models/player";

class PlayerService {
	private players: Player[];
	
	readonly NAME_BANK = "Bank";
	readonly NAME_MITTE = "Mitte";

	constructor() {
		this.players = [];

		this.add(new Player(this.NAME_BANK, 150000000, true));
		this.add(new Player(this.NAME_MITTE, 0, true, true));
	}

	add(player: Player) {
		this.players.push(player);
	}

	remove(player: Player) {
		let playerIndex = this.players.indexOf(player);

		if (playerIndex > -1) {
			this.players.splice(playerIndex, 1);
		}
	}

	getByName(playerName: string) {
		return this.players.find(p => p.name == playerName);
	}

	getAllPlayers() {
		return this.players;
	}
}

export default new PlayerService();