import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import NavBar from "./components/NavBar";
import ExpenseItem from "./components/ExpenseItem";
import AddExpenseModal from "./components/AddExpenseModal";

function GroupDetails() {
	let { groupId } = useParams();
	const { currentUser } = useAuth();
	const [group, setGroup] = useState({});
	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [addCreateModalOpen, setAddExpenseModalOpen] = useState(false);
	const handleOpenAddExpenseModal = () => setAddExpenseModalOpen(true);
	const handleCloseAddExpenseModal = () => setAddExpenseModalOpen(false);

	useEffect(() => {
		fetchGroup();
	}, []);

	const fetchGroup = async () => {
		setLoading(true);
		const docSnap = await getDoc(doc(db, "groups", groupId))
			.catch((e) => {
				console.log(e.message);
				setError("Something went wrong when fetching this group, you might not have permission. ");
			});
		setLoading(false);

		if (docSnap.exists()) {
			setGroup(docSnap.data());
			setError("");
			fetchGroupExpenses();
		} else {
			setError("No document with this id could be found. ");
		}
	};

	const fetchGroupExpenses = async () => {
		setLoading(true);
		await getDocs(collection(doc(db, "groups", groupId), "expenses"))
			.then((querySnapshot) => {
				const newData = querySnapshot.docs
					.map(
						(doc) => ({
							...doc.data(),
							id: doc.id
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

	const handleAddExpenseClick = async () => {
		handleOpenAddExpenseModal();
	};

	return (
		<div className="h-screen dark:bg-black dark:text-white">
			<NavBar activeTab="groups"></NavBar>
			<div className="grid place-content-center gap-4">
				{
					loading ? <InfinitySpin
						visible={loading}
						width="100"
						color="#f97316"
						ariaLabel="infinity-spin-loading"
					/>
						: <div className="flex flex-col gap-4 w-screen max-w-screen-md p-4">
							<button
								onClick={handleCopyInviteLinkClick}
								className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                                    disabled:bg-orange-200 hover:disabled:bg-orange-200"
							>
                                Copy invite link
							</button>
							<button
								onClick={handleAddExpenseClick}
								className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                                    disabled:bg-orange-200 hover:disabled:bg-orange-200"
							>
                                Add expense
							</button>
							<p>Name: {group.name}</p>
							{
								group.members.length > 1
									? <p>Members: {group.members.filter(m => m.uid !== currentUser.uid).map(m => m.name).join(", ")}</p>
									: <></>
							}
							<div>
                                Expenses:
								{
									expenses.map(expense =>
										<ExpenseItem key={expense.id} expense={expense}></ExpenseItem>
									)
								}
							</div>
						</div>
				}
			</div>
			<div className="text-sm text-red-500 text-center mt-[-10px]">
				<p className={ error ? "visible" : "hidden" }>
					{error}
				</p>
			</div>
			<AddExpenseModal open={ addCreateModalOpen } onClose={ handleCloseAddExpenseModal } group={ group } fetchExpenses={ fetchGroupExpenses } />
		</div>
	);
}

export default GroupDetails;
