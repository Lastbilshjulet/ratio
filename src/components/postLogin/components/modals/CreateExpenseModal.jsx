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
	const [amount, setAmount] = useState("");

	useEffect(() => {
		if (expense.amount) {
			setAmount(expense.amount);
		}
	}, []);

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
									defaultValue={expense.paid ? expense.paid : "" }
									className="w-full p-2 border border-black rounded-md dark:text-black"
								>
									<option value="">-- Please select --</option>
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
														name={m.uid + "-participation"}
														defaultValue={expense.participation ? expense.participation[m.uid] : ""}
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
