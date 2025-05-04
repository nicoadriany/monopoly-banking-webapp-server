import User from "../../models/user";
import gameControllerService from "../../services/gameControllerService";
import serverResponse from "../serverResponse";

export default function loadGame(user: User) {
	try {
		gameControllerService.loadGame();
	} catch (error: any) {
		serverResponse.sendNotification(user, "Fehler beim Laden des Spiels: " + error.message);
	}
}