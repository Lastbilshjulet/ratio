import { useAuth } from "../../contexts/AuthContext";

function Dashboard() {
	const { LogOutAuth } = useAuth();

	async function handleClick() {
		await LogOutAuth();
	}

	return (
		<div className="h-screen flex flex-col items-center justify-center gap-8 dark:bg-black dark:text-white">
			<div>Dashboard</div>
			<button onClick={handleClick}>Log out</button>
		</div>
	);
}

export default Dashboard;
