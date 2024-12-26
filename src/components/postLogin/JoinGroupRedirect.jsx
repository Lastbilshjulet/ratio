import { useState, useEffect } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import NavBar from "./components/NavBar";

function JoinGroupRedirect() {
	let { groupId } = useParams();
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const [error, setError] = useState("");

	const joinGroup = async () => {
		if (currentUser !== "") {
			try {
				await updateDoc(
					doc(db, "groups", groupId),
					{
						memberIds: arrayUnion(currentUser.uid),
						members: arrayUnion(
							{
								uid: currentUser.uid,
								name: currentUser.displayName
							}
						)
					}
				);

				const userRef = doc(db, "users", currentUser.uid);
				await updateDoc(userRef, {
					groups: arrayUnion(groupId)
				});

			    navigate("/", { replace: true });
			} catch (e) {
				console.log(e.message);
				setError("Failed to join group");
			}
		}
	};

	useEffect(() => {
		joinGroup();
	}, []);

	return (
		<div className="h-screen dark:bg-black dark:text-white">
			<NavBar activeTab=""></NavBar>
			<div className="w-screen p-4 max-w-screen-md flex flex-col m-auto gap-4">
				{
					currentUser.displayName === ""
						? <p>You need to add a display name to your account before joining or creating groups. </p>
						: <InfinitySpin
							visible={true}
							width="100"
							color="#f97316"
							ariaLabel="infinity-spin-loading"
						/>
				}
			</div>
			<div className="text-sm text-red-500 text-center mt-[-10px]">
				<p className={ error ? "visible" : "hidden" }>
					{error}
				</p>
			</div>
		</div>
	);
}

export default JoinGroupRedirect;
