const formatNumber = (number : number) => {
	return Math.max(0, number).toFixed(0).replace(/(?=(?:\d{3})+$)(?!^)/g, '.');
}

const isValidNumber = (number: number) => {
	if (number == null || isNaN(number)) {
		return false;
	}

	return true;
}

export { formatNumber, isValidNumber };