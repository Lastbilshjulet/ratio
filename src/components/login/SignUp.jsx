import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordToggle, setPasswordToggle] = useState(true);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { SignUpAuth } = useAuth();

	async function handleSubmit(e) {
		e.preventDefault();

		if (password.length < 16)
			return setError("Password is too short");

		try {
			setLoading(true);
			setError("");
			await SignUpAuth(email, password);
		} catch {
			setError("Could not create an account");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<h1 className="text-2xl dark:text-white">
                    Sign up
				</h1>
				<label className="dark:text-white">
                    Email: <br />
					<input
						type="text"
						value={email}
						placeholder="john.smith@mail.com"
						onChange={(e) => setEmail(e.target.value)}
						className="w-full p-2 border border-black rounded-md dark:text-black"
					/>
				</label>
				<div>
					<label className="dark:text-white">
                        Password: <br />
						<input
							type={passwordToggle ? "password" : "text"}
							value={password}
							placeholder="IWMqwL9FJ8A%*QXEc^P2"
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-2 border border-black rounded-md dark:text-black"
						/>
					</label>
					<p
						className="text-sm dark:text-white text-center cursor-pointer"
						onClick={() => setPasswordToggle(!passwordToggle)}
					>
						{ passwordToggle ? "Show" : "Hide" } password
					</p>
				</div>
				<button
					type="submit"
					disabled={loading}
					className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                    disabled:bg-orange-200 hover:disabled:bg-orange-200"
				>
                    Sign up
				</button>
				<div className="text-sm text-red-500 text-center mt-[-10px]">
					<p className={ !error ? "hidden" : "visible"}>
						{error}
					</p>
				</div>
			</form>
			<div className="mt-4 dark:text-white">
                Already have an account? Log in
			</div>
		</div>
	);
}

export default SignUp;
