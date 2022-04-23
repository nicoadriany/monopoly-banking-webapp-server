import logger from "node-color-log";
import { connection } from "websocket";
import Player from "./models/player";
import Transaction from "./models/transaction";
import User from "./models/user";
import playerService from "./services/playerService";
import transactionService from "./services/transactionService";
import userService from "./services/userService";

class ServerResponse {
	sendPlayerNotification(player: Player, message: string) {
		let user = userService.getByConnectedPlayer(player);

		if (user == null) {
			logger.info("Unable to send message to player '" + player.name + "'. No user is currently connected");
			return;
		}

		this.sendNotification(user, message);
	}

	sendNotification(user: User, message: string) {
		let msg = {
			message: message
		}

		this._sendObject(user.connection, "notification", msg);
	}

	broadcastPlayerNotification(message: string) {
		userService.getAllUsers().filter(u => u.getPlayer() != null).forEach((u) => {
			this.sendNotification(u, message);
		});
	}

	sendOnlineStatusToBank(player: Player, isOnline: boolean) {
		let msg = {
			playerName: player.name,
			isOnline: isOnline
		}

		let user = userService.getByConnectedPlayer(playerService.getByName(playerService.NAME_BANK));

		if (user == null) {
			logger.debug("Unable to send online status to bank, no user is logged in as bank");
			return;
		}

		this._sendObject(user.connection, "onlineStatus", msg);
	}

	sendOwnData(user: User) {
		if (user == null) return;
		
		let player = user.getPlayer();
		
		if (player == null) {
			logger.info("Unable to send data to user '" + user.uid + "'. User is not linked to a player");
			return;
		}

		this._sendObject(user.connection, "ownData", player);
	}

	sendLoginSuccess(user: User) {
		let player = user.getPlayer();

		if (player == null) {
			logger.info("Unable to send login success to user '" + user.uid + "'. User is not linked to a player");
			return;
		}

		this._sendObject(user.connection, "loginSuccess", null);
	}

	sendTransaction(player: Player, transaction: Transaction) {
		let user = userService.getByConnectedPlayer(player);

		if (user == null) {
			logger.info("Unable to send transaction to player '" + player.name + "'. No user is currently connected");
			return true;
		}

		this._sendObject(user.connection, "transaction", transaction);
	}

	sendOwnTransactionList(player: Player) {
		let user = userService.getByConnectedPlayer(player);

		if (user == null) {
			logger.info("Unable to send transaction list to player '" + player.name + "'. No user is currently connected");
			return;
		}

		let transactionList = transactionService.getAllTransactions().filter(t => t.receiver == player.name || t.sender == player.name);

		this._sendObject(user.connection, "transactionList", transactionList);
	}

	sendPlayerList(user: User, withOnlineStatus: boolean = false) {
		let players = playerService.getAllPlayers();

		if (!withOnlineStatus) {
			this._sendObject(user.connection, "playerList", players);
			return;
		}

		let playersExtended = [];

		for (let i=0;i<players.length;i++) {
			let p = players[i];

			let pData = {
				player: p,
				isOnline: userService.getByConnectedPlayer(p) != null
			}

			playersExtended.push(pData);
		}

		this._sendObject(user.connection, "playerListExtended", playersExtended);
	}

	broadcastAddPlayer(player: Player) {
		userService.getAllUsers().filter(u => u.getPlayer() != null).forEach((u) => {
			this._sendObject(u.connection, "addPlayer", player);
		});
	}

	broadcastDeletePlayer(player: Player) {
		userService.getAllUsers().filter(u => u.getPlayer() != null).forEach((u) => {
			this._sendObject(u.connection, "deletePlayer", player);
		});
	}

	private _sendObject(con: connection, type: string, data: any) {
		let obj: object = {}

		if (data != null) {
			obj = {
				type: type,
				data: data
			}
		} else {
			obj = {
				type: type
			}
		}

		con.send(JSON.stringify(obj));
	}
}

export default new ServerResponse();