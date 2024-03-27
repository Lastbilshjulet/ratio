import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [passwordToggle, setPasswordToggle] = useState(true);
	const [loading, setLoading] = useState(false);
	const { LogInAuth } = useAuth();
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			setLoading(true);
			setError("");
			await LogInAuth(email, password);
		} catch {
			setError("Failed to log in");
		} finally {
			setLoading(false);
			navigate("/", { replace: true });
		}
	}

	return (
		<div className="h-screen flex items-center justify-center dark:bg-black">
			<div className="border border-black dark:border-white rounded-md p-8">
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<h1 className="text-2xl dark:text-white">
                        Log in
					</h1>
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
                        Log in
					</button>
					<div className="text-sm text-red-500 text-center mt-[-10px]">
						<p className={ error ? "visible" : "hidden" }>
							{error}
						</p>
					</div>
				</form>
				<div className="mt-4 dark:text-white">
					<Link to={"/forgot-password"}>Forgot password?</Link>
				</div>
				<div className="mt-4 dark:text-white">
					<Link to={"/signup"}>Don&apos;t have an account? Sign up</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
