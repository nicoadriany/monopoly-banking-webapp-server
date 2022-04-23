import { connection } from "websocket";
import Player from "./player";

export default class User {
	public uid: string;
	public connection: connection
	private connectedPlayer: Player

	constructor(uid: string, connection: connection) {
		this.uid = uid;
		this.connection = connection;
	}

	setPlayer(player: Player) {
		this.connectedPlayer = player;
	}

	getPlayer() {
		return this.connectedPlayer;
	}
}