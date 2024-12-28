import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const { ResetPasswordAuth } = useAuth();

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			setMessage("");
			setLoading(true);
			setError("");
			await ResetPasswordAuth(email);
			setMessage("Check your inbox for further instructions");
		} catch {
			setError("Failed to reset password");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="h-screen flex items-center justify-center dark:bg-black">
			<div className="md:border border-black dark:border-white rounded-md flex flex-col w-screen max-w-screen-md p-4">
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<h1 className="text-2xl dark:text-white">
                        Password reset
					</h1>
					{
						message && <div className="p-4 rounded-md bg-green-400">
							{message}
						</div>
					}
					<label className="dark:text-white">
                        Email: <br />
						<input
							type="email"
							value={email}
							placeholder="john.smith@mail.com"
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-2 border border-black rounded-md dark:text-black"
						/>
					</label>
					<button
						type="submit"
						disabled={loading}
						className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                            disabled:bg-orange-200 hover:disabled:bg-orange-200"
					>
                        Reset password
					</button>
					<div className="text-sm text-red-500 text-center mt-[-10px]">
						<p className={ !error ? "hidden" : "visible"}>
							{error}
						</p>
					</div>
					<div className="dark:text-white text-center cursor-pointer">
						<Link to={"/login"}>Go back to log in</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ForgotPassword;
