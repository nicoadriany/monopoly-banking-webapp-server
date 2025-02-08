import { formatNumber } from "../../helpers/helper";
import User from "../../models/user";
import playerService from "../../services/playerService";
import serverResponse from "../serverResponse";

export default function broadcastFreeParkingAmount(user: User) {
	var fpPlayer = playerService.getByName(playerService.NAME_MITTE);

	if (!fpPlayer) {
		serverResponse.sendNotification(user, "Der Systemaccount wurde nicht gefunden");
		return;
	}

	serverResponse.broadcastPlayerNotification(`In der Mitte liegen aktuell ${formatNumber(fpPlayer.money)}€`);
}