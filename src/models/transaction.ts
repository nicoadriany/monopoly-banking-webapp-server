import Player from "./player";

export default class Transaction {
	public timestamp: Date;
	public sender: string;
	public receiver: string;
	public amount: number;
	public reason: string;

	constructor(timestamp: Date, sender: string, receiver: string, amount: number, reason: string) {
		this.timestamp = timestamp;
		this.sender = sender;
		this.receiver = receiver;
		this.amount = amount;
		this.reason = reason;
	}
}