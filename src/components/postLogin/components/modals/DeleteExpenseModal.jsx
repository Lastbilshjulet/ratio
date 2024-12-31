import { useAuth } from "../../../../contexts/AuthContext";
import { db } from "../../../../firebase";
import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";

function DeleteExpenseModal({ open, onClose, groupId, expenseId, fetchExpenses }) {
	const { currentUser } = useAuth();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleDelete(e) {
		e.preventDefault();

		try {
			setLoading(true);
			setError("");
			await deleteDoc(doc(db, "groups", groupId, "expenses", expenseId));

			fetchExpenses();
			onClose();
		} catch(e) {
			console.log(e.message);
			setError("Failed to delete expense");
		} finally {
			setLoading(false);
		}
	}

	const toggleClose = () => {
		onClose();
	};

	const stopClose = (e) => {
		e.stopPropagation();
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
				<div className="flex flex-col gap-4">
					<h1 className="text-2xl dark:text-white text-center mb-4">
                        Are you sure you want to delete this expense?
					</h1>
					<button
				        onClick={handleDelete}
						disabled={loading || !currentUser}
						className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                            disabled:bg-orange-200 hover:disabled:bg-orange-200"
					>
                        Yes
					</button>
					<button
			            onClick={toggleClose}
						disabled={loading || !currentUser}
						className="p-2 rounded-md font-bold text-white bg-red-500 hover:bg-red-400 transition hover:dark:bg-red-600 hover:dark:text-white
                            disabled:bg-red-200 hover:disabled:bg-red-200"
					>
                        No
					</button>
					<div className="text-sm text-red-500 text-center mt-[-10px]">
						<p className={ error ? "visible" : "hidden" }>
							{error}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeleteExpenseModal;
