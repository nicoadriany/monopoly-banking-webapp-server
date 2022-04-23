import acceptFreeRentContract from "./playerCommands/acceptFreeRentContract.command";
import createFreeRentContract from "./playerCommands/createFreeRentContract.command";
import declineFreeRentContract from "./playerCommands/declineFreeRentContract.command";
import loginCommand from "./guestCommands/login.command";
import redeemFreeRentContract from "./playerCommands/redeemFreeRentContract.command";
import sendMoney from "./playerCommands/sendMoney.command";
import specialLogin from "./guestCommands/specialLogin.command";
import closeConnection from "./bankCommands/closeConnection.command";
import createPlayer from "./bankCommands/createPlayer.command";
import deletePlayer from "./bankCommands/deletePlayer.command";
import giveFreeParking from "./bankCommands/giveFreeParking.command";
import giveMoney from "./bankCommands/giveMoney.command";
import triggerSpecialAction from "./bankCommands/triggerSpecialAction.command";
import CommandType from "../models/commandType";
import User from "../models/user";
import playerService from "../services/playerService";

export default class CommandManager {
	private guestCommands: Map<string, Function>;
	private playerCommands: Map<string, Function>;
	private bankCommands: Map<string, Function>;

	constructor() {
		this.guestCommands = new Map();
		this.playerCommands = new Map();
		this.bankCommands = new Map();

		// Guest commands
		this.registerCommand("login", loginCommand, CommandType.GuestCommand);
		this.registerCommand("specialLogin", specialLogin, CommandType.GuestCommand);
		
		// Player commands
		this.registerCommand("specialLogin", specialLogin, CommandType.PlayerCommand);
		this.registerCommand("sendMoney", sendMoney, CommandType.PlayerCommand);
		this.registerCommand("createFreeRentContract", createFreeRentContract, CommandType.PlayerCommand);
		this.registerCommand("acceptFreeRentContract", acceptFreeRentContract, CommandType.PlayerCommand);
		this.registerCommand("declineFreeRentContract", declineFreeRentContract, CommandType.PlayerCommand);
		this.registerCommand("redeemFreeRentContract", redeemFreeRentContract, CommandType.PlayerCommand);

		// Bank commands
		this.registerCommand("closeConnection", closeConnection, CommandType.BankCommand);
		this.registerCommand("createPlayer", createPlayer, CommandType.BankCommand);
		this.registerCommand("deletePlayer", deletePlayer, CommandType.BankCommand);
		this.registerCommand("giveFreeParking", giveFreeParking, CommandType.BankCommand);
		this.registerCommand("giveMoney", giveMoney, CommandType.BankCommand);
		this.registerCommand("triggerSpecialAction", triggerSpecialAction, CommandType.BankCommand);
	}

	registerCommand(command: string, callback: Function, cmdType: CommandType) {
		switch (cmdType) {
			case CommandType.PlayerCommand:
				this.playerCommands.set(command, callback);
				break;
			case CommandType.BankCommand:
				this.bankCommands.set(command, callback);
				break;
			case CommandType.GuestCommand:
				this.guestCommands.set(command, callback);
				break;
			case CommandType.ServerCommand:
				//TODO: Implement server commands
				break;
		}
	}

	handleCommand(user: User, command: string, data: any) {
		if (user.getPlayer() == null) {
			if (this.guestCommands.has(command)) {
				let callback = this.guestCommands.get(command);
				callback(user, data);
				return true;
			}
		} else {
			let player = user.getPlayer();
			
			if (player.name === playerService.NAME_BANK) {
				if (this.bankCommands.has(command)) {
					let callback = this.bankCommands.get(command);
					callback(user, data);
					return true;
				}
			} else {
				if (this.playerCommands.has(command)) {
					let callback = this.playerCommands.get(command);
					callback(user, data);
					return true;
				}
			}
		}

		return false;
	}
}