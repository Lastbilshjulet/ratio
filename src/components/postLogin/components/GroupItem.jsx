import { Link } from "react-router-dom";

function GroupItem({ group }) {
	return (
		<Link to={"/groups/" + group.id}>
			<div className="grid justify-items-center border border-black dark:border-white rounded-md px-8 py-4">
				{ group.name }
			</div>
		</Link>
	);
}

export default GroupItem;
