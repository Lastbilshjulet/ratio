import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";


function PublicRoute({ component: Component }) {
	const { currentUser } = useAuth();

	return (
		<>
			{currentUser ? <Navigate to="/" /> : <Component />}
		</>
	);
}

export default PublicRoute;
