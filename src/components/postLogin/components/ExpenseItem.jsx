function ExpenseItem({ expense }) {
	return (
		<div className="grid justify-items-center border border-black dark:border-white rounded-md px-8 py-4">
			{ expense.name }
		</div>
	);
}

export default ExpenseItem;
