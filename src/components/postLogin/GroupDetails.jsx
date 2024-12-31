import { useState, useEffect, useRef } from "react";
import { collection, doc, getDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import NavBar from "./components/NavBar";
import ExpenseItem from "./components/ExpenseItem";
import CreateExpenseModal from "./components/modals/CreateExpenseModal";
import { ExpenseCategories } from "../../models/ExpenseCategories";

function GroupDetails() {
	let { groupId } = useParams();
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const [group, setGroup] = useState({});
	const [expenses, setExpenses] = useState([]);
	const [categoryFilter, setCategoryFilter] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [activeTab, setActiveTab] = useState("expenses");
	const [createExpenseModalOpen, setCreateExpenseModalOpen] = useState(false);
	const handleOpenCreateExpenseModal = () => setCreateExpenseModalOpen(true);
	const handleCloseCreateExpenseModal = () => setCreateExpenseModalOpen(false);

	const expensesRef = useRef(null);
	const standingsRef = useRef(null);
	const paymentsRef = useRef(null);

	useEffect(() => {
		fetchGroup();
		setActiveTab("expenses");
	}, []);

	const handleTabClick = (tab, ref) => {
		setActiveTab(tab);
		ref.current.scrollIntoView({ behavior: "smooth" });
	};

	const fetchGroup = async () => {
		setLoading(true);
		const docSnap = await getDoc(doc(db, "groups", groupId))
			.catch((e) => {
				console.log(e.message);
			    navigate("/not-found", { replace: true });
			});

		if (docSnap && docSnap.exists()) {
			setGroup({ ...docSnap.data(),
				uid: docSnap.id });
			setError("");
			fetchGroupExpenses();
		} else {
			console.log("docSnap does not exist");
			navigate("/not-found", { replace: true });
		}
	};

	const fetchGroupExpenses = async () => {
		const q = query(
			collection(doc(db, "groups", groupId), "expenses"),
			orderBy("createdAt", "desc")
		);
		await getDocs(q)
			.then((querySnapshot) => {
				const newData = querySnapshot.docs
					.map(
						(doc) => ({
							...doc.data(),
							uid: doc.id
						})
					);
				setExpenses(newData);
				setError("");
			})
			.catch((e) => {
				console.log(e.message);
				setError("Something went wrong when fetching the expenses. ");
			});
		setLoading(false);
		setError("");
	};

	const handleCopyInviteLinkClick = async () => {
		navigator.clipboard.writeText(window.location.href + "/join");
	};

	const handleCreateExpenseClick = async () => {
		handleOpenCreateExpenseModal();
	};

	const getUserName = (uid) => {
		const user = group.members.find(member => member.uid === uid);
		return user ? user.name : "Unknown";
	};

	const getParticipationPerMember = () => {
		const participationPerMember = {};

		expenses.forEach(expense => {
			if (categoryFilter ? (categoryFilter.toLowerCase() === expense.category.toLowerCase()) : true) {
				Object.entries(expense.participation).forEach(([uid, amount]) => {
					if (!participationPerMember[uid]) {
						participationPerMember[uid] = 0;
					}
					participationPerMember[uid] += parseFloat(amount);
				});
			}
		});

		return participationPerMember;
	};

	const participationPerMember = getParticipationPerMember();
	const sortedParticipation = Object.entries(participationPerMember).sort((a, b) => b[1] - a[1]);

	const calculateBalances = () => {
		const balances = {};

		expenses.filter(e => categoryFilter ? (categoryFilter.toLowerCase() === e.category.toLowerCase()) : true).forEach(expense => {
			const paidBy = expense.paid;
			const amountPaid = parseFloat(expense.amount);

			if (!balances[paidBy]) {
				balances[paidBy] = 0;
			}
			balances[paidBy] -= amountPaid;

			Object.entries(expense.participation).forEach(([uid, amount]) => {
				if (!balances[uid]) {
					balances[uid] = 0;
				}
				balances[uid] += parseFloat(amount);
			});
		});

		return balances;
	};

	const balances = calculateBalances();

	const calculateTransactions = () => {
		const transactions = [];
		const creditors = [];
		const debtors = [];

		Object.entries(balances).forEach(([uid, balance]) => {
			if (balance > 0) {
				creditors.push({ uid,
					balance });
			} else if (balance < 0) {
				debtors.push({ uid,
					balance: -balance });
			}
		});

		creditors.sort((a, b) => b.balance - a.balance);
		debtors.sort((a, b) => b.balance - a.balance);

		while (creditors.length && debtors.length) {
			const creditor = creditors[0];
			const debtor = debtors[0];

			const amount = Math.min(creditor.balance, debtor.balance);
			transactions.push({
				from: creditor.uid,
				to: debtor.uid,
				amount
			});

			creditor.balance -= amount;
			debtor.balance -= amount;

			if (creditor.balance === 0) {
				creditors.shift();
			}
			if (debtor.balance === 0) {
				debtors.shift();
			}
		}

		return transactions;
	};

	const transactions = calculateTransactions();
	const sortedTransactions = transactions.sort((a, b) => b.amount - a.amount);

	return (
		<div className="min-h-screen dark:bg-black dark:text-white">
			<NavBar activeTab="groups"></NavBar>
			<div className="grid place-content-center gap-4">
				{
					loading ? <InfinitySpin
						visible={loading}
						width="100"
						color="#f97316"
						ariaLabel="infinity-spin-loading"
					/>
						: <div className="flex flex-col w-screen max-w-screen-md">
							<div className="m-4 flex flex-col sm:flex-row gap-4">
								<button
									onClick={handleCreateExpenseClick}
									className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 hover:dark:bg-orange-600 hover:dark:text-white
                                    disabled:bg-orange-200 hover:disabled:bg-orange-200 flex-1"
								>
                                    Create expense
								</button>
								<button
									onClick={handleCopyInviteLinkClick}
									className="p-2 rounded-md font-bold dark:text-white border-2 border-orange-500 hover:bg-orange-500 hover:text-white
                                    disabled:bg-orange-300 hover:disabled:bg-orange-300 flex-1"
								>
                                    Copy invite link
								</button>
							</div>
							<p className="mx-4">Name: {group.name}</p>
							{
								group.members?.length > 1
									? <p className="mx-4">Members: {group.members.filter(m => m.uid !== currentUser.uid).map(m => m.name).join(", ")}</p>
									: <></>
							}
							<div className="flex overflow-x-auto gap-2 px-4 scrollbar-hide">
								{
									Object.entries(ExpenseCategories).map(([key, value]) => (
										<button
											key={key}
											onClick={() => { if (categoryFilter === key) {setCategoryFilter("");} else {setCategoryFilter(key);} }}
											className={"p-2 rounded-md font-bold dark:text-white border-2 border-orange-500 hover:bg-orange-500 hover:text-white "
                                                 + "disabled:bg-orange-300 hover:disabled:bg-orange-300 mt-4" + (categoryFilter === key ? " bg-orange-500 text-white" : "")}
										>
											{value}
										</button>
									))
								}
							</div>
							<div className="flex w-screen max-w-screen-md md:px-4">
								<div
									className={`w-1/3 pt-4 text-center cursor-pointer ${activeTab === "expenses" ? "border-b-4 border-orange-500" : ""}`}
									onClick={() => handleTabClick("expenses", expensesRef)}
								>
									<h2 className="font-bold cursor-pointer pb-2">Expenses</h2>
								</div>
								<div
									className={`w-1/3 pt-4 text-center cursor-pointer ${activeTab === "standings" ? "border-b-4 border-orange-500" : ""}`}
									onClick={() => handleTabClick("standings", standingsRef)}
								>
									<h2 className="font-bold cursor-pointer pb-2">Standings</h2>
								</div>
								<div
									className={`w-1/3 pt-4 text-center cursor-pointer ${activeTab === "payments" ? "border-b-4 border-orange-500" : ""}`}
									onClick={() => handleTabClick("payments", paymentsRef)}
								>
									<h2 className="font-bold cursor-pointer pb-2">Payments</h2>
								</div>
							</div>
							<div className="flex overflow-x-auto scroll-snap-x mandatory scrollbar-hide">
								<div ref={expensesRef} className="flex-shrink-0 w-screen max-w-screen-md p-4 scroll-snap-align-start">
									{
										expenses.filter(e => categoryFilter ? (categoryFilter.toLowerCase() === e.category.toLowerCase()) : true).length === 0
											? <p className="dark:text-white text-center">No expenses found</p>
											: <div className="flex flex-col gap-4">
												{
													expenses.filter(e => categoryFilter ? (categoryFilter.toLowerCase() === e.category.toLowerCase()) : true).map(expense =>
														<ExpenseItem key={expense.uid} expense={expense} group={group} fetchExpenses={fetchGroupExpenses}></ExpenseItem>
													)
												}
											</div>
									}
								</div>
								<div ref={standingsRef} className="flex-shrink-0 w-screen max-w-screen-md p-4 scroll-snap-align-start">
									{
										sortedParticipation.length === 0
											? <p className="dark:text-white text-center">No participation data found</p>
											: <div className="flex flex-col gap-4">
												{
													sortedParticipation.map(([uid, amount]) => {
														const member = getUserName(uid);
														return (
															<div key={uid} className="flex justify-between">
																<span>{member}</span>
																<span>{amount.toFixed(2)}</span>
															</div>
														);
													})
												}
											</div>
									}
								</div>
								<div ref={paymentsRef} className="flex-shrink-0 w-screen max-w-screen-md p-4 scroll-snap-align-start">
									{
										sortedTransactions.length === 0
											? <p className="dark:text-white text-center">No payment data found</p>
											: <div className="flex flex-col gap-4">
												{
													sortedTransactions.map((transaction, index) => {
														const fromMember = getUserName(transaction.from);
														const toMember = getUserName(transaction.to);
														return (
															<div key={index} className="flex justify-between">
																<span><strong>{fromMember}</strong> owes <strong>{toMember}</strong></span>
																<span>{transaction.amount.toFixed(2)}</span>
															</div>
														);
													})
												}
											</div>
									}
								</div>
							</div>
						</div>
				}
			</div>
			<div className="text-sm text-red-500 text-center">
				<p className={ error ? "visible" : "hidden" }>
					{error}
				</p>
			</div>
			<CreateExpenseModal open={ createExpenseModalOpen } onClose={ handleCloseCreateExpenseModal } group={ group } fetchExpenses={ fetchGroupExpenses } />
		</div>
	);
}

export default GroupDetails;
