import NavBar from "./components/NavBar";
import GroupItem from "./components/GroupItem";

function GroupsDashboard() {
	return (
		<div className="h-screen dark:bg-black dark:text-white">
			<NavBar activeTab="groups"></NavBar>
			<div className="grid place-content-center gap-4 mt-24">
				<GroupItem name="London"></GroupItem>
				<GroupItem name="Roadtrip"></GroupItem>
				<GroupItem name="Grekland"></GroupItem>
			</div>
		</div>
	);
}

export default GroupsDashboard;
