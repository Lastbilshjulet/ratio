import { useAuth } from "../../contexts/AuthContext";

function Dashboard() {
	const { LogOutAuth } = useAuth();

	async function handleLogout() {
		await LogOutAuth();
	}

	return (
		<div className="h-screen flex flex-col items-center justify-center gap-8 dark:bg-black dark:text-white">
			<div>Dashboard</div>
			<button onClick={handleLogout}>Log out</button>
		</div>
	);
}

export default Dashboard;
