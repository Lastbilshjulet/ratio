import NavBar from "./components/NavBar";
import { useParams } from "react-router-dom";

function GroupDetails() {
	let { name } = useParams();

	return (
		<div className="h-screen dark:bg-black dark:text-white">
			<NavBar activeTab="groups"></NavBar>
			<div className="grid place-content-center gap-4 mt-24">
				Name: { name }
			</div>
		</div>
	);
}

export default GroupDetails;
