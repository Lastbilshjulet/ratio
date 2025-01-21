class Expense {
	constructor(name, category, paid, currency, amount, participation) {
		this.name = name;
		this.category = category;
		this.paid = paid;
		this.currency = currency;
		this.amount = amount;
		this.participation = participation;
	}

	isValid() {
		if (!this.name) {
			return { valid: false,
				error: "Name cannot be empty" };
		}
		if (!this.category) {
			return { valid: false,
				error: "Category cannot be empty" };
		}
		if (!this.paid) {
			return { valid: false,
				error: "Who paid? cannot be empty" };
		}
		if (!isNumeric(this.amount)) {
			return { valid: false,
				error: "Amount needs to be a number" };
		}
		this.amount = parseFloat(this.amount).toFixed(2);

		let combinedParticipationAmount = 0;
		let combinedParticipationPercentage = 0;
		let invalidParticipationInput = false;

		for (const key in this.participation) {
			if (isNumeric(this.participation[key].amount)) {
				this.participation[key].amount = parseFloat(this.participation[key].amount).toFixed(2);
				combinedParticipationAmount += parseFloat(this.participation[key].amount);
			} else {
				invalidParticipationInput = true;
			}
			if (isNumeric(this.participation[key].percentage)) {
				this.participation[key].percentage = parseFloat(this.participation[key].percentage).toFixed(2);
				combinedParticipationAmount += parseFloat(this.participation[key].percentage);
			} else {
				invalidParticipationInput = true;
			}
			if (this.participation[key].isIncluded) {
				if ((this.participation[key].amount !== 0) || (this.participation[key].percentage !== 0)) {
				    invalidParticipationInput = true;
				}
			}
		}

		if (invalidParticipationInput) {
			return { valid: false,
				error: "Participation amounts must be numbers" };
		}

		if (combinedParticipationAmount != this.amount) {
			return { valid: false,
				error: "The combined participation amount must equal the total amount" };
		}

		if (combinedParticipationPercentage != 100) {
			return { valid: false,
				error: "The combined participation percentage must equal 100" };
		}

		return { valid: true };
	}
}

function isNumeric(str) {
	return !isNaN(str) && !isNaN(parseFloat(str));
}

export default Expense;
