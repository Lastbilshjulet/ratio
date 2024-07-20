import NavBar from "./components/NavBar";
import GroupItem from "./components/GroupItem";
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

	const fetchGroups = async () => {
		const q = query(collection(db, "groups"), where("members", "array-contains", currentUser.uid));
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
				setError(e.message);
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
			<div className="grid place-content-center gap-4 mt-24">
				{
					loading ? <InfinitySpin
						visible={loading}
						width="100"
						color="#f97316"
						ariaLabel="infinity-spin-loading"
					/>
						: groups.map(group => (
				        <GroupItem key={group.id} name={group.name}></GroupItem>
						))
				}
				<div className="text-sm text-red-500 text-center mt-[-10px]">
					<p className={ error ? "visible" : "hidden" }>
						{error}
					</p>
				</div>
			</div>
		</div>
	);
}

export default GroupsDashboard;
