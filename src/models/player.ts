
export default class Player {
	public name: string;
	public money: number;
	public isSystemAccount: boolean;
  public isLoginLocked: boolean;

	constructor(name: string, money: number = 15000000, isSystemAccount: boolean = false, isLoginLocked?: boolean) {
		this.name = name;
		this.money = money;
		this.isSystemAccount = isSystemAccount;
    this.isLoginLocked = isLoginLocked;
	}
}