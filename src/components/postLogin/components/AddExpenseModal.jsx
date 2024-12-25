import { useAuth } from "../../../contexts/AuthContext";
import Expense from "../../../models/Expense";
import { useState } from "react";

function AddExpenseModal({ open, onClose, group, fetchExpenses }) {
	const { currentUser } = useAuth();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [amount, setAmount] = useState("");

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
			participationData[m.uid] = formData.get(m.uid + "-participation");
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
			// Add expense to database
			fetchExpenses();
			onClose();
		} catch(e) {
			console.log(e.message);
			setError("Failed to create expense");
		} finally {
			setAmount("");
			setLoading(false);
			setAmount("");
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

	return (
		<div
			onClick={toggleClose}
			className={"fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-30 dark:bg-opacity-70 grid place-items-center " + (open ? "visible" : "hidden")}
		>
			<div
			    onClick={stopClose}
				className="w-[calc(100%-2rem)] max-w-screen-sm p-4 bg-white dark:bg-black dark:text-white border border-black dark:border-white rounded-xl"
			>
				{
					!open ? <></>
						: <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
							<h1 className="text-2xl dark:text-white text-center">
                                Add new expense
							</h1>
							<label className="dark:text-white">
                                Expense name: <br />
								<input
									name="name"
									type="text"
									className="w-full p-2 border border-black rounded-md dark:text-black"
								/>
							</label>
							<label className="dark:text-white">
                                Expense category: <br />
								<select
									name="category"
									id="category"
									defaultValue="transport"
									className="w-full p-2 border border-black rounded-md dark:text-black"
								>
									<option value="transport">Transport</option>
									<option value="accomodation">Accomodation</option>
									<option value="Food">Food</option>
									<option value="drinks">Drinks</option>
									<option value="miscellaneous">Miscellaneous</option>
								</select>
							</label>
							<label className="dark:text-white">
                                Who paid? <br />
								<select
									name="paid"
									id="paid"
									className="w-full p-2 border border-black rounded-md dark:text-black"
								>
									<option value="">-- Please select --</option>
									{
										group.members.map(m => <option key={ m.uid } value={JSON.stringify(m)}>{ m.name }</option>)
									}
								</select>
							</label>
							<label className="dark:text-white hidden">
                                Currency: <br />
								<select
									name="currency"
									id="currency"
									className="w-full p-2 border border-black rounded-md dark:text-black"
								>
									<option value="SEK">SEK</option>
								</select>
							</label>
							<label className="dark:text-white">
                                Amount: <br />
								<input
									type="text"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className="w-full p-2 border border-black rounded-md dark:text-black"
								/>
							</label>
							{
								!isNumeric(amount)
									? <p>The amount must be a number</p>
									: <div>
										{
											group.members.map(m =>
												<label key={m.uid} className="w-full dark:text-white flex justify-between items-center">
													{m.name}:
													<input
														name={ m.uid + "-participation" }
														type="text"
														className="w-16 p-2 border border-black rounded-md dark:text-black"
													/>
												</label>
											)
										}
									</div>
							}
							<button
								type="submit"
								disabled={loading || !currentUser}
								className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                                    disabled:bg-orange-200 hover:disabled:bg-orange-200"
							>
                                Add expense
							</button>
							<div className="text-sm text-red-500 text-center mt-[-10px]">
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

export default AddExpenseModal;
