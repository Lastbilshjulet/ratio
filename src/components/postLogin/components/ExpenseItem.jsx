import { useState, useRef, useEffect } from "react";
import { ExpenseCategories } from "../../../models/ExpenseCategories";
import DeleteExpenseModal from "./modals/DeleteExpenseModal";
import CreateExpenseModal from "./modals/CreateExpenseModal";

function ExpenseItem({ expense, group, fetchExpenses }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [deleteExpenseModalOpen, setDeleteExpenseModalOpen] = useState(false);
	const [editExpenseModalOpen, setEditExpenseModalOpen] = useState(false);
	const contentRef = useRef(null);

	const handleOpenDeleteExpenseModal = () => setDeleteExpenseModalOpen(true);
	const handleCloseDeleteExpenseModal = () => setDeleteExpenseModalOpen(false);

	const handleOpenEditExpenseModal = () => setEditExpenseModalOpen(true);
	const handleCloseEditExpenseModal = () => setEditExpenseModalOpen(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	const handleEdit = (e) => {
		e.stopPropagation();
		handleOpenEditExpenseModal();
	};

	const handleDelete = (e) => {
		e.stopPropagation();
		handleOpenDeleteExpenseModal();
	};

	const getUserName = (uid) => {
		const user = group.members.find(member => member.uid === uid);
		return user ? user.name : "Unknown";
	};

	const formatDate = (timestamp) => {
		const date = timestamp.toDate();
		return date.toLocaleDateString() + " " + date.toLocaleTimeString();
	};

	useEffect(() => {
		if (contentRef.current) {
			if (isExpanded) {
				contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
			} else {
				contentRef.current.style.height = "0px";
			}
		}
	}, [isExpanded]);

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
				<div
					ref={contentRef}
					onClick={stopPropagation}
					className="overflow-hidden transition-height duration-300 ease-in-out
                        flex flex-col gap-1 p-4 border-t border-black dark:border-white cursor-auto"
					style={{ height: "0px" }}
				>
					<p><strong>Category:</strong> {ExpenseCategories[expense.category.toUpperCase()]}</p>
					<p><strong>Paid by:</strong> {getUserName(expense.paid)}</p>
					<p><strong>Amount:</strong> {expense.amount} {expense.currency}</p>
					<p><strong>Participation:</strong></p>
					<ul className="p-1">
						{Object.entries(expense.participation).map(([uid, p]) => (
							p.isIncluded
								? <li
									key={uid}
									className="flex justify-between w-full border-b border-b-gray-400 dark:border-b-gray-600 p-1"
								>
									<span>{getUserName(uid)}:</span>
									{p.amount} {expense.currency} {p.percentage}%</li>
								: <></>
						))}
					</ul>
					<button
						onClick={handleEdit}
						className="p-2 rounded-md font-bold dark:text-white border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition
                            disabled:bg-orange-300 hover:disabled:bg-orange-300 my-2"
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
					<p className="text-gray-500 text-sm"><i>
						{formatDate(expense.updatedAt)}
					</i></p>
					<DeleteExpenseModal
						open={deleteExpenseModalOpen}
						onClose={handleCloseDeleteExpenseModal}
						groupId={group.uid}
						expenseId={expense.uid}
						fetchExpenses={fetchExpenses}
					></DeleteExpenseModal>
					<CreateExpenseModal
						open={editExpenseModalOpen}
						onClose={handleCloseEditExpenseModal}
						group={group}
						fetchExpenses={fetchExpenses}
						expense={expense}
					></CreateExpenseModal>
				</div>
			)}
		</div>
	);
}

export default ExpenseItem;
