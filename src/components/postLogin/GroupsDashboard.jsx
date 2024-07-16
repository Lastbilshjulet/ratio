import NavBar from "./components/NavBar";
import GroupItem from "./components/GroupItem";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

function GroupsDashboard() {
	const [groups, setGroups] = useState([]);

	const fetchGroups = async () => {
		await getDocs(collection(db, "groups"))
			.then((querySnapshot) => {
				const newData = querySnapshot.docs
					.map((doc) => ({ ...doc.data(),
						id:doc.id }));
				setGroups(newData);
			})
			.catch((e) => {
				console.log(e.message);
				alert(e.message);
			})
			.finally(() => {
				console.log(groups);
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
					groups.map(group => (
				        <GroupItem key={group.id} name={group.name}></GroupItem>
					))
				}
			</div>
		</div>
	);
}

export default GroupsDashboard;
