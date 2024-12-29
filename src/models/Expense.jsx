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
		let invalidParticipationInput = false;

		for (const key in this.participation) {
			if (isNumeric(this.participation[key])) {
				this.participation[key] = parseFloat(this.participation[key]).toFixed(2);
				combinedParticipationAmount += parseFloat(this.participation[key]);
			} else {
				invalidParticipationInput = true;
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

		return { valid: true };
	}
}

function isNumeric(str) {
	return !isNaN(str) && !isNaN(parseFloat(str));
}

export default Expense;
