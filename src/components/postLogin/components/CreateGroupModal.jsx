import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../firebase";
import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";

function CreateGroupModal({ open, onClose, fetchGroups }) {
	const { currentUser } = useAuth();
	const [groupName, setGroupName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			setLoading(true);
			setError("");

			const groupData = {
				name: groupName,
				memberIds: [currentUser.uid],
				members: [
					{
						uid: currentUser.uid,
						name: currentUser.displayName
					}
				],
				createdAt: Timestamp.now()
			};
			await addDoc(collection(db, "groups"), groupData);

			fetchGroups();
			onClose();
		} catch(e) {
			console.log(e.message);
			setError("Failed to create group");
		} finally {
			setLoading(false);
		}
	}

	const toggleClose = () => {
		onClose();
	};

	const stopClose = (e) => {
		e.stopPropagation();
	};

	return (
		<div
			onClick={toggleClose}
			className={"fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-30 dark:bg-opacity-70 grid place-items-center " + (open ? "visible" : "hidden")}
		>
			<div
			    onClick={stopClose}
				className="w-96 bg-white dark:bg-black dark:text-white border border-black dark:border-white rounded-xl"
			>
				<form className="flex flex-col gap-4 px-16 py-8" onSubmit={handleSubmit}>
					<h1 className="text-2xl dark:text-white text-center mb-4">
                        Create new group
					</h1>
					<label className="dark:text-white">
                        Group name: <br />
						<input
							type="text"
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
							className="w-full p-2 border border-black rounded-md dark:text-black"
						/>
					</label>
					<button
						type="submit"
						disabled={loading || !currentUser}
						className="p-2 rounded-md font-bold text-white bg-orange-500 hover:bg-orange-400 transition hover:dark:bg-orange-600 hover:dark:text-white
                            disabled:bg-orange-200 hover:disabled:bg-orange-200"
					>
                        Create group
					</button>
					<div className="text-sm text-red-500 text-center mt-[-10px]">
						<p className={ error ? "visible" : "hidden" }>
							{error}
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}

export default CreateGroupModal;
