import User from "../../models/user";
import gameControllerService from "../../services/gameControllerService";
import serverResponse from "../serverResponse";

export default function saveGame(user: User) {
	try {
		gameControllerService.saveGame();
		serverResponse.sendNotification(user, "Das Spiel wurde erfolgreich gespeichert.");
	} catch (error: any) {
		serverResponse.sendNotification(user, "Fehler beim Speichern des Spiels: " + error.message);
	}
}