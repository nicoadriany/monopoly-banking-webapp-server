import User from "../../models/user";
import playerService from "../../services/playerService";
import serverResponse from "../serverResponse";

export default function broadcastPoorest(user: User) {
	var players = playerService.getAllPlayers();

	var sortedByMoney = players.filter(p => !p.isSystemAccount).sort((p1, p2) => p1.money - p2.money);

	if (sortedByMoney.length == 0) {
		serverResponse.broadcastPlayerNotification("Es wurden keine aktiven Spieler gefunden");
		return;
	}

	serverResponse.broadcastPlayerNotification(`Der ärmste Spieler ist aktuell ${sortedByMoney[0].name}`);
}