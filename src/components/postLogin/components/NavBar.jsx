import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";

function NavBar({ activeTab }) {
	const { LogOutAuth } = useAuth();

	async function handleLogout() {
		await LogOutAuth();
	}

	return (
		<nav className="w-screen p-4 flex items-center gap-8 justify-between dark:bg-black dark:text-white border-b border-b-black dark:border-b-white">
			<Link to={"/groups"}>

				<div className={"text-xl hover:text-orange-200 " + (activeTab === "groups" ? "text-orange-500" : "")}>
                Groups
				</div>
			</Link>
			<Link to={"/profile"}>
				<div className={"text-xl hover:text-orange-200 " + (activeTab === "profile" ? "text-orange-500" : "")}>
                Profile
				</div>
			</Link>
			<button
				onClick={handleLogout}
				className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                            disabled:bg-orange-200 hover:disabled:bg-orange-200"
			>
                        Log Out
			</button>
		</nav>
	);
}

export default NavBar;
