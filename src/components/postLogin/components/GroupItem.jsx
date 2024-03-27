import { Link } from "react-router-dom";

function GroupItem({ name }) {
	return (
		<Link to={"/groups/" + name}>
			<div className="w-64 border border-black dark:border-white rounded-md px-8 py-4">
				{ name }
			</div>
		</Link>
	);
}

export default GroupItem;
