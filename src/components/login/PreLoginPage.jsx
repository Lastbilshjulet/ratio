import SignUp from "./SignUp";

function PreLoginPage() {
	return (
		<div className="h-screen flex items-center justify-center dark:bg-black">
			<div className="border border-black dark:border-white rounded-md p-8">
				<SignUp />
			</div>
		</div>
	);
}

export default PreLoginPage;
