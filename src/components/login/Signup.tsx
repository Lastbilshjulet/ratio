import { useState } from "react";

function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordToggle, setPasswordToggle] = useState(true);

	return (
		<div>
			<form className="flex flex-col gap-4">
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
						className="w-full p-2 rounded-md dark:text-black"
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
							className="w-full p-2 rounded-md dark:text-black"
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
					className="mb-4 p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white"
				>
                    Sign up
				</button>
			</form>
			<div className="dark:text-white">
                Already have an account? Log in
			</div>
		</div>
	);
}

export default Signup;
