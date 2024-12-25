import NavBar from "./components/NavBar";
import GroupItem from "./components/GroupItem";
import CreateGroupModal from "./components/CreateGroupModal";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { InfinitySpin } from "react-loader-spinner";

function GroupsDashboard() {
	const { currentUser } = useAuth();
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
	const handleOpenCreateGroupModal = () => setCreateGroupModalOpen(true);
	const handleCloseCreateGroupModal = () => setCreateGroupModalOpen(false);

	const fetchGroups = async () => {
		setLoading(true);
		const q = query(collection(db, "groups"), where("memberIds", "array-contains", currentUser.uid));
		await getDocs(q)
			.then((querySnapshot) => {
				const newData = querySnapshot.docs
					.map(
						(doc) => ({
							...doc.data(),
							id: doc.id
						})
					);
				setGroups(newData);
				setError("");
			})
			.catch((e) => {
				console.log(e.message);
				setError("Failed to fetch groups");
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchGroups();
	}, []);

	return (
		<div className="h-screen dark:bg-black dark:text-white">
			<NavBar activeTab="groups"></NavBar>
			<div className="w-screen p-4 max-w-screen-md flex flex-col m-auto gap-4">
				<button
					onClick={handleOpenCreateGroupModal}
					disabled={loading}
					className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                        disabled:bg-orange-200 hover:disabled:bg-orange-200"
				>
                    Create new group
				</button>
				<div className="flex flex-col gap-4">
					{
						currentUser.displayName === ""
							? <p>You need to add a display name to your account before joining or creating groups. </p>
							: (
								loading
									? <InfinitySpin
										visible={loading}
										width="100"
										color="#f97316"
										ariaLabel="infinity-spin-loading"
									/>
									: groups.map(group => (
										<GroupItem key={group.id} group={group}></GroupItem>
									))
							)
					}
				</div>
				<div className="text-sm text-red-500 text-center mt-[-10px]">
					<p className={ error ? "visible" : "hidden" }>
						{error}
					</p>
				</div>
			</div>
			<CreateGroupModal open={ createGroupModalOpen } onClose={ handleCloseCreateGroupModal } fetchGroups={ fetchGroups } />
		</div>
	);
}

export default GroupsDashboard;
