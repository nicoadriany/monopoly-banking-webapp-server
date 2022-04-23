import Player from "../models/player";
import User from "../models/user";
import serverResponse from "../commands/serverResponse";

class UserService {
	private users: User[];

	constructor() {
		this.users = [];
	}

	add(user: User) {
		this.users.push(user);
	}

	remove(user: User) {
		let userIndex = this.users.indexOf(user);

		if (userIndex > -1) {
			//notify bank account that a user disconnected

			if (user.getPlayer() != null) {
				serverResponse.sendOnlineStatusToBank(user.getPlayer(), false);
			}

			this.users.splice(userIndex, 1);
		}
	}

	getByUid(uid: string) {
		return this.users.find(u => u.uid == uid);
	}

	getByConnectedPlayer(player: Player) {
		return this.users.find(u => u.getPlayer() === player);
	}

	getAllUsers() {
		return this.users;
	}
}

export default new UserService();