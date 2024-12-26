import { useState } from "react";
import { ExpenseCategories } from "../../../models/ExpenseCategories";

function ExpenseItem({ expense, group }) {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		console.log("Edit button clicked");
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		console.log("Delete button clicked");
	};

	const getUserName = (uid) => {
		const user = group.members.find(member => member.uid === uid);
		return user ? user.name : "Unknown";
	};

	return (
		<div onClick={toggleExpand} className="border border-black dark:border-white rounded-md w-full cursor-pointer">
			<div className="flex justify-between items-center p-4">
				<div className="grid justify-items-center">
					{expense.name}
				</div>
				<div className={`grid justify-items-center transform transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`}>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 16L8 12H16L12 16Z" fill="currentColor" />
					</svg>
				</div>
			</div>
			{isExpanded && (
				<div onClick={stopPropagation} className="flex flex-col gap-1 p-4 border-t border-black dark:border-white cursor-auto">
					<p><strong>Category:</strong> {ExpenseCategories[expense.category.toUpperCase()]}</p>
					<p><strong>Paid by:</strong> {expense.paid.name}</p>
					<p><strong>Amount:</strong> {expense.amount} {expense.currency}</p>
					<p><strong>Participation:</strong></p>
					<ul>
						{Object.entries(expense.participation).map(([uid, amount]) => (
							amount !== 0 ? <li key={uid}>{getUserName(uid)}: {amount} {expense.currency}</li>: <></>
						))}
					</ul>
					<button
						onClick={handleEdit}
						className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                            disabled:bg-orange-200 hover:disabled:bg-orange-200 mb-2"
					>
                        Edit expense
					</button>
					<button
						onClick={handleDelete}
						className="p-2 rounded-md font-bold text-white bg-red-500 hover:bg-red-400 transition hover:dark:bg-red-600 hover:dark:text-white
                            disabled:bg-red-200 hover:disabled:bg-red-200"
					>
                        Delete expense
					</button>
				</div>
			)}
		</div>
	);
}

export default ExpenseItem;
