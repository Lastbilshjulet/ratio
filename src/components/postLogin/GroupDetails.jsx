import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import NavBar from "./components/NavBar";
import ExpenseItem from "./components/ExpenseItem";
import CreateExpenseModal from "./components/modals/CreateExpenseModal";

function GroupDetails() {
	let { groupId } = useParams();
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const [group, setGroup] = useState({});
	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [createExpenseModalOpen, setCreateExpenseModalOpen] = useState(false);
	const handleOpenCreateExpenseModal = () => setCreateExpenseModalOpen(true);
	const handleCloseCreateExpenseModal = () => setCreateExpenseModalOpen(false);

	useEffect(() => {
		fetchGroup();
	}, []);

	const fetchGroup = async () => {
		setLoading(true);
		const docSnap = await getDoc(doc(db, "groups", groupId))
			.catch((e) => {
				console.log(e.message);
			    navigate("/not-found", { replace: true });
			});
		setLoading(false);

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

	const handleCreateExpenseClick = async () => {
		handleOpenCreateExpenseModal();
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
								onClick={handleCreateExpenseClick}
								className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                                    disabled:bg-orange-200 hover:disabled:bg-orange-200"
							>
                                Create expense
							</button>
							<p>Name: {group.name}</p>
							{
								group.members?.length > 1
									? <p>Members: {group.members.filter(m => m.uid !== currentUser.uid).map(m => m.name).join(", ")}</p>
									: <></>
							}
							{
								expenses.length === 0 ? <></>
									: <div className="flex flex-col gap-4">
										{
											expenses.map(expense =>
												<ExpenseItem key={expense.id} expense={expense} group={group} fetchExpenses={fetchGroupExpenses}></ExpenseItem>
											)
										}
									</div>
							}
						</div>
				}
			</div>
			<div className="text-sm text-red-500 text-center mt-[-10px]">
				<p className={ error ? "visible" : "hidden" }>
					{error}
				</p>
			</div>
			<CreateExpenseModal open={ createExpenseModalOpen } onClose={ handleCloseCreateExpenseModal } group={ group } fetchExpenses={ fetchGroupExpenses } />
		</div>
	);
}

export default GroupDetails;
