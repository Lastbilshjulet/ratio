import Signup from "./Signup";

function PreLoginPage() {
	return (
		<div className="h-screen flex items-center justify-center dark:bg-black">
			<div className="border-4 border-black dark:border-white rounded-md p-8">
				<Signup />
			</div>
		</div>
	);
}

export default PreLoginPage;
