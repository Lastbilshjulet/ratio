import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [passwordToggle, setPasswordToggle] = useState(true);
	const [loading, setLoading] = useState(false);
	const { SignUpAuth } = useAuth();
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();

		if (password.length < 16)
			return setError("Password is too short");

		try {
			setLoading(true);
			setError("");
			const response = await SignUpAuth(email, password);
			await setDoc(doc(db, "users", response.user.uid), { groups: [] });
			setLoading(false);
			navigate("/", { replace: true });
		} catch (e) {
			console.log(e);
			setLoading(false);
			setError("Failed to create an account");
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center dark:bg-black">
			<div className="md:border border-black dark:border-white rounded-md flex flex-col w-screen max-w-screen-md p-4">
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<h1 className="text-2xl dark:text-white text-center mb-8">
                        Sign up
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
                        Sign up
					</button>
					<div className="text-sm text-red-500 text-center mt-[-10px]">
						<p className={ !error ? "hidden" : "visible"}>
							{error}
						</p>
					</div>
				</form>
				<div className="mt-4 dark:text-white">
					<Link to={"/login"}>Already have an account? Log in</Link>
				</div>
			</div>
		</div>
	);
}

export default SignUp;
