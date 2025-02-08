import User from "../../models/user";
import playerService from "../../services/playerService";
import serverResponse from "../serverResponse";

export default function tellRanking(user: User) {
	var players = playerService.getAllPlayers();

	var sortedByMoney = players.filter(p => !p.isSystemAccount).sort((p1, p2) => p2.money - p1.money);

	if (sortedByMoney.length == 0) {
		serverResponse.broadcastPlayerNotification("Es wurden keine aktiven Spieler gefunden");
		return;
	}

	sortedByMoney.forEach((p, i) => {
		serverResponse.sendPlayerNotification(p, `Du belegst aktuell Platz #${i+1}`);
	});
}