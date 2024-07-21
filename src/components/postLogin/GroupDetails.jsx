import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import NavBar from "./components/NavBar";

function GroupDetails() {
	let { groupId } = useParams();
	const { currentUser } = useAuth();
	const [group, setGroup] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchGroup = async () => {
		const docSnap = await getDoc(doc(db, "groups", groupId))
			.catch((e) => {
				console.log(e.message);
				setError("Something went wrong when fetching this group, you might not have permission. ");
			});
		setLoading(false);

		if (docSnap.exists()) {
			setGroup(docSnap.data());
			setError("");
		} else {
			setError("No document with this id could be found. ");
		}
	};

	const handleCopyInviteLinkClick = async () => {
		navigator.clipboard.writeText(window.location.href + "/join");
	};

	useEffect(() => {
		fetchGroup();
	}, []);

	return (
		<div className="h-screen dark:bg-black dark:text-white">
			<NavBar activeTab="groups"></NavBar>
			<div className="grid place-content-center gap-4 mt-24">
				{
					loading ? <InfinitySpin
						visible={loading}
						width="100"
						color="#f97316"
						ariaLabel="infinity-spin-loading"
					/>
						: <div>
							<button
								onClick={handleCopyInviteLinkClick}
								className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                                    disabled:bg-orange-200 hover:disabled:bg-orange-200"
							>
                                Copy invite link
							</button>
							<p>Name: {group.name}</p>
							{
								group.members.length > 1
									? <p>Members: {group.members.filter(m => m.uid !== currentUser.uid).join(", ")}</p>
									: <></>
							}

						</div>
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

export default GroupDetails;
