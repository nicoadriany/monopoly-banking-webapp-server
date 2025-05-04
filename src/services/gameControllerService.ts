import path from "path";
import fs from "fs";
import Player from "../models/player";
import GameState from "../models/gameState";
import playerService from "./playerService";
import transactionService from "./transactionService";
import userService from "./userService";
import serverResponse from "../commands/serverResponse";

class GameControllerService {
	private saveGameDirectory: string;

	constructor() {
		this.saveGameDirectory = process.env.SAVE_GAME_DIRECTORY || "./savegame";
	}

	saveGame() {
		const saveGamePath = path.join(this.saveGameDirectory, "savegame.json");

		const gameState: GameState = new GameState();
		gameState.players = playerService.getAllPlayers();
		gameState.transactions = transactionService.getAllTransactions();

		if (!fs.existsSync(this.saveGameDirectory)) {
			fs.mkdirSync(this.saveGameDirectory, { recursive: true });
		}

		const data = JSON.stringify(gameState);
		fs.writeFileSync(saveGamePath, data, "utf8");
		console.log("Game saved successfully to " + saveGamePath);
	}

	loadGame() {
		const saveGamePath = path.join(this.saveGameDirectory, "savegame.json");

		if (!fs.existsSync(saveGamePath)) {
			console.log("No save game found at " + saveGamePath);
			return;
		}

		const data = fs.readFileSync(saveGamePath, "utf8");
		const gameState: GameState = JSON.parse(data);

		if (!gameState || !gameState.players || !gameState.transactions) {
			console.log("Invalid save game data in " + saveGamePath);
			return;
		}

		// close all connections for logged in users
		userService.getAllUsers().forEach((user) => {
			if (user.getPlayer()) {
				user.connection.close();
			}
		});

		playerService.setAllPlayers(gameState.players);
		transactionService.setAllTransactions(gameState.transactions);

		console.log("Game loaded successfully from " + saveGamePath);
		serverResponse.sendNotificationToAllUsers("Der Spielstand wurde erfolgreich geladen!");
	}

	resetGame() {
		// close all connections for logged in users
		userService.getAllUsers().forEach((user) => {
			if (user.getPlayer()) {
				user.connection.close();
			}
		});

		playerService.reset();
		transactionService.reset();
		console.log("Game reset successfully");
		serverResponse.sendNotificationToAllUsers("Der Spielstand wurde erfolgreich zurückgesetzt!");
	}

}

export default new GameControllerService();