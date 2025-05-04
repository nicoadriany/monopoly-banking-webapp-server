import User from "../../models/user";
import gameControllerService from "../../services/gameControllerService";
import serverResponse from "../serverResponse";

export default function resetGame(user: User) {
	try {
		gameControllerService.resetGame();
	} catch (error: any) {
		serverResponse.sendNotification(user, "Fehler beim Zurücksetzen des Spiels: " + error.message);
	}
}