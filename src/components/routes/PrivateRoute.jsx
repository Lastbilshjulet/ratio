import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function PrivateRoute({ component: Component }) {
	const { currentUser } = useAuth();
	const location = useLocation();

	return (
		<>
			{currentUser ? (
				<Component />
			) : (
				<Navigate to={`/login?redirect=${location.pathname}`} />
			)}
		</>
	);
}

export default PrivateRoute;
