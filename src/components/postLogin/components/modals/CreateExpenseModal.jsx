import { useAuth } from "../../../../contexts/AuthContext";
import { db } from "../../../../firebase";
import Expense from "../../../../models/Expense";
import { useState, useEffect } from "react";
import { addDoc, collection, Timestamp, updateDoc, doc } from "firebase/firestore";
import { ExpenseCategories } from "../../../../models/ExpenseCategories";

function CreateExpenseModal({ open, onClose, group, fetchExpenses, expense = {} }) {
	const { currentUser } = useAuth();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [paid, setPaid] = useState(expense.paid ?? currentUser.uid);
	const [amount, setAmount] = useState(expense.amount ?? "");
	const [usePercentage, setUsePercentage] = useState(true);
	const [participation, setParticipation] = useState({});
	const [temporaryInput, setTemporaryInput] = useState(null);

	useEffect(() => {
		if (!group.members) return;
		const initialParticipation = {};
		if (expense.participation) {
			group.members.forEach(m => {
				if (expense.participation[m.uid]) {
					initialParticipation[m.uid] = {
						amount: parseFloat(expense.participation[m.uid].amount).toFixed(2),
						percentage: parseFloat(expense.participation[m.uid].percentage).toFixed(2),
						isIncluded: expense.participation[m.uid].isIncluded,
						isEdited: false
					};
				} else {
					initialParticipation[m.uid] = {
						amount: 0.00,
						percentage: 0.00,
						isIncluded: false,
						isEdited: false
					};
				}
			});
			setParticipation(initialParticipation);
			return;
		}
		group.members.forEach(m => {
			initialParticipation[m.uid] = {};
			initialParticipation[m.uid].amount = 0;
			initialParticipation[m.uid].percentage = 0;
			initialParticipation[m.uid].isIncluded = true;
			initialParticipation[m.uid].isEdited = false;
		});

		let amountToShare = amount;
		let percentageToShare = 100;
		Object.keys(initialParticipation).forEach(uid => {
			const percentageShare = 100 / Object.keys(initialParticipation).length;
			percentageToShare -= percentageShare.toFixed(2);
			initialParticipation[uid].percentage = percentageShare.toFixed(2);
			const amountShare = amount / Object.keys(initialParticipation).length;
			amountToShare -= amountShare.toFixed(2);
			initialParticipation[uid].amount = amountShare.toFixed(2);
		});
		initialParticipation[paid].percentage = "" + (parseFloat(initialParticipation[paid].percentage) + parseFloat(percentageToShare.toFixed(2))).toFixed(2);
		initialParticipation[paid].amount = "" + (parseFloat(initialParticipation[paid].amount) + parseFloat(amountToShare.toFixed(2))).toFixed(2);
		setParticipation(initialParticipation);
	}, [group.members, amount, paid, open]);

	const updateParticipationValues = (initialParticipation) => {
		const includedParticipants = Object.keys(initialParticipation).filter(key => initialParticipation[key].isIncluded).length;
		if (includedParticipants < 1) {
			console.log("There has to be at least one included participant");
			return;
		}
		const sortedKeys = Object.keys(initialParticipation).sort((a, b) => {
			return parseFloat(initialParticipation[a].amount) - parseFloat(initialParticipation[b].amount);
		});

		let amountToShare = amount;
		let percentageToShare = 100;
		let editedParticipants = 0;
		let lastIncludedParticipant = undefined;
		sortedKeys.forEach(uid => {
			if (initialParticipation[uid].isEdited) {
				editedParticipants++;
			}
			if (initialParticipation[uid].isIncluded && initialParticipation[uid].isEdited) {
				percentageToShare -= initialParticipation[uid].percentage;
				amountToShare -= initialParticipation[uid].amount;
				lastIncludedParticipant = uid;
			}
		});
		sortedKeys.forEach(uid => {
			if (initialParticipation[uid].isIncluded && !initialParticipation[uid].isEdited) {
				const percentageShare = 100 / includedParticipants;
				percentageToShare -= percentageShare.toFixed(2);
				initialParticipation[uid].percentage = percentageShare.toFixed(2);
				const amountShare = amount / includedParticipants;
				amountToShare -= amountShare.toFixed(2);
				initialParticipation[uid].amount = amountShare.toFixed(2);
				lastIncludedParticipant = uid;
			}
		});
		if (initialParticipation[paid].isIncluded && editedParticipants !== sortedKeys.length) {
			initialParticipation[paid].percentage = "" + (parseFloat(initialParticipation[paid].percentage) + parseFloat(percentageToShare.toFixed(2))).toFixed(2);
			initialParticipation[paid].amount = "" + (parseFloat(initialParticipation[paid].amount) + parseFloat(amountToShare.toFixed(2))).toFixed(2);
		} else if (lastIncludedParticipant) {
			initialParticipation[lastIncludedParticipant].percentage = "" + (parseFloat(initialParticipation[lastIncludedParticipant].percentage) + parseFloat(percentageToShare.toFixed(2))).toFixed(2);
			initialParticipation[lastIncludedParticipant].amount = "" + (parseFloat(initialParticipation[lastIncludedParticipant].amount) + parseFloat(amountToShare.toFixed(2))).toFixed(2);
		}
		setParticipation(initialParticipation);
	};

	const handleParticipationValueChange = (uid, value) => {
		if (value < 0) {
			return;
		}
		setTemporaryInput({ uid,
			value });
	};

	const handleAmountChange = (value) => {
		if (value < 0) {
			return;
		}
		setAmount(value);
	};

	const handleParticipationInclusionChange = (uid, value) => {
		updateParticipationValues({
			...participation,
			[uid]: {
				amount: 0.00,
				percentage: 0.00,
				isIncluded: value ? true : false,
				isEdited: false
			}
		});
	};

	const handleUsePercentageToggleChange = () => {
		setUsePercentage(!usePercentage);
		updateParticipationValues({ ...participation });
	};

	const handleParticipationInputBlur = (uid) => {
		if (temporaryInput?.uid !== uid) {
			return;
		}
		if (temporaryInput.value == 0) {
			updateParticipationValues({
				...participation,
				[uid]: {
					amount: 0.00,
					percentage: 0.00,
					isIncluded: false,
					isEdited: false
				}
			});
			return;
		}
		let participantPercentage;
		let participantAmount;
		if (usePercentage) {
			participantPercentage = parseFloat(temporaryInput.value).toFixed(2);
			participantAmount = parseFloat((participantPercentage / 100) * amount).toFixed(2);
		} else {
			participantAmount = parseFloat(temporaryInput.value).toFixed(2);
			participantPercentage = parseFloat((participantAmount / amount) * 100).toFixed(2);
		}
		updateParticipationValues({
			...participation,
			[uid]: {
				...participation[uid],
				amount: participantAmount,
				percentage: participantPercentage,
				isEdited: true
			}
		});
		setTemporaryInput(null);
	};

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError("");

		const formData = new FormData(e.target);
		const name = formData.get("name");
		const category = formData.get("category");
		const paid = formData.get("paid");
		const currency = "SEK";

		const participationData = {};
		group.members.forEach(m => {
			if (participation[m.uid]) {
				participationData[m.uid] = {
					amount: parseFloat(participation[m.uid].amount),
					percentage: parseFloat(participation[m.uid].percentage),
					isIncluded: participation[m.uid].isIncluded
				};
			} else {
				participationData[m.uid] = {
					amount: 0.00,
					percentage: 0.00,
					isIncluded: false
				};
			}
		});

		const newExpense = new Expense(name, category, paid, currency, amount, participationData);
		const validation = newExpense.isValid();

		if (!validation.valid) {
			console.log(validation.error);
			setError(validation.error);
			setLoading(false);
			return;
		}

		try {
			const docExpense = {
				name: newExpense.name,
				category: newExpense.category,
				paid: newExpense.paid,
				currency: newExpense.currency,
				amount: newExpense.amount,
				participation: newExpense.participation,
				updatedAt: Timestamp.now()
			};
			if (expense.uid) {
				console.log("Editing expense");
				await updateDoc(doc(db, "groups", group.uid, "expenses", expense.uid), docExpense);
			} else {
				console.log("Creating expense");
				docExpense.createdAt = Timestamp.now();
				await addDoc(collection(db, "groups", group.uid, "expenses"), docExpense);
			}
			fetchExpenses();
			onClose();
		} catch(e) {
			console.log(e.message);
			setError("Failed to create expense");
		} finally {
			setAmount("");
			setLoading(false);
		}
	}

	const toggleClose = () => {
		onClose();
	};

	const stopClose = (e) => {
		e.stopPropagation();
	};

	const isNumeric = (str) => {
		return !isNaN(str) && !isNaN(parseFloat(str));
	};

	const getUserName = (uid) => {
		const user = group.members.find(member => member.uid === uid);
		return user ? user.name : "Unknown";
	};

	return (
		<div
			onClick={toggleClose}
			className={"fixed top-0 left-0 min-h-screen w-screen z-10 bg-black bg-opacity-30 dark:bg-opacity-70 grid place-items-center " + (open ? "visible" : "hidden")}
		>
			<div
			    onClick={stopClose}
				className="w-[calc(100%-2rem)] max-w-screen-sm p-4 bg-white dark:bg-black dark:text-white border border-black dark:border-white rounded-xl"
			>
				{
					!open ? <></>
						: <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<h1 className="text-2xl dark:text-white text-center">
								{expense.uid ? "Edit" : "Create new"} expense
							</h1>
							<label className="dark:text-white">
                                Expense name: <br />
								<input
									name="name"
									type="text"
									defaultValue={expense.name ? expense.name : ""}
									className="w-full p-2 border border-black rounded-md dark:text-black"
								/>
							</label>
							<label className="dark:text-white">
                                Expense category: <br />
								<select
									name="category"
									id="category"
									defaultValue={expense.category ? expense.category.toLowerCase() : "transport"}
									className="w-full p-2 border border-black rounded-md dark:text-black"
								>
									{
										Object.entries(ExpenseCategories).map(([key, value]) => (
											<option key={key} value={key.toLowerCase()}>{value}</option>
										))
									}
								</select>
							</label>
							<label className="dark:text-white">
                                Who paid? <br />
								<select
									name="paid"
									id="paid"
									value={paid}
									onChange={(e) => setPaid(e.target.value)}
									className="w-full p-2 border border-black rounded-md dark:text-black"
								>
									{
										group.members.map(m => <option key={ m.uid } value={m.uid}>{ m.name }</option>)
									}
								</select>
							</label>
							<label className="dark:text-white hidden">
                                Currency: <br />
								<select
									name="currency"
									id="currency"
									defaultValue={expense.currency ? expense.currency : ""}
									className="w-full p-2 border border-black rounded-md dark:text-black"
								>
									<option value="SEK">SEK</option>
								</select>
							</label>
							<label className="dark:text-white">
                                Amount: <br />
								<input
									type="number"
									value={amount}
									onChange={(e) => handleAmountChange(e.target.value)}
									min={0}
									className="w-full p-2 border border-black rounded-md dark:text-black
                                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
								/>
							</label>
							{
								!isNumeric(amount)
									? <p>The amount must be a number</p>
									: <>
										<div>
											<label className="w-full dark:text-white flex justify-between items-center">
                                                Use percentages:
												<div className="relative inline-block w-[76px] h-[38px]">
													<input
														type="checkbox"
														className="opacity-0 w-0 h-0 peer"
														checked={usePercentage}
														onChange={handleUsePercentageToggleChange}
													/>
													<span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-black border rounded-full
                                                        border-black dark:border-white transition duration-[400ms] before:absolute before:w-[30px] before:aspect-square
                                                        before:left-[4px] before:bottom-[3px] before:bg-orange-500 before:transition before:duration-[400ms] before:rounded-full
                                                        peer-checked:bg-white peer-checked:before:translate-x-[34px] before:z-10"></span>
													<span className="absolute left-[6px] bottom-[10px] h-[16px] w-[25px] bg-orange-400 rounded-full peer-checked:w-[50px]
                                                        peer-checked:transition-[width] peer-checked:duration-[400ms] transition-[width] duration-[400ms] cursor-pointer"></span>
												</div>
											</label>
										</div>
										<div>
											{
									            participation && Object.entries(participation).map(([key]) =>
													<label key={key} className="w-full dark:text-white flex justify-between items-center">
														{getUserName(key)}:
														<span className="flex gap-2 items-center">
															{usePercentage ? parseFloat(participation[key].amount).toFixed(2) + " SEK" : parseFloat(participation[key].percentage).toFixed(2) + "%"}
															<input
																type="number"
																name={key + "-participation"}
																min={0}
																disabled={!participation[key].isIncluded}
																value={
																	temporaryInput?.uid == key
																		? temporaryInput.value
																		: usePercentage ? parseFloat(participation[key].percentage).toFixed(2) : parseFloat(participation[key].amount).toFixed(2)
																}
																onChange={(e) => handleParticipationValueChange(key, e.target.value)}
																onBlur={() => handleParticipationInputBlur(key)}
																className="p-1 border border-black rounded-md dark:text-black
                                                                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
															/>
															<input
																type="checkbox"
																name={key + "-inclusion"}
																checked={participation[key].isIncluded}
																onChange={() => handleParticipationInclusionChange(key, !participation[key].isIncluded)}
																className="w-8 h-8 appearance-none bg-black border-2 border-gray-400 rounded-md
                                                                    checked:bg-white checked:border-orange-500 checked:after:content-['✓']
                                                                    checked:after:text-orange-500 checked:after:block checked:after:font-extrabold
                                                                    checked:after:leading-none checked:after:text-center checked:after:text-2xl"
															/>
														</span>
													</label>
												)
											}
										</div>
									</>
							}
							<button
								type="submit"
								disabled={loading || !currentUser}
								className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                                    disabled:bg-orange-200 hover:disabled:bg-orange-200"
							>
								{expense.uid ? (loading ? "Editing..." : "Edit expense") : (loading ? "Creating..." : "Create expense")}
							</button>
							<div className="text-sm text-red-500 text-center">
								<p className={ error ? "visible" : "hidden" }>
									{error}
								</p>
							</div>
						</form>
				}
			</div>
		</div>
	);
}

export default CreateExpenseModal;
