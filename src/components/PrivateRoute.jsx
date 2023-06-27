import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


function PrivateRoute({ component: Component }) {
	const { currentUser } = useAuth();

	return (
		<>
			{currentUser ? <Component /> : <Navigate to="/login" />}
		</>

	);
}

export default PrivateRoute;
