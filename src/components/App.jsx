import { AuthProvider } from "../contexts/AuthContext";
import {
	createBrowserRouter,
	RouterProvider
} from "react-router-dom";
import SignUp from "./preLogin/SignUp";
import Login from "./preLogin/Login";
import GroupsDashboard from "./postLogin/GroupsDashboard";
import GroupDetails from "./postLogin/GroupDetails";
import FallbackComponent from "./FallbackComponent";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import ForgotPassword from "./preLogin/ForgotPassword";

const router = createBrowserRouter(
	[
		{
			path: "/signup",
			element: <PublicRoute component={SignUp} />
		},
		{
			path: "/login",
			element: <PublicRoute component={Login} />
		},
		{
			path: "/forgot-password",
			element: <PublicRoute component={ForgotPassword} />
		},
		{
			path: "/",
			element: <PrivateRoute component={GroupsDashboard} />
		},
		{
			path: "/groups",
			element: <PrivateRoute component={GroupsDashboard} />
		},
		{
			path: "/groups/:name",
			element: <PrivateRoute component={GroupDetails} />
		}
	]
);

function App() {
	return (
		<AuthProvider>
			<RouterProvider router={router} fallbackElement={<FallbackComponent />} />
		</AuthProvider>
	);
}

export default App;
