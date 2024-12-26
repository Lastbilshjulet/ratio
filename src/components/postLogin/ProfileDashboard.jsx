import NavBar from "./components/NavBar";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "firebase/auth";
import { useState } from "react";

function ProfileDashboard() {
	const { currentUser, ResetPasswordAuth } = useAuth();
	const [loading, setLoading] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const [passwordMessage, setPasswordMessage] = useState("");
	const [displayName, setDisplayName] = useState(currentUser.displayName == null ? "" : currentUser.displayName);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	async function handleProfileDetails(e) {
		e.preventDefault();
		setLoading(true);

		updateProfile((currentUser), {
			displayName: displayName
		}).then(() => {
			setMessage("Successfully updated profile.");
		}).catch(() => {
			setError("Failed to update profile.");
		}).finally(() => {
			setLoading(false);
		});
	}

	async function handleResetPassword(e) {
		e.preventDefault();

		try {
			setLoading(true);
			await ResetPasswordAuth(currentUser.email);
			setPasswordMessage("Check your inbox for further instructions");
		} catch {
			setPasswordError("Failed to reset password");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="h-screen dark:bg-black dark:text-white">
			<NavBar activeTab="profile"></NavBar>
			<div className="w-screen p-4 max-w-screen-md flex flex-col m-auto gap-4">
				<form className="flex flex-col gap-4" onSubmit={handleProfileDetails}>
					{
						message && <div className="p-4 rounded-md bg-green-400 text-gray-800">
							{message}
						</div>
					}
					<label className="dark:text-white">
                        Display name: <br />
						<input
							type="text"
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							className="w-full p-2 border border-black rounded-md dark:text-black focus:outline focus:outline-orange-500"
						/>
					</label>
					<label className="dark:text-white">
                        Email: <br />
						<input
							type="email"
							value={currentUser.email}
							disabled
							className="w-full p-2 border border-black rounded-md bg-gray-200 text-black"
						/>
					</label>
					<button
						type="submit"
						disabled={loading}
						className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600
                            disabled:bg-orange-200 hover:disabled:bg-orange-200 focus:outline-orange-500"
					>
                        Update profile
					</button>
					{
						error && <div className="text-sm text-red-500 text-center mt-[-10px]">
							<p className={ !error ? "hidden" : "visible"}>
								{error}
							</p>
						</div>
					}
				</form>
				<form className="mt-4 flex flex-col gap-4" onSubmit={handleResetPassword}>
					{
						passwordMessage && <div className="p-4 rounded-md bg-green-400 text-gray-800">
							{passwordMessage}
						</div>
					}
					<button
						type="submit"
						disabled={loading}
						className="p-2 rounded-md font-bold dark:text-white border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition
                            disabled:bg-orange-300 hover:disabled:bg-orange-300"
					>
                        Reset password
					</button>
					{
						passwordError && <div className="text-sm text-red-500 text-center mt-[-10px]">
							<p className={ !passwordError ? "hidden" : "visible"}>
								{passwordError}
							</p>
						</div>
					}
				</form>
			</div>
		</div>
	);
}

export default ProfileDashboard;
